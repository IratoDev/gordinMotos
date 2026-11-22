import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    for (let tentativa = 1; tentativa <= 5; tentativa++) {
      try {
        await this.$connect();
        this.logger.log('Banco conectado');
        return;
      } catch (e) {
        this.logger.warn(`Falha ao conectar (${tentativa}/5)`);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    this.logger.error('Banco indisponível. O servidor continua rodando.');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}