import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { UsuarioService } from "../users/usuarius.service.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { CreateBrandDto, UpdateBrandDto } from "./dto/brands.dto.js";



@Injectable()
export class MarcasService {

    constructor ( 
        private readonly prisma: PrismaService,
    ) {}

    private handleError(error: unknown): never {

  if (error instanceof Prisma.PrismaClientKnownRequestError) {

    if (error.code === 'P2002') {
      throw new BadRequestException(
        'Já existe uma marca com esses dados.'
      );
    }

    if (error.code === 'P2025') {
      throw new NotFoundException(
        'Marca não encontrada.'
      );
    }

    if (error.code === 'P2003') {
      throw new BadRequestException(
        'Não é possível excluir este registro porque existem dados vinculados.'
      );
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    if (error.message.includes('23001')) {
      throw new BadRequestException(
        'Não é possível excluir esta marca porque existem modelos vinculados a ela.'
      );
    }
  }

  throw error;
}

    async getMarcaIdByPublicId(publicId: string){

        const marca = await this.prisma.marcas.findUnique({
            where:{
             public_id:publicId
            },
             select: { id: true }
        })

        if (!marca) {
            throw new NotFoundException("Marca inexistente");
        }

        return marca.id

    }

    private async marcaNameExist (marcaName: string, excludeId?: number) {

const marcaNameExist = await this.prisma.marcas.findFirst({
    where:{
         descricao: marcaName,
            ...(excludeId !== undefined && {
                id: { not: excludeId }
            })
    }
 })

if(marcaNameExist){

    throw new BadRequestException("Já existe uma marca com esse nome cadastrado")

}

return

    } 

    async createMarcas( marcaData: CreateBrandDto){

        await this.marcaNameExist(marcaData.descricao)

        try {

            await this.prisma.marcas.create({
                data:{
                descricao: marcaData.descricao
                }
        })

        return { message: "Marca criada com sucesso"}

        } catch (error) {

            this.handleError(error)
        }

    }

    async getAllMarcas(){

        return this.prisma.marcas.findMany({
            select:{
                public_id: true,
                descricao: true,
                modelos:{ 
                    select:{ 
                        public_id:true, 
                        descricao:true, 
                        ano_mod: true,
                    }
                }
            }
        })

    }

    async updateMarcas(  marcaData: UpdateBrandDto){
    

    const id = await this.getMarcaIdByPublicId(marcaData.public_id)
 
    await this.marcaNameExist(marcaData.descricao, id)

    try {

        await this.prisma.marcas.update({
            where:{id},
            data:{
            descricao: marcaData.descricao
        }
    })

    return { message: "Marca atualizada com sucesso"}

    } catch (error) {

        this.handleError(error)
    }

    }

    async deleteMarcas(marcaId:string){


        const id = await this.getMarcaIdByPublicId(marcaId)

    try {

        await this.prisma.marcas.delete({
            where:{id},
        })

        return { message: "Marca deletada com sucesso!"}

    } catch (error) {

        this.handleError(error)
    }

    }

}