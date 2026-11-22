
import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import { AnalyticsService } from './analytics.service.js';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analytics: AnalyticsService,
  ) {}

  @Get('indicadores')
  getIndicadores(
    @Query('inicio') inicio?: string,
    @Query('fim') fim?: string,
  ) {
    return this.analytics.getIndicadores(
      inicio ? new Date(inicio) : undefined,
      fim ? new Date(fim) : undefined,
    );
  }

  @Get('motos-mais-vistas')
  getMotosMaisVistas(
    @Query('limite') limite?: string,
  ) {
    return this.analytics.getMotosMaisVistas(
      Number(limite) || 10,
    );
  }

  @Get('motos-mais-contatadas')
  getMotosMaisContatadas(
    @Query('limite') limite?: string,
  ) {
    return this.analytics.getMotosMaisContatadas(
      Number(limite) || 10,
    );
  }

  @Get('termos-mais-buscados')
  getTermosMaisBuscados(
    @Query('limite') limite?: string,
  ) {
    return this.analytics.getTermosMaisBuscados(
      Number(limite) || 10,
    );
  }

  @Get('estoque-por-marca')
  getEstoquePorMarca() {
    return this.analytics.getEstoquePorMarca();
  }

  @Get('motos-sem-visualizacao')
  getMotosSemVisualizacao() {
    return this.analytics.getMotosSemVisualizacao();
  }
}
