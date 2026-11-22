import {
  ArrayNotEmpty,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MaxLength,
  Min,
} from 'class-validator';

import { plainToInstance, Transform, Type } from 'class-transformer';
import { Cambio, Combustivel } from '../../../../generated/prisma/enums.js';

import { PartialType } from '@nestjs/mapped-types';


// converte o texto JSON em objeto(s) da classe certa, para o ValidateNested funcionar
const jsonPara = (classe: new () => object) =>
  ({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    try {
      return plainToInstance(classe, JSON.parse(value));
    } catch {
      return value; // JSON inválido: a validação mostra o erro
    }
  };

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  ano_fab: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  detalhes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  opcionais?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  km: number;

  @IsString()
  @IsNotEmpty()
  @Length(7, 7)
  placa: string;

  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  destaque: boolean;

  @IsEnum(Combustivel)
  combustivel: Combustivel;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  preco: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  indice_principal?: number;

  @IsString()
  cores: string[];

  @IsEnum(Cambio)
  cambio: Cambio;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsString()
  @IsNotEmpty()
  categoria: string;
}

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  public_id: string;

  @IsString()
  @IsOptional()
  remover_imagens: string

  @IsString()
  @IsOptional()
  imagem_principal: string

  @IsString()
  ativo:string

  @IsString()
  categoria_id:string

  @IsString()
  modelo_id: string

}

