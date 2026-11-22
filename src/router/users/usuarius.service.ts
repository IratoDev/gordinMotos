import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service.js";
import { Prisma } from "../../../generated/prisma/client.js";
import { HashingService } from "../../auth/hashing/hashing.service.js";
import { CreateUserDto, UpdateUserDto } from "./dto/user.dto.js";

@Injectable()
export class UsuarioService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly hashService: HashingService
    ) {}

    private handleError(error: unknown): never {

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const prismaError = error as Prisma.PrismaClientKnownRequestError;

            if (prismaError.code === 'P2002') {
                throw new BadRequestException('Já existe um usuario com esses dados');
            }

            // connect em algo que não existe (categoria, modelo ou cor)
            // ou usuario não encontrado no update/delete
            if (prismaError.code === 'P2025') {
                throw new NotFoundException('Registro não encontrado (usuario, categoria, modelo ou cor)');
            }
        }

        throw error;
    }

    private async getUserIdByPublicId(publicId: string) {

        const usuarioExist = await this.prisma.usuario.findUnique({
            where: { public_id: publicId }
        })

        if (!usuarioExist) {
            throw new NotFoundException("usuário inexistente")
        }

        return usuarioExist.id
    }

    async createUsuario(usuarioData: CreateUserDto) {

    const passwordHash = await this.hashService.hash(usuarioData.senha)


        try {

            await this.prisma.usuario.create({
                data: {
                    nome: usuarioData.nome,
                    email: usuarioData.email,
                    senha: passwordHash,
                }
            })

            return { message: "Usuário criado com sucesso" }

        } catch (error) {

            this.handleError(error)
        }
    }

    async getAllUsuarios() {

        return this.prisma.usuario.findMany({
            select: {
                public_id: true,
                nome: true,
                email: true,
                criado_em: true,
                modificado_em: true
            }
        })
    }

    async updateUsuario(usuarioData: UpdateUserDto) {

        const id = await this.getUserIdByPublicId(usuarioData.public_id)


        if(usuarioData.senha){
         const newPasswordHash = await this.hashService.hash(usuarioData.senha)

         usuarioData['senha'] = newPasswordHash;

        }


        try {

            await this.prisma.usuario.update({
                where: { id },
                data: {
                   ...usuarioData,
                }
            })

            return { message: "Usuário atualizado com sucesso" }

        } catch (error) {

            this.handleError(error)
        }
    }

    async deleteUsuario(usuarioId: string) {

        const id = await this.getUserIdByPublicId(usuarioId)

        await this.prisma.usuario.delete({
            where: { id },
        })

        return { message: "Usuário deletado com sucesso!" }
    }
}