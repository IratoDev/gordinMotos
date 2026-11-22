
import { IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClientDto {
    
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    data_nascimento: string

    @IsString()
    @IsNotEmpty()
    telefone: string

    @IsString()
    @IsNotEmpty()
    confirmarSenha: string
    
    @IsString()
    @IsNotEmpty()
    senha: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {

    @IsString()
    @IsNotEmpty()
    public_id: string;
  
}
