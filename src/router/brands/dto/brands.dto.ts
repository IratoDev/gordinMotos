import {

  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  
} from 'class-validator';



import { PartialType } from '@nestjs/mapped-types';




export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  descricao: string;

 
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {

  @IsString()
  @IsUUID()
  @IsNotEmpty()
  public_id: string;

  @IsString()
  @IsOptional()
  descricao: string

}
