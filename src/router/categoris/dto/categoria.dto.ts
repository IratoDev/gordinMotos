
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateCategoriaDto {

  
  @IsString()
  @IsNotEmpty()
  descricao: string;
}

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {
  
  @IsUUID()
  @IsString()
  public_id: string;

  @IsString()
  descricao: string;
  
}
