import { useState } from 'react';
import Modal from '../modal';

import type { FormEvent, ChangeEvent } from "react";

import { Inpunt } from "../../../components/ui/input";
import { Select } from "../../../components/ui/select";
import type { FormField } from './typesModalFinanciamento';
import type { Veiculos } from '../../../context/dataTypes';

// 55 + DDD + número da loja
const WHATSAPP_NUMERO = "5543999175256";

type Props = {
  aberto: boolean;
  moto: Veiculos;
  fechar: () => void;
};

const UFS = [
  "AL", "AP", "AM", "BA", "CE", "DF", "ES",
  "GO", "MA", "MT", "MS", "MG", "PA", "PB",
  "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
  "RR", "SC", "SP", "SE", "TO",
];

const formDataVehicle: FormField[] = [
  {
    type: "input",
    name: "valor_entrada",
    label: "Valor de entrada",
    placeholder: "Valor da entrada",
    colSpan: 6,
    maxLength: 18,
  },
  {
    type: "input",
    name: "qtde_prestacoes",
    label: "Qtd. Prestações",
    placeholder: "Prestações",
    colSpan: 6,
    maxLength: 3,
  },
];

const formDataPerson: FormField[] = [
  {
    type: "input",
    name: "nome",
    label: "Nome",
    placeholder: "Seu nome",
    required: true,
    colSpan: 6,
  },
  {
    type: "input",
    name: "cpf",
    label: "CPF",
    placeholder: "Seu CPF",
    colSpan: 6,
    maxLength: 14,
  },
  {
    type: "input",
    name: "rg",
    label: "RG",
    placeholder: "Seu RG",
    colSpan: 6,
    maxLength: 12,
  },
  {
    type: "input",
    name: "dataNascimento",
    label: "Data de nascimento",
    placeholder: "DD/MM/AAAA",
    colSpan: 6,
    maxLength: 10,
  },
  {
    type: "input",
    name: "nomeMae",
    label: "Nome da mãe",
    placeholder: "Nome da mãe",
    colSpan: 6,
  },
  {
    type: "input",
    name: "nomePai",
    label: "Nome do pai",
    placeholder: "Nome do pai",
    colSpan: 6,
  },
  {
    type: "input",
    name: "naturalidade",
    label: "Naturalidade",
    placeholder: "Naturalidade",
    colSpan: 6,
  },
  {
    type: "select",
    name: "estadoCivil",
    label: "Estado civil",
    colSpan: 6,
    options: ["Solteiro", "Casado", "Separado", "Divorciado", "Viúvo", "Outros"],
  },
  {
    type: "select",
    name: "sexo",
    label: "Sexo",
    colSpan: 6,
    options: ["Masculino", "Feminino"],
  },
  {
    type: "input",
    name: "email",
    label: "Email",
    placeholder: "Seu email",
    inputType: "email",
    required: true,
    colSpan: 6,
  },
  {
    type: "input",
    name: "foneFixo",
    label: "Telefone",
    placeholder: "DDD + Telefone",
    colSpan: 6,
    maxLength: 15,
  },
  {
    type: "input",
    name: "foneCel",
    label: "Celular",
    placeholder: "DDD + Telefone",
    colSpan: 6,
    maxLength: 15,
  },
  {
    type: "input",
    name: "endereco",
    label: "Endereço",
    placeholder: "Seu endereço",
    colSpan: 6,
  },
  {
    type: "input",
    name: "numero",
    label: "Número",
    inputType: "number",
    placeholder: "Número",
    colSpan: 6,
  },
  {
    type: "input",
    name: "complemento",
    label: "Complemento",
    placeholder: "Complemento",
    colSpan: 4,
  },
  {
    type: "input",
    name: "cep",
    label: "CEP",
    placeholder: "CEP",
    colSpan: 4,
    maxLength: 9,
  },
  {
    type: "input",
    name: "bairro",
    label: "Bairro",
    placeholder: "Bairro",
    colSpan: 4,
  },
  {
    type: "input",
    name: "cidade",
    label: "Cidade",
    placeholder: "Cidade",
    colSpan: 4,
  },
  {
    type: "select",
    name: "uf",
    label: "Estado",
    colSpan: 4,
    options: UFS,
  },
  {
    type: "input",
    name: "tempoResidencia",
    label: "Tempo de residência",
    placeholder: "Tempo de residência",
    colSpan: 4,
  },
];

const formDataProfessional: FormField[] = [
  {
    type: "input",
    name: "empresaNome",
    label: "Empresa onde trabalha",
    placeholder: "Empresa onde trabalha",
    colSpan: 6,
  },
  {
    type: "input",
    name: "empresaCnpj",
    label: "CNPJ",
    placeholder: "CNPJ",
    colSpan: 6,
    maxLength: 18,
  },
  {
    type: "input",
    name: "cargo",
    label: "Cargo/Função",
    placeholder: "Cargo/Função",
    colSpan: 6,
  },
  {
    type: "input",
    name: "renda",
    label: "Renda",
    placeholder: "Renda atual",
    colSpan: 6,
    maxLength: 18,
  },
  {
    type: "input",
    name: "empresaEndereco",
    label: "Endereço da empresa",
    placeholder: "Endereço da empresa",
    colSpan: 6,
  },
  {
    type: "input",
    name: "empresaNumero",
    label: "Número da empresa",
    inputType: "number",
    placeholder: "Número",
    colSpan: 6,
  },
  {
    type: "input",
    name: "empresaComplemento",
    label: "Complemento da empresa",
    placeholder: "Complemento",
    colSpan: 4,
  },
  {
    type: "input",
    name: "empresaCep",
    label: "CEP da empresa",
    placeholder: "CEP",
    colSpan: 4,
    maxLength: 9,
  },
  {
    type: "input",
    name: "empresaBairro",
    label: "Bairro da empresa",
    placeholder: "Bairro",
    colSpan: 4,
  },
  {
    type: "input",
    name: "empresaCidade",
    label: "Cidade da empresa",
    placeholder: "Cidade",
    colSpan: 6,
  },
  {
    type: "select",
    name: "empresaUf",
    label: "Estado da empresa",
    colSpan: 6,
    options: UFS,
  },
  {
    type: "input",
    name: "empresaFone",
    label: "Telefone da empresa",
    placeholder: "DDD + Telefone",
    colSpan: 6,
    maxLength: 15,
  },
  {
    type: "input",
    name: "tempoEmprego",
    label: "Tempo neste emprego",
    placeholder: "Tempo neste emprego",
    colSpan: 6,
  },
];

const formDataBank: FormField[] = [
  {
    type: "input",
    name: "banco",
    label: "Banco",
    placeholder: "Nome do banco",
    colSpan: 4,
  },
  {
    type: "input",
    name: "agencia",
    label: "Agência",
    placeholder: "Número da agência",
    colSpan: 4,
  },
  {
    type: "input",
    name: "conta",
    label: "Conta",
    placeholder: "Número da conta",
    colSpan: 4,
  },
  {
    type: "input",
    name: "tempoContaBancaria",
    label: "Tempo de conta",
    placeholder: "Tempo de conta",
    colSpan: 4,
  },
];

const formDataReferences: FormField[] = [
  {
    type: "input",
    name: "referenciaNome1",
    label: "Nome (ref. 1)",
    placeholder: "Nome",
    colSpan: 6,
  },
  {
    type: "input",
    name: "referenciaFone1",
    label: "Telefone (ref. 1)",
    placeholder: "DDD + Telefone",
    colSpan: 6,
    maxLength: 15,
  },
  {
    type: "input",
    name: "referenciaNome2",
    label: "Nome (ref. 2)",
    placeholder: "Nome",
    colSpan: 6,
  },
  {
    type: "input",
    name: "referenciaFone2",
    label: "Telefone (ref. 2)",
    placeholder: "DDD + Telefone",
    colSpan: 6,
    maxLength: 15,
  },
];

const formDataAdditional: FormField[] = [
  {
    type: "textarea",
    name: "informacoesAdicionais",
    label: "Informações adicionais",
    placeholder: "Digite outras informações relevantes...",
    colSpan: 12,
  },
  {
    type: "checkbox",
    name: "aceito-politica-privacidade",
    label: "Li e concordo com a política de privacidade",
    required: true,
  },
];

const formSections = [
  { title: "Dados da Moto", fields: formDataVehicle },
  { title: "Dados Pessoais", fields: formDataPerson },
  { title: "Dados Profissionais", fields: formDataProfessional },
  { title: "Referência Bancária", fields: formDataBank },
  { title: "Referência Pessoal", fields: formDataReferences },
  { title: "Informações Adicionais", fields: formDataAdditional },
];

// Classes de largura reconhecidas pelo Tailwind
const colSpanClasses: Record<number, string> = {
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  6: "md:col-span-6",
  12: "md:col-span-12",
};

// Campos que podem ficar vazios
const CAMPOS_OPCIONAIS = [
  "complemento",
  "empresaComplemento",
  "informacoesAdicionais",
];

export function ModalFinancing({ aberto, fechar, moto }: Props) {
  const [form, setForm] = useState<Record<string, string>>({});
  const [erros, setErros] = useState<Record<string, string>>({});

  function validar() {
    const novosErros: Record<string, string> = {};

    formSections.forEach((section) => {
      section.fields.forEach((field) => {
        if (CAMPOS_OPCIONAIS.includes(field.name)) return;

        const valor = form[field.name]?.trim();
        if (!valor) {
          novosErros[field.name] =
            field.type === "checkbox"
              ? "Você precisa aceitar a política de privacidade"
              : "Preencha este campo";
        }
      });
    });

    return novosErros;
  }

  // Atualiza os valores dos campos
  function handleChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErros((prev) => ({ ...prev, [name]: "" }));
  }

  // Monta a mensagem e abre o WhatsApp
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    event.preventDefault();

    const novosErros = validar();
    setErros(novosErros);

    const primeiroErro = Object.keys(novosErros)[0];
    if (primeiroErro) {
      document
        .querySelector(`[name="${primeiroErro}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return; // não envia
    }

    const linhas: string[] = [
      "*Simulação de financiamento*",
      "",
      "*Moto escolhida*",
      
      `${moto.marca.descricao} ${moto.modelo.descricao} ${moto.ano_fab}`,
    ];

    formSections.forEach((section) => {
      linhas.push("", `*${section.title}*`);
      section.fields.forEach((field) => {
        if (field.type === "checkbox") return;
        const valor = form[field.name];
        if (valor) linhas.push(`${field.label}: ${valor}`);
      });
    });

    const texto = encodeURIComponent(linhas.join("\n"));
    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${texto}`, "_blank");
  }

  // Renderiza input, select, textarea ou checkbox conforme a configuração
  function renderField(field: FormField) {
    const commonProps = {
      name: field.name,
      value: form[field.name] ?? "",
      handleChange: (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      ) => handleChange(field.name, event.target.value),
    };

    if (field.type === "input") {
      return (
        <Inpunt
          type={field.inputType ?? "text"}
          placeholder={field.placeholder ?? ""}
          {...commonProps}
        />
      );
    }

    if (field.type === "select") {
      return <Select {...commonProps} list={field.options} />;
    }

    if (field.type === "textarea") {
      return (
        <textarea
          name={field.name}
          value={form[field.name] ?? ""}
          onChange={(event) => handleChange(field.name, event.target.value)}
          placeholder={field.placeholder}
          className="w-full rounded-md border border-cinza-300 bg-white px-3 py-3 text-sm outline-none focus:border-vermelho-500 focus:ring-2 focus:ring-vermelho-100"
        />
      );
    }

    return (
      <input
        type="checkbox"
        name={field.name}
        checked={form[field.name] === "1"}
        required={field.required}
        onChange={(event) =>
          handleChange(field.name, event.target.checked ? "1" : "")
        }
      />
    );
  }

  return (
    <Modal
      aberto={aberto}
      corFundo="bg-branco"
      modalSize="max-w-7xl"
      fechar={fechar}
      titulo="Faça uma simulação de financiamento"
    >
      <div className="mx-auto w-full px-4 max-h-[80vh] overflow-y-scroll text-black bg-branco">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex-1 mt-10">
            {/* Moto vinda da prop */}
            <div className="mb-6 rounded-md border border-cinza-300 p-4">
              <h2 className="text-xl font-bold">Moto selecionada</h2>
              <p>
                {moto.marca.descricao} {moto.modelo.descricao} {moto.ano_fab}
              </p>
            </div>

            {formSections.map((section) => (
              <section key={section.title} className="space-y-4">
                <h2 className="text-xl font-bold">{section.title}</h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                  {section.fields.map((field) => (
                    <div
                      key={field.name}
                      className={`col-span-1 ${
                        colSpanClasses[field.colSpan ?? 12] ?? "md:col-span-12"
                      }`}
                    >
                      {field.type === "checkbox" ? (
                        <>
                          <label className="flex items-center gap-2 text-sm">
                            {renderField(field)}
                            {field.label}
                          </label>
                          {erros[field.name] && (
                            <p className="mt-1 text-sm text-red-600">{erros[field.name]}</p>
                          )}
                        </>
                      ) : (
                        <>
                          <label className="mb-1 block text-sm font-medium">{field.label}</label>
                          {renderField(field)}
                          {erros[field.name] && (
                            <p className="mt-1 text-sm text-red-600">{erros[field.name]}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <button
            type="submit"
            className="rounded-md bg-vermelho-500 px-6 py-3 font-semibold text-white transition hover:bg-vermelho-600"
          >
            Enviar financiamento
          </button>
        </form>
      </div>
    </Modal>
  );
}