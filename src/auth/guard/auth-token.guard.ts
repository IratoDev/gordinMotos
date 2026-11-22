import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import jwtConfig from "../config/jwt.config.js";
import { type ConfigType } from "@nestjs/config";
import { REQUEST_TOKEN_PAYLOAD_KEY } from "../auth.constants.js";

@Injectable()
export class AuthTokenGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtConfiguration: ConfigType<typeof jwtConfig>
    ){}

    async canActivate(context: ExecutionContext):  Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest()
        const token = this.extracTokenFromHeader(request)

        if(!token){
            throw new UnauthorizedException('Não logado')
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtConfiguration,
            );

            (request as Request & Record<typeof REQUEST_TOKEN_PAYLOAD_KEY, typeof payload>)[REQUEST_TOKEN_PAYLOAD_KEY] = payload;

        } catch (error) {
            throw new UnauthorizedException('Falha ao logar')
        }

        return true

    }

    extracTokenFromHeader(request: Request): string | undefined{

        const autorization = request.headers?.authorization

        if(!autorization || typeof autorization !== 'string'){
            return
        }

        return autorization.split(' ')[1];

    }

}