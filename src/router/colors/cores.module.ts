import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { ColorService } from "./cores.service.js";
import { ColorController } from "./cores.controller.js";

@Module({
    imports:[PrismaModule],
    providers:[ColorService],
    controllers:[ColorController]
})
export class ColorModule {}