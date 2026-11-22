export type Clientes = {
  id: number;
  public_id: string;
  nome: string;
  email: string;
  senha: string;
  data_nascimento: Date;
  celular: string | null;
  telefone: string | null;
  criado_em: Date;
  modificado_em: Date;
};

export type Usuarios = {

  public_id: string;
  nome: string;
  email: string;
  senha: string;
  ativo: boolean;
  criado_em: Date;
  modificado_em: Date;
};


export type Veiculos = {

  public_id: string;
  nome: string;
  ano_fab: number;
  detalhes: string | null;
  opicionais: string | null;
  km: number;
  placa: string;
  destaque: boolean;
  combustivel: Combustivel;
  preco: number;
  ativo: boolean;
  criado_em: Date;
  cambio: Cambio;
  opcionais: string;
  marca: Marcas;
  categoria: Categorias;
  modificado_em: Date;
  categoria_id: number;
  modelo_id: string;
  imagens: Imagem[],
  modelo: Modelos,
  cores: Cores[]

};

export type Imagem = {
  public_id: string;
  url: string;
  principal: boolean;
};

export type Marcas = {
  id: number;
  public_id: string;
  descricao: string;
  criado_em: Date;
  modificado_em: Date;
  modelos?: Modelos[] 
};

export type Modelos = {
  id: number;
  public_id: string;
  descricao: string;
  ano_mod: number;
  marca_id: number;
  marca: Marcas;
  criado_em: Date;
  modificado_em: Date;
};

export type Cores = {
  id: number;
  public_id: string;
  descricao: string;
  hexadecimal: string;
  criado_em: Date;
  modificado_em: Date;
};

export type Categorias = {
  id: number;
  public_id: string;
  descricao: string;
  criado_em: Date;
  modificado_em: Date;
};

export type Assessment = {
  public_id: string;
  nota: number;         
  texto: string;
  aprovada: boolean;
  criado_em: string;
  veiculo:Veiculos;
  cliente:Clientes  
}

export type Combustivel =
  | 'GASOLINA'
  | 'ETANOL'
  | 'FLEX'
  | 'DIESEL'
  | 'ELETRICO'
  | 'HIBRIDO';

export type Cambio =  

  | 'MANUAL'
  | 'MANUAL_4_MARCHAS'
  | 'MANUAL_5_MARCHAS'
  | 'MANUAL_6_MARCHAS'
  | 'SEMIAUTOMATICO'
  | 'SEMIAUTOMATICO_ROTATIVO'
  | 'AUTOMATICO'
  | 'CVT'
  | 'DCT'
  | 'AMT'
  | 'E_CLUTCH'
  | 'SEQUENCIAL'
  | 'ELETRONICO'
  | 'ELETRICO'