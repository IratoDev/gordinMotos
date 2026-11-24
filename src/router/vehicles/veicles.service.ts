import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { CreateVehicleDto, UpdateVehicleDto } from "./dto/veicles.dto.js";

import { ModelService } from "../models/modelo.service.js";
import { CategoriService } from "../categoris/categoria.service.js";
import sharp from "sharp";
import { StorageService } from "../../storage/storage.service.js";
import { randomUUID } from "crypto";
import { MarcasService } from "../brands/brands.service.js";


@Injectable()
export class VeiculosService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly modeloService: ModelService,
        private readonly marcaService: MarcasService,
        private readonly categoriService: CategoriService,
        private readonly storage: StorageService
    ) {}

    // trata os erros do Prisma em um lugar só
    private handleError(error: unknown): never {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaError = error as Prisma.PrismaClientKnownRequestError;

            if (prismaError.code === 'P2002') {
                throw new BadRequestException('Já existe um veículo com essa placa');
            }

            if (prismaError.code === 'P2025') {
                throw new NotFoundException('Registro não encontrado (veículo, categoria, modelo ou cor)');
            }
        }

        throw error;
    }

    private comUrl<T extends { imagens: { url: string }[] }>(v: T) {
        return {
            ...v,
            imagens: v.imagens.map(({ url, ...img }) => ({
                ...img,
                url: this.storage.publicUrl(url),
            })),
        };
    }

    private async buscarImagem(veiculoId: string, imagemId: string) {
        
        const img = await this.prisma.imagem_Veiculos.findFirst({
            where: { public_id: imagemId, veiculo: { public_id: veiculoId } },
        });
        
        if (!img) throw new NotFoundException('Imagem não encontrada');
        
        return img;
    }

    private readonly logger = new Logger(VeiculosService.name);

    private async enviarImagens(files: Express.Multer.File[]): Promise<string[]> {
    const resultados = await Promise.allSettled(files.map(async (f) => {
        const buffer = await sharp(f.buffer)
            .rotate()
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

        return this.storage.upload(`veiculos/${randomUUID()}.webp`, buffer);
    }));

    const chaves = resultados
        .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
        .map((r) => r.value);

    if (resultados.some((r) => r.status === 'rejected')) {
        await this.storage.remove(chaves);
        throw new BadRequestException('Falha ao processar as imagens');
    }

        return chaves;
    }

    // multipart manda listas como texto JSON
    private parseLista(valor: unknown): string[] {
        if (!valor) return [];
        return typeof valor === 'string' ? JSON.parse(valor) : (valor as string[]);
    }

    async removerImagem(veiculoId: string, imagemId: string) {
        const img = await this.buscarImagem(veiculoId, imagemId);

        const total = await this.prisma.imagem_Veiculos.count({
        where: { veiculo_id: img.veiculo_id },
        });
        
        if (total === 1)
            throw new BadRequestException('O veículo precisa ter ao menos 1 foto');

            await this.prisma.$transaction(async (tx:any) => {
            await tx.imagem_Veiculos.delete({ where: { id: img.id } });

        if (img.principal) { // apagou a capa? promove outra
            const outra = await tx.imagem_Veiculos.findFirst({
            where: { veiculo_id: img.veiculo_id },
            orderBy: { id: 'asc' },
            });
        
        await tx.imagem_Veiculos.update({
            where: { id: outra!.id },
            data: { principal: true },
        });
      }
    });

    await this.storage.remove([img.url]); // só apaga o arquivo se o banco deu certo
    }

    async createVeiculo(veiculoData:CreateVehicleDto, files: Express.Multer.File[]) {

        if (!files?.length) throw new BadRequestException('Envie ao menos 1 foto');

        const categoriaId = await this.categoriService.getCategoriIdByPublicId(veiculoData.categoria);

        const modeloId = await this.modeloService.getModeloIdByPublicId(veiculoData.modelo);


        const idx = veiculoData.indice_principal ?? 0;
       if (idx < 0 || idx >= files.length) throw new BadRequestException('Índice inválido');

        const resultados = await Promise.allSettled(files.map(async (f) => {
        const buffer = await sharp(f.buffer)
            .rotate()
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
            
            return this.storage.upload(`veiculos/${randomUUID()}.webp`, buffer);
        
        }));

        const chaves = resultados
            .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
            .map((r) => r.value);

        if (resultados.some((r) => r.status === 'rejected')) {
            await this.storage.remove(chaves);
            throw new BadRequestException('Falha ao processar as imagens');
        }

        const cores = typeof veiculoData.cores === 'string'
        ? JSON.parse(veiculoData.cores)
        : veiculoData.cores;

        try {

            const veiculo = await this.prisma.veiculos.create({
                data: {
                    nome: veiculoData.nome,
                    ano_fab: veiculoData.ano_fab,
                    detalhes: veiculoData.detalhes,
                    opcionais: veiculoData.opcionais,
                    km: veiculoData.km,
                    placa: veiculoData.placa,
                    destaque: veiculoData.destaque,
                    combustivel: veiculoData.combustivel,
                    preco: veiculoData.preco,
                    cambio: veiculoData.cambio,
                    categorias: { connect: { id: categoriaId } },
                    modelo: { connect: { id: modeloId } },
                    cores: {
                        connect: cores.map((c:string) => ({ public_id: c })),
                    },
                    imagens: {
                        create: chaves.map((chave, i) => ({
                        url: chave,
                        principal: i === idx,
                        })),
                    }
                },

            })

            return { message: "Veículo criado com sucesso", public_id: veiculo.public_id }

        }catch (error) {

            await this.storage.remove(chaves);

            this.handleError(error)

        }
    }

    async getAllVeiculos() {
        const lista = await this.prisma.veiculos.findMany({
   
            orderBy: { criado_em: 'desc' },
            select: {
              public_id: true,
              nome: true,
              detalhes: true,
              opcionais: true,
              cambio: true,
              km: true,
              ano_fab: true,
              ativo:true,
              placa: true,
              destaque: true,
              combustivel: true,
              preco: true,
              modelo: {
                select: {
                  public_id: true,
                  descricao: true,
                  ano_mod: true,
                  marca: { select: { public_id: true, descricao: true } },
                },
              },
              categorias: { select: { public_id: true, descricao: true } },
              cores: { select: { public_id: true, descricao: true, hexadecimal: true } },
              imagens: { select: { public_id: true, url: true, principal: true } },
            },
        });
            
        return lista.map((v) => ({
            public_id: v.public_id,
            nome: v.nome,
            detalhes: v.detalhes,
            opcionais: v.opcionais,
            cambio: v.cambio,
            km: String(v.km),
            ativo: v.ativo,
            ano_fab: String(v.ano_fab),
            ano_mo: String(v.modelo.ano_mod),
            placa: v.placa,
            destaque: v.destaque,
            combustivel: v.combustivel,
            preco: Number(v.preco),
                
            marca: {
              public_id: v.modelo.marca.public_id,
              descricao: v.modelo.marca.descricao,
            },
            modelo: {
              public_id: v.modelo.public_id,
              descricao: v.modelo.descricao,
            },
            categoria: v.categorias,
            cores: v.cores,
        
            imagens: v.imagens.map((img) => ({
              public_id: img.public_id,
              url: `${process.env.AWS_ENDPOINT_URL_S3}/fotos/${img.url}`,
              principal: img.principal,
            })),
        }));

    }

    async getAllVeiculosClient() {
        const lista = await this.prisma.veiculos.findMany({
   
            orderBy: { criado_em: 'desc' },
            select: {
              public_id: true,
              nome: true,
              detalhes: true,
              opcionais: true,
              cambio: true,
              km: true,
              ano_fab: true,
              placa: true,
              destaque: true,
              combustivel: true,
              preco: true,
              modelo: {
                select: {
                  public_id: true,
                  descricao: true,
                  ano_mod: true,
                  marca: { select: { public_id: true, descricao: true } },
                },
              },
              categorias: { select: { public_id: true, descricao: true } },
              cores: { select: { public_id: true, descricao: true, hexadecimal: true } },
              imagens: { select: { public_id: true, url: true, principal: true } },
            },
        });
            
        return lista.map((v) => ({
            public_id: v.public_id,
            nome: v.nome,
            detalhes: v.detalhes,
            opcionais: v.opcionais,
            cambio: v.cambio,
            km: String(v.km),
            ano_fab: String(v.ano_fab),
            ano_mo: String(v.modelo.ano_mod),
            placa: v.placa ? `${v.placa.slice(0, 3)} ****` : 'Não informado',
            destaque: v.destaque,
            combustivel: v.combustivel,
            preco: Number(v.preco),
                
            marca: {
              public_id: v.modelo.marca.public_id,
              descricao: v.modelo.marca.descricao,
            },
            modelo: {
              public_id: v.modelo.public_id,
              descricao: v.modelo.descricao,
              ano_mod: v.modelo.ano_mod,
            },
            categoria: v.categorias,
            cor: v.cores,
        
            imagens: v.imagens.map((img) => ({
              public_id: img.public_id,
              url: `${process.env.AWS_ENDPOINT_URL_S3}/fotos/${img.url}`,
              principal: img.principal,
            })),
        }));

    }

    async updateVeiculo(veiculoData: UpdateVehicleDto, files: Express.Multer.File[] = []) {

    const veiculo = await this.prisma.veiculos.findUnique({
        where: { public_id: veiculoData.public_id },
        select: {
            id: true,
            imagens: { select: { id: true, public_id: true, url: true, principal: true } },
        },
    });
    if (!veiculo) throw new NotFoundException('veículo inexistente');

    // 1) o que sai e o que fica
    const remover = this.parseLista(veiculoData.remover_imagens);
    const removidas = veiculo.imagens.filter((i) => remover.includes(i.public_id));
    const restantes = veiculo.imagens.filter((i) => !remover.includes(i.public_id));

    if (restantes.length + files.length < 1) {
        throw new BadRequestException('O veículo precisa ter ao menos 1 foto');
    }

    // 2) quem vai ser a capa
    let principalExistenteId: number | undefined;
    let principalNovaIdx: number | undefined;

    if (veiculoData.imagem_principal) {
        const achada = restantes.find((i) => i.public_id === veiculoData.imagem_principal);
        if (!achada) throw new BadRequestException('Imagem principal inválida');
        principalExistenteId = achada.id;
    } else if (veiculoData.indice_principal != null) {
        const idx = Number(veiculoData.indice_principal);
        if (idx < 0 || idx >= files.length) throw new BadRequestException('Índice inválido');
        principalNovaIdx = idx;
    } else if (!restantes.some((i) => i.principal)) {
        // apagou a capa sem escolher outra: promove automaticamente
        if (restantes.length) principalExistenteId = restantes[0].id;
        else principalNovaIdx = 0;
    }

    const mudaPrincipal = principalExistenteId !== undefined || principalNovaIdx !== undefined;

    // 3) sobe as fotos novas
    const novasChaves = files.length ? await this.enviarImagens(files) : [];

    const cores = veiculoData.cores ? this.parseLista(veiculoData.cores) : undefined;

    try {
        await this.prisma.$transaction(async (tx: any) => {

            if (removidas.length) {
                await tx.imagem_Veiculos.deleteMany({
                    where: { id: { in: removidas.map((i) => i.id) } },
                });
            }

            // desmarca ANTES de marcar a nova (índice único)
            if (mudaPrincipal) {
                await tx.imagem_Veiculos.updateMany({
                    where: { veiculo_id: veiculo.id },
                    data: { principal: false },
                });
            }

            if (principalExistenteId !== undefined) {
                await tx.imagem_Veiculos.update({
                    where: { id: principalExistenteId },
                    data: { principal: true },
                });
            }

            if (novasChaves.length) {
                await tx.imagem_Veiculos.createMany({
                    data: novasChaves.map((chave, i) => ({
                        veiculo_id: veiculo.id,
                        url: chave,
                        principal: i === principalNovaIdx,
                    })),
                });
            }

            await tx.veiculos.update({
                where: { id: veiculo.id },
                data: {
                    nome: veiculoData.nome,
                    ano_fab: Number(veiculoData.ano_fab),
                    detalhes: veiculoData.detalhes,
                    opcionais: veiculoData.opcionais,
                    km: Number(veiculoData.km),
                    placa: veiculoData.placa,
                    destaque: Boolean(veiculoData.destaque),
                    combustivel: veiculoData.combustivel,
                    cambio: veiculoData.cambio,
                    preco: veiculoData.preco,
                    ativo: Boolean(veiculoData.ativo === "true" ? true : false ),
                    categorias: veiculoData.categoria_id
                        ? { connect: { public_id: veiculoData.categoria_id } }
                        : undefined,
                    modelo: veiculoData.modelo_id
                        ? { connect: { public_id: veiculoData.modelo_id } }
                        : undefined,
                    cores: cores
                        ? { set: cores.map((c) => ({ public_id: c })) }
                        : undefined,
                },
            });
        });
    } catch (error) {
        await this.storage.remove(novasChaves); // banco falhou: desfaz o upload
        this.handleError(error);
    }

    // banco deu certo: agora apaga os arquivos antigos
    if (removidas.length) {
        try {
            await this.storage.remove(removidas.map((i) => i.url));
        } catch (error) {
            this.logger.warn(`Falha ao remover imagens do veículo ${veiculoData.public_id}`, error);
        }
    }

        return { message: 'Veículo atualizado com sucesso' };
    }

    async deleteVeiculo(publicId: string) {
      const veiculo = await this.prisma.veiculos.findUnique({
        where: { public_id: publicId },
        select: { imagens: { select: { url: true } } },
      });
      if (!veiculo) throw new NotFoundException('veículo inexistente');

      try {
        await this.prisma.veiculos.delete({ where: { public_id: publicId } });
      } catch (error) {
        this.handleError(error);
      }

      try {
        await this.storage.remove(veiculo.imagens.map((i) => i.url));
      } catch (error) {
        this.logger.warn(`Falha ao remover imagens do veículo ${publicId}`, error);
      }

      return { message: 'Veículo deletado com sucesso!' };
    }
}




