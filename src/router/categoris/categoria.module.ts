import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { CategoriService } from "./categoria.service.js";
import { CategoriController } from "./categorias.controller.js";


@Module({

    imports:[PrismaModule],
    providers:[CategoriService],
    controllers:[CategoriController],

})

export class CategoriModule {}