
import { useState, type FormEvent } from "react";

import { Inpunt } from "../../components/ui/input";
import { Select } from "../../components/ui/select";

type InputField = {
  type: "input";
  name: string;
  label: string;
  placeholder?: string;
  inputType?: string;
  colSpan?: number;
};

type SelectField = {
  type: "select";
  name: string;
  label: string;
  placeholder?: string;
  options: string[];
  colSpan?: number;
};

type FormField = InputField | SelectField;

interface FormSection {
  title: string;
  fields: FormField[];
}

// Dados da moto
const formDataMoto: FormField[] = [
  {
    type: "input",
    name: "marca",
    label: "Marca",
    placeholder: "Ex. Yamaha",
    colSpan: 3,
  },
  {
    type: "input",
    name: "modelo",
    label: "Modelo",
    placeholder: "Ex. Fazer FZ25",
    colSpan: 3,
  },
  {
    type: "input",
    name: "anoFabricacao",
    label: "Ano Fab.",
    placeholder: "Fab.",
    colSpan: 1,
  },
  {
    type: "input",
    name: "anoModelo",
    label: "Ano Modelo",
    placeholder: "Mod.",
    colSpan: 1,
  },
  {
    type: "input",
    name: "cor",
    label: "Cor",
    placeholder: "Ex. Preto",
    colSpan: 2,
  },
  {
    type: "select",
    name: "combustivel",
    label: "Combustível",
    placeholder: "Selecione",
    options: ["Gasolina", "Flex", "Elétrica"],
    colSpan: 2,
  },
];

// Dados pessoais
const formDataPerson: FormField[] = [
  {
    type: "input",
    name: "nome",
    label: "Nome",
    placeholder: "Seu nome",
    colSpan: 3,
  },
  {
    type: "input",
    name: "email",
    label: "Email",
    placeholder: "Seu email",
    inputType: "email",
    colSpan: 3,
  },
  {
    type: "input",
    name: "telefone",
    label: "Telefone",
    placeholder: "DDD + Telefone",
    colSpan: 3,
  },
  {
    type: "input",
    name: "celular",
    label: "Celular",
    placeholder: "DDD + Telefone",
    colSpan: 3,
  },
];

// Configuração das seções
const formSections: FormSection[] = [
  {
    title: "Dados da Moto",
    fields: formDataMoto,
  },
  {
    title: "Dados Pessoais",
    fields: formDataPerson,
  },
];

// Classes responsivas para as colunas
const colSpanClasses: Record<number, string> = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
};

export default function Assessment() {
  const [form, setForm] = useState<Record<string, string>>({
    marca: "",
    modelo: "",
    anoFabricacao: "",
    anoModelo: "",
    cor: "",
    combustivel: "",
    nome: "",
    email: "",
    telefone: "",
    celular: "",
    informacoesAdicionais: "",
  });

  // Atualiza os valores do formulário
  function handleChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Envio do formulário
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("Dados do formulário:", form);
  }

  // Renderização dinâmica dos campos
  function renderField(field: FormField) {
    const commonProps = {
      name: field.name,
      value: form[field.name] ?? "",
      handleChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => handleChange(field.name, event.target.value),
    };

    if (field.type === "input") {
      return (
        <Inpunt
          type={field.inputType ?? "text"}
          placeholder={field.placeholder ?? ""}
          {...commonProps}
          handleChange={()=> null}
        />
      );
    }

    return (
      <Select
        {...commonProps}
        list={field.options}
        handleChange={()=> null}
        //defaultOption={field.placeholder ?? "Selecione uma opção"}
      />
    );
  }

  return (
    <main className="
    relative flex min-h-screen w-full flex-col gap-8 py-8 mt-24">
      <div className="mx-auto w-full max-w-7xl px-4">

        {/* Cabeçalho */}
        <section className="mb-10 space-y-2">
          <h1 className="text-3xl font-bold text-cinza-800">
            Avalie a sua moto com a gente.
          </h1>

          <p className="text-sm text-cinza-600">
            Preencha o formulário abaixo e tenha a melhor avaliação
            do mercado para sua moto.
          </p>
        </section>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Seções dinâmicas */}
          {formSections.map((section) => (
            <section key={section.title} className="space-y-5">

              <h2 className="text-2xl font-bold text-cinza-800">
                {section.title}
              </h2>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    className={`flex flex-col gap-2 ${
                      colSpanClasses[field.colSpan ?? 6]
                    }`}
                  >
                    <label
                      htmlFor={field.name}
                      className="text-sm font-medium text-cinza-700"
                    >
                      {field.label}
                    </label>

                    {renderField(field)}
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Informações adicionais */}
          <section className="space-y-5">
            <h2 className="text-2xl font-bold text-cinza-800">
              Informações Adicionais
            </h2>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="informacoesAdicionais"
                className="text-sm font-medium text-cinza-700"
              >
                Descreva o estado da sua moto
              </label>

              <textarea
                id="informacoesAdicionais"
                name="informacoesAdicionais"
                value={form.informacoesAdicionais}
                onChange={(event) =>
                  handleChange(
                    "informacoesAdicionais",
                    event.target.value
                  )
                }
                placeholder="Informe detalhes sobre sua moto, conservação, acessórios, manutenção..."
                rows={5}
                className="w-full resize-y rounded-md border border-cinza-300 bg-branco px-3 py-3 text-sm text-cinza-700 outline-none transition focus:border-vermelho-500 focus:ring-2 focus:ring-vermelho-100"
              />
            </div>
          </section>

          {/* Botão */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-md bg-vermelho-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Solicitar avaliação
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}
