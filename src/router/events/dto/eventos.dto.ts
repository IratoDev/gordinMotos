import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { TiposEventos } from '../../../../generated/prisma/enums.js';

export class CriarEventoDto {
  @IsEnum(TiposEventos)
  tipo: TiposEventos;

  // public_id do veículo (UUID). Obrigatório em VISUALIZOU e CLICOU_WHATSAPP
  @IsOptional()
  @IsUUID()
  veiculo_id?: string;

  // Obrigatório em BUSCOU
  @IsOptional()
  @IsString()
  @MaxLength(100)
  termo_busca?: string;
}