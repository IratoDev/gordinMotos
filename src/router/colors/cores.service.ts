import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { UsuarioService } from "../users/usuarius.service.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { CreateColorDto, UpdateColorDto } from "./dto/cor.dto.js";

@Injectable()
export class ColorService{
    
    constructor ( 
            private readonly prisma: PrismaService,
            
    ) {}
    
    private handleError(error: unknown): never {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaError = error as Prisma.PrismaClientKnownRequestError;

            if (prismaError.code === 'P2002') {
                throw new BadRequestException('Já existe uma cor com essa descrição');
            }


            if (prismaError.code === 'P2025') {
                throw new NotFoundException('Registro não encontrado cor');
            }
        }

        throw error;
    }

    private async getIdByPublicId(publicId: string){
    
        const corExist = await this.prisma.cores.findUnique({
            where:{public_id: publicId}
        })
    
        if(!corExist){
            throw new BadRequestException("Cor inexistente")
        }
    
        return corExist.id
    
    }
    
    private async validateCorUnique (corName: string, hexadecimal:string, excludeId?: number) {
    
    const corNameExist = await this.prisma.cores.findFirst({
        where:{
             descricao: corName,
             hexadecimal: hexadecimal,
                ...(excludeId !== undefined && {
                    id: { not: excludeId }
                })
        }
     })
    
    if(corNameExist){
    
        throw new BadRequestException("Já existe uma cor com essa descrição e hexadecimal")
    
    }
    
    return
    
    } 
    
    async createCor( corData: CreateColorDto){
    
    
        await this.validateCorUnique(corData.descricao, corData.hexadecimal)
    
        try {
    
            await this.prisma.cores.create({
                data:{
                    descricao: corData.descricao,
                    hexadecimal: corData.hexadecimal
                }
            })
    
            return { message: "Cor criada com sucesso"}
    
            } catch (error) {
    
                this.handleError(error)
            }
    
    }
    
    async getAllCores(){
    
        return this.prisma.cores.findMany({
                select:{
                    public_id: true,
                    descricao: true,
                    hexadecimal: true
                }
        })
    
    }
    
    async updateCores( corData: UpdateColorDto){
        
    
        const id = await this.getIdByPublicId(corData.public_id)
     
        await this.validateCorUnique(corData.descricao, corData.hexadecimal, id)
    
        try {
    
            await this.prisma.cores.update({
                where:{id},
                data:{
                descricao: corData.descricao,
                hexadecimal: corData.hexadecimal
            }
        })
    
        return { message: "Cor atualizada com sucesso"}
    
        } catch (error) {
    
          this.handleError(error)
        }
    
    }
    
    async deleteCor( corId:string){
    
    
        const id = await this.getIdByPublicId(corId)

    
        try {
    
            await this.prisma.cores.delete({
                where:{id},
            })
    
            return { message: "Cor deletada com sucesso!"}
    
        } catch (error) {
    
           this.handleError(error)
        }
    
    }
    
}