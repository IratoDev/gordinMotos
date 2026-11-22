
import { IsHexColor, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateColorDto {

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsHexColor()
  @IsNotEmpty()
  hexadecimal: string;
}

export class UpdateColorDto extends PartialType(CreateColorDto) {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  public_id: string;

  @IsString()
  @IsNotEmpty()
  descricao: string;

  @IsHexColor()
  @IsNotEmpty()
  hexadecimal: string;
}
