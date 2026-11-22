import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EventosService } from './eventos.service.js';
import { CriarEventoDto } from './dto/eventos.dto.js';

@Controller('eventos')
export class EventosController {
  constructor(private readonly eventosService: EventosService) {}

  // Público: o site da loja chama isso (visualizou, buscou, clicou no WhatsApp)
  // POST /eventos
  @Post()
  @HttpCode(204)
  registrar(@Body() dto: CriarEventoDto) {
    return this.eventosService.registrar(dto);
  }

  // Só admin: coloque seu guard de autenticação aqui
  // GET /eventos/dashboard?dias=7   (aceita 7, 30 ou 60)
  // @UseGuards(AuthGuard)
  @Get('dashboard')
  dashboard(@Query('dias', new DefaultValuePipe(7), ParseIntPipe) dias: number) {
    return this.eventosService.dashboard(dias);
  }
}