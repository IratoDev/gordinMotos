import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { UsuarioService } from "../users/usuarius.service.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { HashingService } from "../../auth/hashing/hashing.service.js";
import { CreateClientDto, UpdateClientDto } from "./dto/client.dto.js";


@Injectable()
export class ClienteService {

 constructor ( 
            private readonly prisma: PrismaService,
            private readonly hashService: HashingService
    ) {}

    private handleError(error: unknown): never {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaError = error as Prisma.PrismaClientKnownRequestError;

            if (prismaError.code === 'P2002') {
                throw new BadRequestException('Já existe uma conta com esse email');
            }

            // connect em algo que não existe (categoria, modelo ou cor)
            // ou veículo não encontrado no update/delete
            if (prismaError.code === 'P2025') {
                throw new NotFoundException('Registro não encontrado ');
            }
        }

        throw error;
    }
    
    private async getClientIdByPublicId(publicId: string){
    
        const clienteExist = await this.prisma.clientes.findUnique({
            where:{public_id: publicId}
        })
    
        if(!clienteExist){
            throw new NotFoundException("cliente inexistente")
        }
    
        return clienteExist.id
    
    }
    
    
    async createCliente(clienteData:CreateClientDto){
        
        const passwordHash = await this.hashService.hash(clienteData.senha)

        const clientExist = await this.prisma.clientes.findFirst({
            where:{email: clienteData.email}
        })

        if(clientExist){
            throw new NotFoundException("já existe uma conta com esse email")
        }
    
        try {
    
            await this.prisma.clientes.create({
                data:{
                    nome: clienteData.nome,
                    email: clienteData.email,
                    senha: passwordHash,
                    data_nascimento: new Date (`${clienteData.data_nascimento}`),
                    celular: clienteData.telefone,
                    telefone: clienteData.telefone
                }
            })
    
            return { message: "Cliente criado com sucesso"}
    
            } catch (error) {
    
                this.handleError(error)
            }
    
    }
    
    async getAllClientes(){
    
        return this.prisma.clientes.findMany({
                select:{
                    public_id: true,
                    nome: true,
                    data_nascimento: true,
                    telefone:true,
                    celular: true,
                    avaliacoes: true
                }
        })
    
    }
    
    async updateclientes(clienteData: UpdateClientDto){
    
        const id = await this.getClientIdByPublicId(clienteData.public_id)
    
        try {
    
            await this.prisma.clientes.update({
                where:{id},
                    data:{
                        nome: clienteData.nome,
                        email: clienteData.email,
                        senha: clienteData.senha,
                        data_nascimento: new Date (`${clienteData.data_nascimento}`),
                        celular: clienteData.telefone,
                        telefone: clienteData.telefone
                    }
        })
    
        return { message: "Cliente atualizado com sucesso"}
    
        } catch (error) {
    
           this.handleError(error)
        }
    
    }
    
    async deletecliente(clienteId:string){
    
    
    
        const id = await this.getClientIdByPublicId(clienteId)
    
        try {
    
            await this.prisma.clientes.delete({
                where:{id},
            })
    
            return { message: "cliente deletado com sucesso!"}
    
        } catch (error) {
    
            this.handleError(error)
        }
    
    }

}