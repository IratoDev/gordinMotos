import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { VeicleModule } from './router/vehicles/veicles.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsuarioModule } from './router/users/usuario.module.js';

import { MarcasModule } from './router/brands/brands.module.js';
import { CategoriModule } from './router/categoris/categoria.module.js';
import { ColorModule } from './router/colors/cores.module.js';
import { ClientModule } from './router/clients/cliente.module.js';
import { ModelModule } from './router/models/modelo.module.js';
import { AssessmentModule } from './router/assessment/avaliacao.module.js';
import { EventosModule } from './router/events/eventos.module.js';
import { AnalyticsModule } from './router/analytics/analytics.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'backend',
    }),
    PrismaModule,
    VeicleModule,
    AuthModule,
    UsuarioModule,
    ClientModule,
    ConfigModule,

    MarcasModule,
    ColorModule,
    CategoriModule,
    ModelModule,
    AssessmentModule,
    EventosModule,
    AnalyticsModule
   
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
