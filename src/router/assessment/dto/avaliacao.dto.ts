import { IsInt, IsOptional, IsString, IsBoolean, Max, Min } from 'class-validator';

export class CreateAvaliacaoDto {
  @IsString() veiculo_public_id: string;

  @IsString() cliente_public_id: string;
  @IsString() informacoesAdicionais: string;
  
  @IsInt() @Min(1) @Max(5) estrelas: number;
  @IsOptional() @IsString() texto?: string;
}

// só o admin usa, para aprovar ou reprovar
export class AprovarAvaliacaoDto {
  @IsBoolean() aprovada: boolean;
  @IsString() public_id: string;
}