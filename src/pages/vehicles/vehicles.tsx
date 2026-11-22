import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useApp } from "../../context/Context";
import { FaSearch, FaFilter, FaSlidersH, FaTimes } from "react-icons/fa";
import { Inpunt } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { CardsDestaque } from "../../components/CardsDestaque/CardsDestaque";
import { SearchText } from "../../components/SearchText/SearchText";
import { registrarEvento } from "../../lib/eventos"; // ajuste o caminho
import type { Categorias, Veiculos } from "../../context/dataTypes";

/* ------------------------------------------------------------------ */
/* Tipos e constantes                                                  */
/* ------------------------------------------------------------------ */

type Option = {
  public_id: string;
  descricao: string;
};

type Filtros = {
  marca: string[];      // public_id das marcas (checkbox)
  cor: string[];        // public_id das cores (checkbox)
  carroceria: string[]; // public_id das categorias (checkbox)
  precoDe: string;
  precoAte: string;
  kmDe: string;
  kmAte: string;
  anoDe: string;
  anoAte: string;
  marcaBusca: string;   // descrição da marca (vem da URL)
  modeloBusca: string;  // descrição do modelo (vem da URL)
  busca: string;        // termo digitado e já pesquisado
  ordem: string;
};

// Textos que significam "sem filtro"
const TODAS_MARCAS = "Todas as marcas";
const TODOS_MODELOS = "Todos os modelos";
const SEM_ORDEM = "Ordenar por...";

const ORDENACOES = [
  SEM_ORDEM,
  "Menor preço",
  "Maior preço",
  "Menor ano",
  "Maior ano",
  "A-Z",
  "Z-A",
  "Data de publicação",
];

const FILTROS_INICIAIS: Filtros = {
  marca: [],
  cor: [],
  carroceria: [],
  precoDe: "",
  precoAte: "",
  kmDe: "",
  kmAte: "",
  anoDe: "",
  anoAte: "",
  marcaBusca: TODAS_MARCAS,
  modeloBusca: TODOS_MODELOS,
  busca: "",
  ordem: SEM_ORDEM,
};

// Lê os filtros vindos da URL, ex: /veiculos?marca=Honda&precoAte=20000
// (é o que a tela SearchMotos envia)
function filtrosDaUrl(params: URLSearchParams): Filtros {
  const marca = params.get("marca");
  return {
    ...FILTROS_INICIAIS,
    marca: marca ? [marca] : [],
    modeloBusca: params.get("modelo") || TODOS_MODELOS,
    precoDe: params.get("precoDe") ?? "",
    precoAte: params.get("precoAte") ?? "",
    anoDe: params.get("anoDe") ?? "",
    anoAte: params.get("anoAte") ?? "",
  };
}

/* ------------------------------------------------------------------ */
/* Lógica do filtro (função pura, fácil de testar)                     */
/* ------------------------------------------------------------------ */

// Ignora acento e maiúscula
const normalizar = (t: string) =>
  t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

function filtrarVeiculos(lista: Veiculos[], f: Filtros): Veiculos[] {
  const precoDe = f.precoDe !== "" ? Number(f.precoDe) : null;
  const precoAte = f.precoAte !== "" ? Number(f.precoAte) : null;
  const kmDe = f.kmDe !== "" ? Number(f.kmDe) : null;
  const kmAte = f.kmAte !== "" ? Number(f.kmAte) : null;
  const anoDe = f.anoDe !== "" ? Number(f.anoDe) : null;
  const anoAte = f.anoAte !== "" ? Number(f.anoAte) : null;

  const palavras = normalizar(f.busca).split(" ").filter(Boolean);

  const resultado = lista.filter((v) => {
    // O preço pode chegar como string (Decimal do Prisma), por isso Number()
    const preco = Number(v.preco);
    const km = Number(v.km);

    // Pesquisa por escrita: todas as palavras precisam aparecer
    if (palavras.length > 0) {
      const texto = normalizar(
        `${v.nome} ${v.marca?.descricao ?? ""} ${v.modelo?.descricao ?? ""}`
      );
      if (!palavras.every((p) => texto.includes(p))) return false;
    }

    // Checkboxes
    if (f.marca.length > 0 && !f.marca.includes(v.marca?.public_id ?? "")) {
      return false;
    }
    if (f.cor.length > 0 && !v.cor?.some((c) => f.cor.includes(c.public_id))) {
      return false;
    }
    if (
      f.carroceria.length > 0 &&
      !f.carroceria.includes(v.categoria?.public_id ?? "")
    ) {
      return false;
    }

    // Marca e modelo vindos da URL
    if (f.marcaBusca !== TODAS_MARCAS && v.marca?.descricao !== f.marcaBusca) {
      return false;
    }
    if (
      f.modeloBusca !== TODOS_MODELOS &&
      v.modelo?.descricao !== f.modeloBusca
    ) {
      return false;
    }

    // Faixas
    if (precoDe !== null && preco < precoDe) return false;
    if (precoAte !== null && preco > precoAte) return false;
    if (kmDe !== null && km < kmDe) return false;
    if (kmAte !== null && km > kmAte) return false;
    if (anoDe !== null && v.ano_fab < anoDe) return false;
    if (anoAte !== null && v.ano_fab > anoAte) return false;

    return true;
  });

  // Ordenação
  switch (f.ordem) {
    case "Menor preço":
      return resultado.sort((a, b) => Number(a.preco) - Number(b.preco));
    case "Maior preço":
      return resultado.sort((a, b) => Number(b.preco) - Number(a.preco));
    case "Menor ano":
      return resultado.sort((a, b) => a.ano_fab - b.ano_fab);
    case "Maior ano":
      return resultado.sort((a, b) => b.ano_fab - a.ano_fab);
    case "A-Z":
      return resultado.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
    case "Z-A":
      return resultado.sort((a, b) => b.nome.localeCompare(a.nome, "pt-BR"));
    case "Data de publicação": // mais recentes primeiro
      return resultado.sort(
        (a, b) =>
          new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime()
      );
    default:
      return resultado;
  }
}

/* ------------------------------------------------------------------ */
/* Tela                                                                */
/* ------------------------------------------------------------------ */

export default function Vehicles() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();
  const [filtros, setFiltros] = useState<Filtros>(() =>
    filtrosDaUrl(searchParams)
  );

  // Texto que o usuário está digitando (só vira filtro ao clicar em Pesquisar)
  const [textoBusca, setTextoBusca] = useState("");

  // Se a URL mudar com a tela já aberta, atualiza os filtros
  useEffect(() => {
    setFiltros(filtrosDaUrl(searchParams));
    setTextoBusca("");
  }, [searchParams]);

  // Usa direto do contexto (sem copiar para useState), assim atualiza
  // quando os dados terminam de carregar
  const { vehicles, colors, brands } = useApp();

  // Resultado do filtro: recalcula só quando veículos ou filtros mudam
  const veiculosFiltrados = useMemo(
    () => filtrarVeiculos(vehicles ?? [], filtros),
    [vehicles, filtros]
  );

  // Categorias (carroceria) tiradas dos próprios veículos, sem repetir
  const categorias = useMemo(() => {
    const mapa = new Map<string, Categorias>();
    (vehicles ?? []).forEach((v: Veiculos) => {
      if (v.categoria) mapa.set(v.categoria.public_id, v.categoria);
    });
    return [...mapa.values()];
  }, [vehicles]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFiltros((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckbox = (
    name: "marca" | "cor" | "carroceria",
    value: string
  ) => {
    setFiltros((prev) => ({
      ...prev,
      [name]: prev[name].includes(value)
        ? prev[name].filter((item) => item !== value)
        : [...prev[name], value],
    }));
  };

  // Clicou em Pesquisar (ou Enter): aplica o termo e registra o evento
  const handleBuscar = () => {
    const termo = textoBusca.trim();
    setFiltros((prev) => ({ ...prev, busca: termo }));
    if (termo) registrarEvento({ tipo: "BUSCOU", termo_busca: termo });
    setShowFilters(false);
  };

  // Os filtros já são aplicados na hora; o botão só fecha o painel no celular
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowFilters(false);
  };

  const renderOptions = (
    title: string,
    name: "marca" | "cor" | "carroceria",
    options: Option[]
  ) => (
    <div className="border-b border-gray-200 py-5">
      <h3 className="mb-4 text-sm font-bold uppercase text-gray-800">
        {title}
      </h3>

      {options.length > 0 ? (
        <div className="max-h-48 space-y-3 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option.public_id}
              className="flex cursor-pointer items-center gap-3 text-sm text-gray-600 hover:text-red-600"
            >
              <input
                type="checkbox"
                checked={filtros[name].includes(option.public_id)}
                onChange={() => handleCheckbox(name, option.public_id)}
                className="h-4 w-4 accent-vermelho-600"
              />
              {option.descricao}
            </label>
          ))}
        </div>
      ) : (
        <p className="text-xs text-gray-400">Nenhuma opção disponível.</p>
      )}
    </div>
  );


  return (
    <main className="min-h-screen w-full bg-gray-50 py-8 mt-24">
      <div className="mx-auto max-w-7xl px-4">

        {/* CABEÇALHO */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Nosso estoque
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Encontre o veículo ideal para você.
          </p>
        </div>

        {/* BOTÕES MOBILE */}
        <div className="mb-4 flex gap-3 lg:hidden">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            {showFilters ? <FaTimes /> : <FaFilter />}
            {showFilters ? "Fechar filtros" : "Filtros"}
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">

          {/* SIDEBAR */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } rounded-lg border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:col-span-3 lg:block`}
          >
            <div className="mb-2 flex items-center gap-3">
              <FaSlidersH className="text-red-600" size={19} />

              <h2 className="text-lg font-bold text-gray-800">
                Filtrar resultados
              </h2>
            </div>

            <form onSubmit={handleSubmit}>

              {/* MARCAS */}
              {renderOptions("Marca", "marca", brands)}

              {/* PREÇO */}
              <div className="border-b border-gray-200 py-5">
                <h3 className="mb-4 text-sm font-bold uppercase text-gray-800">
                  Preço
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      De
                    </label>

                    <Inpunt
                      type={"number"}
                      name={"precoDe"}
                      value={filtros.precoDe}
                      handleChange={handleChange}
                      placeholder={"Mínimo"}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Até
                    </label>

                    <Inpunt
                      type={"number"}
                      name={"precoAte"}
                      value={filtros.precoAte}
                      handleChange={handleChange}
                      placeholder={"Máximo"}
                    />
                  </div>
                </div>
              </div>

              {/* QUILOMETRAGEM */}
              <div className="border-b border-gray-200 py-5">
                <h3 className="mb-4 text-sm font-bold uppercase text-gray-800">
                  Quilometragem
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      De
                    </label>

                    <Inpunt
                      type={"number"}
                      name={"kmDe"}
                      value={filtros.kmDe}
                      handleChange={handleChange}
                      placeholder={"Mínimo"}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Até
                    </label>

                    <Inpunt
                      type={"number"}
                      name={"kmAte"}
                      value={filtros.kmAte}
                      handleChange={handleChange}
                      placeholder={"Máximo"}
                    />
                  </div>
                </div>
              </div>

              {/* ANO */}
              <div className="border-b border-gray-200 py-5">
                <h3 className="mb-4 text-sm font-bold uppercase text-gray-800">
                  Ano
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      De
                    </label>

                    <Inpunt
                      type={"number"}
                      name={"anoDe"}
                      value={filtros.anoDe}
                      handleChange={handleChange}
                      placeholder={"Mínimo"}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Até
                    </label>

                    <Inpunt
                      type={"number"}
                      name={"anoAte"}
                      value={filtros.anoAte}
                      handleChange={handleChange}
                      placeholder={"Máximo"}
                    />
                  </div>
                </div>
              </div>

              {/* CORES */}
              {renderOptions("Cor", "cor", colors)}

              {/* CARROCERIA */}
              {renderOptions("Carroceria", "carroceria", categorias)}

              {/* BOTÕES */}
              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 lg:hidden"
                >
                  Ver {veiculosFiltrados.length} resultado(s)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFiltros(FILTROS_INICIAIS);
                    setTextoBusca("");
                  }}
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Limpar filtros
                </button>
              </div>
            </form>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <section className="min-w-0 lg:col-span-9">

            {/* PESQUISA POR ESCRITA */}
            <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-5">
              <SearchText
                value={textoBusca}
                onChange={setTextoBusca}
                onSearch={handleBuscar}
              />
            </div>

            {/* ORDENAÇÃO */}
            <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Veículos disponíveis
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {veiculosFiltrados.length} veículo(s) encontrado(s).
                </p>
              </div>

              <Select
                name={"ordem"}
                value={filtros.ordem}
                handleChange={handleChange}
                list={ORDENACOES}
              />
            </div>

            {/* RESULTADOS */}
            <div className="flex flex-wrap justify-center gap-10 min-h-64 rounded-lg border border-gray-200 bg-white p-5 shadow-sm ">
              {veiculosFiltrados.length > 0 ? (
                <>
                  {veiculosFiltrados.map((moto: Veiculos) => (
                    <CardsDestaque key={moto.public_id} moto={moto} />
                  ))}
                </>
              ) : (
                <div className="flex min-h-56 flex-col items-center justify-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <FaSearch size={25} className="text-gray-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    Nenhum resultado encontrado
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                    Não encontramos veículos para os filtros selecionados.
                    Tente alterar os critérios de pesquisa.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}