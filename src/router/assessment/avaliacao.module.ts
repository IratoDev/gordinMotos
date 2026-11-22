import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module.js";
import { AssessmentService } from "./avaliacao.service.js";
import { AssessmentController } from "./avaliacao.controller.js";


@Module({
    imports:[PrismaModule],
    providers:[AssessmentService],
    controllers:[AssessmentController]
})
export class AssessmentModule {}