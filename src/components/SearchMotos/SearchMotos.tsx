import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { responsiveSizes } from "../../assets/font/font";
import { useApp } from "../../context/Context";
import type { Marcas, Modelos } from "../../context/dataTypes";

const ROTA_VEICULOS = "/veiculos"; // ajuste para a rota real da tela Vehicles

type Tab = "marca" | "preco" | "ano";

type Form = {
  marca: string;
  modelo: string;
  precoDe: string;
  precoAte: string;
  anoDe: string;
  anoAte: string;
};

// Campos que cada aba envia (os nomes são os mesmos que a tela Vehicles lê na URL)
const CAMPOS_POR_ABA: Record<Tab, (keyof Form)[]> = {
  marca: ["marca", "modelo"],
  preco: ["precoDe", "precoAte"],
  ano: ["anoDe", "anoAte"],
};

const FORM_INICIAL: Form = {
  marca: "",
  modelo: "",
  precoDe: "",
  precoAte: "",
  anoDe: "",
  anoAte: "",
};

export default function SearchMotos() {
  const navigate = useNavigate();
  const { brands } = useApp();

  const [aba, setAba] = useState<Tab>("marca");
  const [form, setForm] = useState<Form>(FORM_INICIAL);

  const tabs = [
    { id: "marca", label: "Marca e modelo" },
    { id: "preco", label: "Faixa de preço" },
    { id: "ano", label: "Faixa de ano" },
  ] as const;

  // Modelos da marca escolhida, sem repetir (o mesmo modelo pode ter vários anos)
  const marcaSelecionada = brands.find(
    (marca: Marcas) => marca.descricao === form.marca
  );
  const modelos = [
    ...new Set(
      marcaSelecionada?.modelos?.map((m: Modelos) => m.descricao) ?? []
    ),
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      // Trocou a marca: o modelo escolhido antes não vale mais
      ...(name === "marca" ? { modelo: "" } : {}),
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Monta a URL só com os campos da aba atual que foram preenchidos
    const params = new URLSearchParams();
    CAMPOS_POR_ABA[aba].forEach((campo) => {
      if (form[campo]) params.set(campo, form[campo]);
    });

    const query = params.toString();
    navigate(query ? `${ROTA_VEICULOS}?${query}` : ROTA_VEICULOS);
  };

  const inputClass =
    "w-full bg-transparent py-2 text-sm text-gray-900 focus:outline-none placeholder-gray-400 border-b border-gray-200 focus:border-gray-400 flex-1";

  const selectClass =
    "w-full appearance-none bg-transparent py-2 text-sm text-gray-900 focus:outline-none cursor-pointer pr-8 flex-1";

  return (
    <div className="w-full p-4 my-4 border border-cinza-300 rounded-lg shadow-md">
      {/* Abas */}
      <nav className="grid grid-cols-3 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setAba(tab.id)}
            style={{ fontSize: responsiveSizes.text.medium }}
            className={`p-4 text-sm font-semibold transition ${
              aba === tab.id
                ? "border-b-2 border-vermelho-600 text-vermelho-600"
                : "text-cinza-500 hover:text-cinza-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Conteúdo */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap items-center gap-3 p-4"
      >
        {aba === "marca" && (
          <>
            <select
              name="marca"
              value={form.marca}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Selecione a marca</option>
              {brands.map((marca: Marcas) => (
                <option key={marca.public_id} value={marca.descricao}>
                  {marca.descricao}
                </option>
              ))}
            </select>

            <select
              name="modelo"
              value={form.modelo}
              onChange={handleChange}
              disabled={!form.marca}
              className={`${selectClass} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              <option value="">Selecione o modelo</option>
              {modelos.map((modelo) => (
                <option key={modelo} value={modelo}>
                  {modelo}
                </option>
              ))}
            </select>

            <button type="submit" className="bg-verde-500 p-2 rounded-xl">
              <p
                className="text-branco font-semibold leading-6"
                style={{ fontSize: responsiveSizes.text.small }}
              >
                Pesquisar
              </p>
            </button>
          </>
        )}

        {aba === "preco" && (
          <>
            <input
              type="number"
              name="precoDe"
              value={form.precoDe}
              onChange={handleChange}
              min={0}
              placeholder="Preço de"
              className={inputClass}
            />

            <input
              type="number"
              name="precoAte"
              value={form.precoAte}
              onChange={handleChange}
              min={0}
              placeholder="Preço até"
              className={inputClass}
            />

            <button type="submit" className="bg-verde-500 p-2 rounded-xl">
              <p
                className="text-branco font-semibold leading-6"
                style={{ fontSize: responsiveSizes.text.small }}
              >
                Filtrar
              </p>
            </button>
          </>
        )}

        {aba === "ano" && (
          <>
            <input
              type="number"
              name="anoDe"
              value={form.anoDe}
              onChange={handleChange}
              min={1900}
              max={2100}
              placeholder="Ano de"
              className={inputClass}
            />

            <input
              type="number"
              name="anoAte"
              value={form.anoAte}
              onChange={handleChange}
              min={1900}
              max={2100}
              placeholder="Ano até"
              className={inputClass}
            />

            <button type="submit" className="bg-verde-500 p-2 rounded-xl">
              <p
                className="text-branco font-semibold leading-6"
                style={{ fontSize: responsiveSizes.text.small }}
              >
                Filtrar
              </p>
            </button>
          </>
        )}
      </form>
    </div>
  );
}