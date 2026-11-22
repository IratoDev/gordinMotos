import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { MarcasService } from "../brands/brands.service.js";
import { ModelService } from "./modelo.service.js";
import { ModelController } from "./modelo.controller.js";
import { MarcasModule } from "../brands/brands.module.js";


@Module({

    imports:[PrismaModule,MarcasModule],
    providers:[ModelService],
    controllers:[ModelController]

})
export class ModelModule {}