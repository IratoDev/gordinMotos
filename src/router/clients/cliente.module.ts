import { Module } from "@nestjs/common";
import { ClienteService } from "./clientes.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { ClientController } from "./cliente.controller.js";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { HashingService } from "../../auth/hashing/hashing.service.js";


@Module({

imports:[
    PrismaModule,
],
providers:[
    ClienteService
],
controllers:[
    ClientController
],

exports:[
    ClienteService
]

})
export class ClientModule {}