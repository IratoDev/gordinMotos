import { Inject, Injectable,  UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/auth.dto.js";

import { PrismaService } from "../prisma/prisma.service.js";
import { HashingService } from "./hashing/hashing.service.js";
import jwtConfig from "./config/jwt.config.js";
import {type ConfigType } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenDto } from "./dto/refresh-token.dto.js";


@Injectable()
export class AuthService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly hasgService: HashingService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,

    
    ){

        //console.log(jwtConfiguration)
    }

    private async createTokens(userExist: { id: number; public_id: string; email: string; nome: string; senha: string; criado_em: Date; modificado_em: Date; }) {
        const acessTokenPromise = this.signJwtAsync(userExist, this.jwtConfiguration.jwtTtl);

        const refreshTokenPromise = this.signJwtAsync(userExist, this.jwtConfiguration.jwtRefreshTtl);

        const [acessToken, refreshToken] = await Promise.all([
            acessTokenPromise,
            refreshTokenPromise
        ])

        return {
            acessToken,
            refreshToken
        }
    }

    private async signJwtAsync(userExist: { id: number; public_id: string; email: string; nome: string; senha: string; criado_em: Date; modificado_em: Date; }, expiresIn: number,) {
        return await this.jwtService.signAsync(
            {
                sub: userExist.public_id,
           
            },
            {
                audience: this.jwtConfiguration.audience,
                issuer: this.jwtConfiguration.issuer,
                secret: this.jwtConfiguration.secret,
                expiresIn,
            }
        );
    }


    async loginUser(usuarioData: LoginDto){
        

        const userExist = await this.prisma.usuario.findUnique({
            where:{email:usuarioData.email, ativo:true}
        })

        if(!userExist){
            throw new UnauthorizedException('Usuário não autorizado')
        }
        
        const passwordValid = await this.hasgService.compare(usuarioData.senha, userExist.senha)
        
        if(!passwordValid) {
            throw new UnauthorizedException('Usuário ou senha invalidos')
        }

        return await this.createTokens(userExist);
    }

    async validateUser(token: string){

        const payload = this.jwtService.verify(token);
        
        const user = await this.prisma.usuario.findUnique({
            where:{public_id: payload.sub}
        })

        if(!user) {
            throw new UnauthorizedException("Usuario inexistente")
        }

        return { menssage: "Ok" }       

    }


    async refreshTokensUser(refreshTokenDto: RefreshTokenDto){
    
    try {

        const {sub} = await this.jwtService.verifyAsync(
            refreshTokenDto.refreshToken,
            this.jwtConfiguration
        )

        const user =  await this.prisma.usuario.findFirst({
            where:{public_id: sub}
        })

        if(!user){
    
            throw new Error('Usuario não encontrada')
        }

        return this.createTokens(user)
        
    } catch (error:any) {
        
        throw new UnauthorizedException(error.message,)
    }
        
    }

    async validateClient(token: string){

        const payload = this.jwtService.verify(token);
        
        const user = await this.prisma.clientes.findUnique({
            where:{public_id: payload.sub}
        })

        if(!user) {
            throw new UnauthorizedException("Usuario inexistente")
        }

        return { menssage: "Ok" }       

    }

    async loginClient(usuarioData: LoginDto){
        
        const clientExist = await this.prisma.clientes.findUnique({
            where:{email:usuarioData.email}
        })

        if(!clientExist){
            throw new UnauthorizedException('Usuário ou senha invalidos')
        }
        
        const passwordValid = await this.hasgService.compare(usuarioData.senha, clientExist.senha)
        
        if(!passwordValid) {
            throw new UnauthorizedException('Usuário ou senha invalidos')
        }

        return await this.createTokens(clientExist);
    }

    async refreshTokensClient(refreshTokenDto: RefreshTokenDto){
    
    try {

        const {sub} = await this.jwtService.verifyAsync(
            refreshTokenDto.refreshToken,
            this.jwtConfiguration
        )

        const client =  await this.prisma.clientes.findFirst({
            where:{public_id: sub}
        })

        if(!client){
    
            throw new Error('Usuario não encontrada')
        }

        return this.createTokens(client)
        
    } catch (error:any) {
        
        throw new UnauthorizedException(error.message,)
    }
        
    }


}