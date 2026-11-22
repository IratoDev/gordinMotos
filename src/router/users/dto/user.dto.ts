
import { IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, Min } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto {
    
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    senha: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsNotEmpty()
    public_id: string;
  
}
