
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateModelDto {
    
    @IsString()
    @IsNotEmpty()
    descricao: string;

    @IsInt()
    @Min(1900)
    @IsNotEmpty()
    ano_mod: number;

    @IsString()
    @IsNotEmpty()
    marca_public_id: string;
}

export class UpdateModelDto extends PartialType(CreateModelDto) {

    @IsString()
    @IsNotEmpty()
    public_id:string;

    @IsString()
    @IsNotEmpty()
    marca_public_id: string;

    @IsInt()
    @Min(1900)
    @IsNotEmpty()
    ano_mod: number;

    @IsString()
    @IsNotEmpty()
    descricao: string;
  
}
