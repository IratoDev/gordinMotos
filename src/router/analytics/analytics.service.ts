
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Filtro opcional por período
  private periodo(inicio?: Date, fim?: Date) {
    const criado_em: { gte?: Date; lte?: Date } = {};

    if (inicio) criado_em.gte = inicio;
    if (fim) criado_em.lte = fim;

    return Object.keys(criado_em).length
      ? { criado_em }
      : {};
  }

  // 1. Indicadores gerais
  async getIndicadores(inicio?: Date, fim?: Date) {
    const periodo = this.periodo(inicio, fim);

    const [
      visualizacoes,
      cliquesWhatsApp,
      avaliacoes,
    ] = await Promise.all([
      this.prisma.eventos_veiculos.count({
        where: {
          tipo: 'VISUALIZOU',
          ...periodo,
        },
      }),

      this.prisma.eventos_veiculos.count({
        where: {
          tipo: 'CLICOU_WHATSAPP',
          ...periodo,
        },
      }),

      this.prisma.avaliacao.aggregate({
        where: {
          aprovada: true,
          ...periodo,
        },
        _avg: {
          estrelas: true,
        },
        _count: {
          estrelas: true,
        },
      }),
    ]);

    const conversao = visualizacoes > 0
      ? (cliquesWhatsApp / visualizacoes) * 100
      : 0;

    return {
      visualizacoes,
      cliquesWhatsApp,
      conversao: Number(conversao.toFixed(2)),
      mediaNotas: Number(
        (avaliacoes._avg.estrelas ?? 0).toFixed(2),
      ),
      totalAvaliacoes: avaliacoes._count.estrelas,
    };
  }

  // 2. Ranking de veículos por evento
  private async rankingPorEvento(
    tipo: 'VISUALIZOU' | 'CLICOU_WHATSAPP',
    limite = 10,
    inicio?: Date,
    fim?: Date,
  ) {
    const ranking = await this.prisma.eventos_veiculos.groupBy({
      by: ['veiculo_id'],
      where: {
        tipo,
        veiculo_id: { not: null },
        veiculo: {
          is: { ativo: true },
        },
        ...this.periodo(inicio, fim),
      },
      _count: {
        veiculo_id: true,
      },
      orderBy: {
        _count: {
          veiculo_id: 'desc',
        },
      },
      take: limite,
    });

    const ids = ranking
      .map(item => item.veiculo_id)
      .filter((id): id is number => id !== null);

    if (!ids.length) return [];

    const veiculos = await this.prisma.veiculos.findMany({
      where: {
        id: { in: ids },
      },
      select: {
        public_id: true,
        nome: true,
        preco: true,
        imagens: {
          where: { principal: true },
          take: 1,
          select: {
            url: true,
          },
        },
        modelo: {
          select: {
            descricao: true,
            marca: {
              select: {
                descricao: true,
              },
            },
          },
        },
      },
    });

    return ids.map(id => {
      const veiculo = veiculos.find(v =>
        ranking.some(r => r.veiculo_id === id),
      );

      const dadosRanking = ranking.find(
        r => r.veiculo_id === id,
      );

      return {
        ...veiculo,
        quantidade: dadosRanking?._count.veiculo_id ?? 0,
      };
    }).filter(v => v.public_id);
  }

  // 3. Motos mais vistas
  async getMotosMaisVistas(
    limite = 10,
    inicio?: Date,
    fim?: Date,
  ) {
    return this.rankingPorEvento(
      'VISUALIZOU',
      limite,
      inicio,
      fim,
    );
  }

  // 4. Motos com mais cliques no WhatsApp
  async getMotosMaisContatadas(
    limite = 10,
    inicio?: Date,
    fim?: Date,
  ) {
    return this.rankingPorEvento(
      'CLICOU_WHATSAPP',
      limite,
      inicio,
      fim,
    );
  }

  // 5. Termos mais buscados
  async getTermosMaisBuscados(
    limite = 10,
    inicio?: Date,
    fim?: Date,
  ) {
    return this.prisma.eventos_veiculos.groupBy({
      by: ['termo_busca'],
      where: {
        tipo: 'BUSCOU',
        termo_busca: { not: null },
        ...this.periodo(inicio, fim),
      },
      _count: {
        termo_busca: true,
      },
      orderBy: {
        _count: {
          termo_busca: 'desc',
        },
      },
      take: limite,
    });
  }

  // 6. Estoque por marca
  async getEstoquePorMarca() {
    const veiculos = await this.prisma.veiculos.findMany({
      where: {
        ativo: true,
      },
      select: {
        modelo: {
          select: {
            marca: {
              select: {
                descricao: true,
              },
            },
          },
        },
      },
    });

    const estoque = new Map<string, number>();

    for (const veiculo of veiculos) {
      const marca = veiculo.modelo.marca.descricao;

      estoque.set(
        marca,
        (estoque.get(marca) ?? 0) + 1,
      );
    }

    return Array.from(estoque, ([marca, quantidade]) => ({
      marca,
      quantidade,
    })).sort((a, b) => b.quantidade - a.quantidade);
  }

  // 7. Motos sem nenhuma visualização
  async getMotosSemVisualizacao(
    inicio?: Date,
    fim?: Date,
  ) {
    return this.prisma.veiculos.findMany({
      where: {
        ativo: true,
        eventos: {
          none: {
            tipo: 'VISUALIZOU',
            ...this.periodo(inicio, fim),
          },
        },
      },
      select: {
        public_id: true,
        nome: true,
        preco: true,
        criado_em: true,
        imagens: {
          where: { principal: true },
          take: 1,
          select: {
            url: true,
          },
        },
        modelo: {
          select: {
            descricao: true,
            marca: {
              select: {
                descricao: true,
              },
            },
          },
        },
      },
      orderBy: {
        criado_em: 'desc',
      },
    });
  }
}
