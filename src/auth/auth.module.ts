import { Global, Module } from "@nestjs/common";
import { HashingService } from "./hashing/hashing.service.js";
import { BcryptService } from "./hashing/bcrypt.service.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { UsuarioService } from "../router/users/usuarius.service.js";
import { ClienteService } from "../router/clients/clientes.service.js";

import jwtConfig from "./config/jwt.config.js";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
    imports:[
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider())
    ],
    providers:[

        {
            provide: HashingService,
            useClass: BcryptService
        },
        AuthService,

    ],
    controllers:[
        AuthController
    ],

    exports : [HashingService, JwtModule, ConfigModule]

})
export class AuthModule {}