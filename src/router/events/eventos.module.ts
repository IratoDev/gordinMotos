import { Module } from '@nestjs/common';
import { EventosController } from './eventos.controller.js';
import { EventosService } from './eventos.service.js';
// import { PrismaModule } from '../prisma/prisma.module'; // se o seu não for global

@Module({
  // imports: [PrismaModule],
  controllers: [EventosController],
  providers: [EventosService],
})
export class EventosModule {}