import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { MarcasService } from "./brands.service.js";
import { MarcaController } from "./brands.controller.js";

@Module({

imports:[PrismaModule],
providers:[MarcasService],
controllers:[MarcaController],

exports:[MarcasService]

})
export class MarcasModule {}