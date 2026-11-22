import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { TiposEventos } from '../../../generated/prisma/enums.js';
import { CriarEventoDto } from './dto/eventos.dto.js';

export type ItemRanking = { nome: string; valor: number };

@Injectable()
export class EventosService {
  constructor(private readonly prisma: PrismaService) {}

  /* ------------------------------------------------------------------ */
  /* REGISTRAR EVENTO (chamado pelo site da loja)                        */
  /* ------------------------------------------------------------------ */

  async registrar(dto: CriarEventoDto): Promise<void> {
    // Busca: só precisa do termo
    if (dto.tipo === TiposEventos.BUSCOU) {
      const termo = dto.termo_busca?.trim().toLowerCase();
      if (!termo) throw new BadRequestException('Informe o termo da busca.');

      await this.prisma.eventos_veiculos.create({
        data: { tipo: dto.tipo, termo_busca: termo },
      });
      return;
    }

    // Visualização / WhatsApp: precisa do veículo
    if (!dto.veiculo_id) {
      throw new BadRequestException('Informe o veículo.');
    }

    const veiculo = await this.prisma.veiculos.findUnique({
      where: { public_id: dto.veiculo_id },
      select: { id: true },
    });
    if (!veiculo) throw new NotFoundException('Veículo não encontrado.');

    await this.prisma.eventos_veiculos.create({
      data: { tipo: dto.tipo, veiculo_id: veiculo.id },
    });
  }

  /* ------------------------------------------------------------------ */
  /* DASHBOARD (junta tudo numa chamada só)                              */
  /* ------------------------------------------------------------------ */

  async dashboard(diasRecebidos: number) {
    const dias = [7, 30, 60].includes(diasRecebidos) ? diasRecebidos : 7;
    const desde = new Date(Date.now() - dias * 24 * 60 * 60 * 1000);

    const [
      visualizacoes,
      cliquesWhatsapp,
      veiculosAtivos,
      avaliacoesPendentes,
      mediaEstrelas,
      maisVistas,
      maisCliquesWhatsapp,
      termosBuscados,
      estoquePorMarca,
      semVisualizacoes,
    ] = await Promise.all([
      this.contarEventos(TiposEventos.VISUALIZOU, desde),
      this.contarEventos(TiposEventos.CLICOU_WHATSAPP, desde),
      this.contarVeiculosAtivos(),
      this.contarAvaliacoesPendentes(),
      this.mediaEstrelas(),
      this.rankingVeiculos(TiposEventos.VISUALIZOU, desde),
      this.rankingVeiculos(TiposEventos.CLICOU_WHATSAPP, desde),
      this.termosMaisBuscados(desde),
      this.estoquePorMarca(),
      this.veiculosSemVisualizacao(desde),
    ]);

    return {
      dias,
      resumo: {
        visualizacoes,
        cliquesWhatsapp,
        conversao: this.calcularConversao(cliquesWhatsapp, visualizacoes),
        veiculosAtivos,
        avaliacoesPendentes,
        mediaEstrelas,
      },
      maisVistas,
      maisCliquesWhatsapp,
      termosBuscados,
      estoquePorMarca,
      semVisualizacoes,
    };
  }

  /* ------------------------------------------------------------------ */
  /* CARDS                                                               */
  /* ------------------------------------------------------------------ */

  // Visualizações e cliques no WhatsApp (depende do tipo)
  contarEventos(tipo: TiposEventos, desde: Date): Promise<number> {
    return this.prisma.eventos_veiculos.count({
      where: { tipo, criado_em: { gte: desde } },
    });
  }

  contarVeiculosAtivos(): Promise<number> {
    return this.prisma.veiculos.count({ where: { ativo: true } });
  }

  contarAvaliacoesPendentes(): Promise<number> {
    return this.prisma.avaliacao.count({ where: { aprovada: false } });
  }

  // Média só das avaliações aprovadas
  async mediaEstrelas(): Promise<number> {
    const r = await this.prisma.avaliacao.aggregate({
      where: { aprovada: true },
      _avg: { estrelas: true },
    });
    return Number((r._avg.estrelas ?? 0).toFixed(1));
  }

  // Cliques no WhatsApp ÷ visualizações, em %
  calcularConversao(cliques: number, visualizacoes: number): number {
    if (visualizacoes === 0) return 0;
    return Number(((cliques / visualizacoes) * 100).toFixed(1));
  }

  /* ------------------------------------------------------------------ */
  /* RANKINGS                                                            */
  /* ------------------------------------------------------------------ */

  // Serve para "mais vistas" (VISUALIZOU) e "mais cliques" (CLICOU_WHATSAPP)
  async rankingVeiculos(
    tipo: TiposEventos,
    desde: Date,
    limite = 5,
  ): Promise<ItemRanking[]> {
    const grupos = await this.prisma.eventos_veiculos.groupBy({
      by: ['veiculo_id'],
      where: { tipo, criado_em: { gte: desde }, veiculo_id: { not: null } },
      _count: { veiculo_id: true },
      orderBy: { _count: { veiculo_id: 'desc' } },
      take: limite,
    });

    const ids = grupos
      .map((g) => g.veiculo_id)
      .filter((id): id is number => id !== null);

    const veiculos = await this.prisma.veiculos.findMany({
      where: { id: { in: ids } },
      select: { id: true, nome: true },
    });
    const nomes = new Map(veiculos.map((v) => [v.id, v.nome]));

    return grupos.map((g) => ({
      nome: nomes.get(g.veiculo_id as number) ?? 'Veículo removido',
      valor: g._count.veiculo_id,
    }));
  }

  async termosMaisBuscados(desde: Date, limite = 5): Promise<ItemRanking[]> {
    const grupos = await this.prisma.eventos_veiculos.groupBy({
      by: ['termo_busca'],
      where: {
        tipo: TiposEventos.BUSCOU,
        criado_em: { gte: desde },
        termo_busca: { not: null },
      },
      _count: { termo_busca: true },
      orderBy: { _count: { termo_busca: 'desc' } },
      take: limite,
    });

    return grupos.map((g) => ({
      nome: g.termo_busca as string,
      valor: g._count.termo_busca,
    }));
  }

  // Quantidade de veículos ativos por marca (marca fica em Modelos)
  async estoquePorMarca(): Promise<ItemRanking[]> {
    const marcas = await this.prisma.marcas.findMany({
      select: {
        descricao: true,
        modelos: {
          select: {
            _count: { select: { veiculos: { where: { ativo: true } } } },
          },
        },
      },
    });

    return marcas
      .map((m) => ({
        nome: m.descricao,
        valor: m.modelos.reduce((total, mod) => total + mod._count.veiculos, 0),
      }))
      .filter((m) => m.valor > 0)
      .sort((a, b) => b.valor - a.valor);
  }

  // Veículos ativos sem nenhuma visualização no período ("encalhados")
  async veiculosSemVisualizacao(
    desde: Date,
    limite = 10,
  ): Promise<ItemRanking[]> {
    const veiculos = await this.prisma.veiculos.findMany({
      where: {
        ativo: true,
        eventos: {
          none: {
            tipo: TiposEventos.VISUALIZOU,
            criado_em: { gte: desde },
          },
        },
      },
      select: { nome: true },
      take: limite,
    });

    return veiculos.map((v) => ({ nome: v.nome, valor: 0 }));
  }
}