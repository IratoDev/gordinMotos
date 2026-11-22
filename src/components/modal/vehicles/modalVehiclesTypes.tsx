import type { ReactNode } from "react";

export type Props = {
  aberto: boolean;
  onFechar: () => void;
};

export type Imagem = {
  id: string;
  file: File;
  url: string;
};

// id = public_id vindo da API
export type Opcao = {
  id: string;
  nome: string;
};

export type InputField = {
  type: "input";
  name: string;
  label: string;
  placeholder?: string;
  inputType?: string;
  
  colSpan?: number;
};

export type SelectField = {
  type: "select";
  name: string;
  label: string;
  placeholder?: string;
  options: string[]; // nomes exibidos no Select
  
  onAdd?: () => void; // mostra o botão "+" ao lado do select
  colSpan?: number;
};

export type TextareaField = {
  type: "textarea";
  name: string;
  label: string;
  placeholder?: string;
  colSpan?: number;
};

export type FormField = InputField | SelectField | TextareaField;

export type FormSection = {
  title: string;
  fields: FormField[];
  extra?: ReactNode; // bloco customizado depois dos campos
};