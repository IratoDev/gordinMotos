
import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

import { Inpunt } from "../../components/ui/input";
import { Select } from "../../components/ui/select";


type SelectField = {
  type: "select";
  name: string;
  label: string;
  placeholder?: string;
  options: string[];
  colSpan?: number;
  required?: boolean;
};

type InputField = {
  type: "input";
  name: string;
  label: string;
  placeholder?: string;
  inputType?: string;
  colSpan?: number;
  required?: boolean;
  maxLength?: number;
};

type TextareaField = {
  type: "textarea";
  name: string;
  label: string;
  placeholder?: string;
  colSpan?: number;
  required?: boolean;
};

type CheckboxField = {
  type: "checkbox";
  name: string;
  label: string;
  required?: boolean;
};

type FormField =
  | InputField
  | SelectField
  | TextareaField
  | CheckboxField;



const formDataVehicle: FormField[] = [
  {
    type: "select",
    name: "veiculo_id",
    label: "Nossas motos",
    placeholder: "-- Selecione --",
    colSpan: 12,
    options: [],
  },
  {
    type: "input",
    name: "valor_entrada",
    label: "Valor de entrada",
    placeholder: "Valor da entrada",
    colSpan: 4,
    maxLength: 18,
  },
  {
    type: "input",
    name: "qtde_prestacoes",
    label: "Qtd. Prestações",
    placeholder: "Prestações",
    colSpan: 4,
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
    options: [
      "Solteiro",
      "Casado",
      "Separado",
      "Divorciado",
      "Viúvo",
      "Outros",
    ],
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
    options: [
      "AL", "AP", "AM", "BA", "CE", "DF", "ES",
      "GO", "MA", "MT", "MS", "MG", "PA", "PB",
      "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
      "RR", "SC", "SP", "SE", "TO",
    ],
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
    label: "Endereço",
    placeholder: "Endereço da empresa",
    colSpan: 6,
  },
  {
    type: "input",
    name: "empresaNumero",
    label: "Número",
    inputType: "number",
    placeholder: "Número",
    colSpan: 6,
  },
  {
    type: "input",
    name: "empresaComplemento",
    label: "Complemento",
    placeholder: "Complemento",
    colSpan: 4,
  },
  {
    type: "input",
    name: "empresaCep",
    label: "CEP",
    placeholder: "CEP",
    colSpan: 4,
    maxLength: 9,
  },
  {
    type: "input",
    name: "empresaBairro",
    label: "Bairro",
    placeholder: "Bairro",
    colSpan: 4,
  },
  {
    type: "input",
    name: "empresaCidade",
    label: "Cidade",
    placeholder: "Cidade",
    colSpan: 6,
  },
  {
    type: "select",
    name: "empresaUf",
    label: "Estado",
    colSpan: 6,
    options: [
      "AL", "AP", "AM", "BA", "CE", "DF", "ES",
      "GO", "MA", "MT", "MS", "MG", "PA", "PB",
      "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
      "RR", "SC", "SP", "SE", "TO",
    ],
  },
  {
    type: "input",
    name: "empresaFone",
    label: "Telefone",
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
    label: "Nome",
    placeholder: "Nome",
    colSpan: 6,
  },
  {
    type: "input",
    name: "referenciaFone1",
    label: "Telefone",
    placeholder: "DDD + Telefone",
    colSpan: 6,
    maxLength: 15,
  },
  {
    type: "input",
    name: "referenciaNome2",
    label: "Nome",
    placeholder: "Nome",
    colSpan: 6,
  },
  {
    type: "input",
    name: "referenciaFone2",
    label: "Telefone",
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


export default function Financing() {
  const [form, setForm] = useState<Record<string, string>>({});

  const formSections = [
  { title: "Dados da Moto", fields: formDataVehicle },
  { title: "Dados Pessoais", fields: formDataPerson },
  { title: "Dados Profissionais", fields: formDataProfessional },
  { title: "Referência Bancária", fields: formDataBank },
  { title: "Referência Pessoal", fields: formDataReferences },
  { title: "Informações Adicionais", fields: formDataAdditional },
];

  // Atualiza os valores dos campos
  function handleChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Envia os dados do formulário
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Dados do formulário:", form);
  }

  // Renderiza input ou select conforme a configuração
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

  // Classes de largura reconhecidas pelo Tailwind
  const colSpanClasses: Record<number, string> = {
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    6: "md:col-span-6",
    12: "md:col-span-12",
  };

  return (
    <main className="relative flex min-h-screen w-full flex-col gap-8 py-8 mt-20">
      <div className="mx-auto w-full max-w-7xl px-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex-1 mt-10">
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
                        <label className="flex items-center gap-2 text-sm">
                          {renderField(field)}
                          {field.label}
                        </label>
                      ) : (
                        <>
                          <label className="mb-1 block text-sm font-medium">
                            {field.label}
                          </label>
                          {renderField(field)}
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
    </main>
  );
}
