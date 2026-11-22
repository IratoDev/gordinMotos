import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { UsuarioService } from "../users/usuarius.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { CreateCategoriaDto, UpdateCategoriaDto } from "./dto/categoria.dto.js";

@Injectable()
export class CategoriService{

     constructor ( 
            private readonly prisma: PrismaService,
    ) {}

    private handleError(error: unknown): never {

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            throw new BadRequestException('Já existe um categoria com essa descricao');
        }

        if (error.code === 'P2025') {
            throw new NotFoundException('Registro não encontrado (veículo, categoria, modelo ou cor)');
        }

        if (error.code === 'P2003' || error.code === 'P2014') {
            throw new ConflictException(
                'Não é possível excluir: existem veículos vinculados a esta categoria.',
            );
        }
    }

    // Postgres 23001 / 23503 chegam como "Unknown" no Prisma
    if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        const msg = error.message;

        if (
            msg.includes('23001') ||
            msg.includes('23503') ||
            msg.includes('violates RESTRICT') ||
            msg.includes('foreign key constraint')
        ) {
            throw new ConflictException(
                'Não é possível excluir: existem veículos vinculados a esta categoria.',
            );
        }
    }

    throw error;
}
    
    async getCategoriIdByPublicId(publicId: string){
    
        const CategoriaExist = await this.prisma.categorias_Veiculos.findUnique({
            where:{public_id: publicId}
        })
    
        if(!CategoriaExist){
            throw new NotFoundException("Categoria inexistente")
        }
    
        return CategoriaExist.id
    
    }
    
    private async validateCategoriaUnique (categoriaName: string, excludeId?: number) {
    
    const categoriaNameExist = await this.prisma.categorias_Veiculos.findFirst({

        where:{
             descricao: categoriaName,
                ...(excludeId !== undefined && {
                    id: { not: excludeId }
                })
        }
     })
    
    if(categoriaNameExist){
    
        throw new BadRequestException("Já existe uma Categoria com essa descrição")
    
    }
    
    return
    
    } 
    
    async createCategoria(categoriaData:CreateCategoriaDto){
    
        await this.validateCategoriaUnique(categoriaData.descricao)
    
        try {
    
            await this.prisma.categorias_Veiculos.create({
                data:{
                    descricao: categoriaData.descricao,
                }
            })
    
            return { message: "Categoria criada com sucesso"}
    
            } catch (error) {
    
                this.handleError(error)
            }
    
    }
    
    async getAllCategoras(){
    
        return this.prisma.categorias_Veiculos.findMany({
                select:{
                    public_id: true,
                    descricao: true,
                }
        })
    
    }
    
    async updateCategoriaes( categoriaData: UpdateCategoriaDto){
        
        const id = await this.getCategoriIdByPublicId(categoriaData.public_id)

        await this.validateCategoriaUnique(categoriaData.descricao, id)
    
        try {
    
            await this.prisma.categorias_Veiculos.update({
                where:{id},
                data:{
                descricao: categoriaData.descricao,
            }
        })
    
        return { message: "Categoria atualizada com sucesso"}
    
        } catch (error) {
    
            this.handleError(error)
        }
    
    }
    
    async deleteCategoria( categoriaId:string){
    
    
        const id = await this.getCategoriIdByPublicId(categoriaId)
    
        try {
    
            await this.prisma.categorias_Veiculos.delete({
                where:{id},
            })
    
            return { message: "Categoria deletada com sucesso!"}
    
        } catch (error) {
    
            this.handleError(error)
        }
    
    }

}