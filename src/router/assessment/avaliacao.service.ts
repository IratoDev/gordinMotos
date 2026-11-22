// avaliacoes/avaliacoes.service.ts
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateAvaliacaoDto, AprovarAvaliacaoDto } from './dto/avaliacao.dto.js';

@Injectable()
export class AssessmentService {
  constructor(private prisma: PrismaService) {}

  private handleNotFound(e: any): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw new NotFoundException('Avaliação não encontrada');
    }
    throw e;
  }

  // cliente cria (fica pendente até o admin aprovar)
  async create(dto: CreateAvaliacaoDto) {

    const clientExist = await this.prisma.clientes.findUnique({
      where:{public_id: dto.cliente_public_id}
    })

    const vehicleExist = await this.prisma.veiculos.findFirst({
      where:{public_id: dto.veiculo_public_id}
    })

    if(!vehicleExist){
     throw new NotFoundException('Veiculo inexistente')
    }

    if(!clientExist){
      throw new NotFoundException('Cliente inexistente')
    }

    try {
      return await this.prisma.avaliacao.create({
        data: { 
          texto: dto.informacoesAdicionais,
          estrelas: Number(dto.estrelas),
          cliente_id: clientExist.id,
          veiculo_id: vehicleExist.id
         },
      });
    } catch (e: any) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ConflictException('Você já avaliou este veículo');
        }
        if (e.code === 'P2003') {
          throw new NotFoundException('Veículo não encontrado');
        }
      }
      throw e;
    }
  }

  // público: lista de avaliaçoes aprovadas
  async findAprovadas() {
    const avaliacoes = await this.prisma.avaliacao.findMany({
      where: { aprovada: true },
      select: {
        public_id: true,
        estrelas: true,
        texto: true,
        criado_em: true,
        veiculo: {
          select: { 
            nome:true, 
            public_id:true, 
            modelo: { select:{ public_id: true, descricao:true, marca:{ select:{ public_id:true, descricao:true}} }},
            imagens:{ 
              select:{ 
                url:true, 
                principal:true 
              }
            }
          }
        },
        cliente: { select: { nome: true } },
      },
      orderBy: { criado_em: 'desc' },
    });

    return avaliacoes.map((avaliacao) => ({
    ...avaliacao,
    veiculo: {
      ...avaliacao.veiculo,
      marca: avaliacao.veiculo.modelo.marca,
      modelo:avaliacao.veiculo.modelo,
      imagens: avaliacao.veiculo.imagens.map((imagem) => ({
        ...imagem,
        url: `${process.env.AWS_ENDPOINT_URL_S3}/fotos/${imagem.url}`,
      })),
    },
  }));
  }

  // admin: lista as pendentes
  async findPendentes() {
    return this.prisma.avaliacao.findMany({
      select:{
        id:false,
        public_id:true,
        aprovada:true,
        estrelas:true,
        texto:true,

        cliente: { select: { nome: true } },
        veiculo: { select: { nome: true, public_id: true, modelo:{ select:{ public_id:true, descricao: true, marca:{ select:{ descricao:true, public_id:true } }}} } },
      },
    
      orderBy: { criado_em: 'asc' },
    });
  }

  // admin: aprova ou reprova
  async aprovar(dto: AprovarAvaliacaoDto) {

    const assessmentExist = await this.prisma.avaliacao.findUnique({
      where:{public_id: dto.public_id}
    })

    if(!assessmentExist){
      throw new NotFoundException('Avaliação inexistente')
    }

    try {
      return await this.prisma.avaliacao.update({
        where: { id: assessmentExist.id },
        data: { aprovada: dto.aprovada },
      });
    } catch (e) {
      this.handleNotFound(e);
    }
  }

  // admin: exclui
  async remove(publicId: string) {

    const assessmentExist = await this.prisma.avaliacao.findUnique({
      where:{public_id: publicId}
    })

    if(!assessmentExist){
      throw new NotFoundException('Avaliação inexistente')
    }

    try {
      await this.prisma.avaliacao.delete({ where: { id: assessmentExist.id} });
    } catch (e) {
      this.handleNotFound(e);
    }
  }

}