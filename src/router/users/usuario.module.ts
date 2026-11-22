import { Module } from "@nestjs/common";
import { UsuarioService } from "./usuarius.service.js";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { UsuarioController } from "./usuario.controller.js";

@Module({

imports:[PrismaModule],
providers:[UsuarioService],
controllers:[UsuarioController],

exports:[UsuarioService]

})
export class UsuarioModule {}