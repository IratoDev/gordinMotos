import { Module } from "@nestjs/common";
import { StorageModule } from "../../storage/storage.module.js";
import { VeiculosController } from "./veicles.controller.js";
import { VeiculosService } from "./veicles.service.js";
import { PrismaModule } from "../../prisma/prisma.module.js";


import { ModelService } from "../models/modelo.service.js";
import { CategoriService } from "../categoris/categoria.service.js";
import { UsuarioService } from "../users/usuarius.service.js";
import { MarcasService } from "../brands/brands.service.js";


@Module({
    imports:[
        StorageModule,
        PrismaModule,
    ],
    controllers:[VeiculosController],
    providers:[
        VeiculosService,
        ModelService,
        CategoriService,
        UsuarioService,
        MarcasService,
        
    
    ],
})

export class VeicleModule {}