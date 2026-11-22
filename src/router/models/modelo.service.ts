import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "../../../generated/prisma/client.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { MarcasService } from "../brands/brands.service.js";
import { CreateModelDto, UpdateModelDto } from "./dto/modelos.dto.js";

@Injectable()
export class ModelService {

    constructor ( 
            private readonly prisma: PrismaService,
            private readonly marcaService: MarcasService
    ) {}

    private handleError(error: unknown): never {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaError = error as Prisma.PrismaClientKnownRequestError;

            if (prismaError.code === 'P2002') {
                throw new BadRequestException('Já existe um veículo com essa placa');
            }

            // connect em algo que não existe (categoria, modelo ou cor)
            // ou veículo não encontrado no update/delete
            if (prismaError.code === 'P2025') {
                throw new NotFoundException('Registro não encontrado (veículo, categoria, modelo ou cor)');
            }
        }

        throw error;
    }
    
    async getModeloIdByPublicId(publicId: string){
    
        const modeloExist = await this.prisma.modelos.findUnique({
            where:{public_id: publicId}
        })
    
        if(!modeloExist){
            throw new BadRequestException("Modelo inexistente")
        }
    
        return modeloExist.id
    
    }

    
    private async validateModeloUnique (marcaId: number,  modeloName: string, anoMod: number,  excludeId?: number) {

    const modeloNameExist = await this.prisma.modelos.findFirst({
        where:{
            marca_id: marcaId,
             descricao: modeloName,
             ano_mod: anoMod,
                ...(excludeId !== undefined && {
                    id: { not: excludeId }
                })
        }
     })
    
    if(modeloNameExist){
    
        throw new BadRequestException("Já existe um modelo com essa descrição, marca e ano")
    
    }
    
    return
    
    } 
    
    async createModelo( modeloData:CreateModelDto){

        const marcaId = await this.marcaService.getMarcaIdByPublicId(modeloData.marca_public_id)
    
        await this.validateModeloUnique(marcaId, modeloData.descricao, modeloData.ano_mod)
    
        try {
    
            await this.prisma.modelos.create({
                data:{
                    descricao: modeloData.descricao,
                    marca_id: marcaId,
                    ano_mod: modeloData.ano_mod,
                }
            })
    
            return { message: "Modelo criado com sucesso"}
    
            } catch (error) {
    
                this.handleError(error)
            }
    
    }
    
    async getAllModelos(){
    
        return this.prisma.modelos.findMany({
                select:{
                    public_id: true,
                    descricao: true,
                    ano_mod: true,
                    marca:{
                        select:{
                            public_id:true,
                            descricao: true
                        }
                    }
                }
        })
    
    }
    
    async updateModelos( modeloData: UpdateModelDto){
        
    
        const id = await this.getModeloIdByPublicId(modeloData.public_id)

        const marcaId = await this.marcaService.getMarcaIdByPublicId(modeloData.marca_public_id)
     
        await this.validateModeloUnique(marcaId, modeloData.descricao, modeloData.ano_mod, id)
    
        try {
    
            await this.prisma.modelos.update({
                where:{id},
                data:{
                descricao: modeloData.descricao,
                ano_mod: modeloData.ano_mod
            }
        })
    
        return { message: "Modelo atualizado com sucesso"}
    
        } catch (error) {
    
            this.handleError(error)
        }
    
    }
    
    async deleteModelo(modelPublicId: string){
    
    
        const id = await this.getModeloIdByPublicId(modelPublicId)
    
        try {
    
            await this.prisma.modelos.delete({
                where:{id},
            })
    
            return { message: "Modelo deletado com sucesso!"}
    
        } catch (error) {
    
           this.handleError(error)
        }
    
    }

}