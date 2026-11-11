
import {  useState, type FormEvent, } from "react";
import { useApp, type VeiculoTipe } from "../../context/Context";
import {
  FaSearch,
  FaFilter,
  FaSlidersH,
  FaTimes,
} from "react-icons/fa";
import { Inpunt } from "../../components/ui/input";
import { Select } from "../../components/ui/select";
import { CardsDestaque } from "../../components/CardsDestaque/CardsDestaque";


interface ModeloData {
  id: string;
  public_id: string;
  descricao: string;
  marca_id: string;
}

interface MarcaData {
  id: string;
  public_id: string;
  descricao: string;
  modelos: ModeloData[];
}

type Option = {
  public_id: string;
  descricao: string;
};



export default function Vehicles() {
  const [showFilters, setShowFilters] = useState(false);

  const { veiculosData, marcasData, coresData } = useApp();

  const [veiculosFiltrados, ] = useState(veiculosData);
  const [colorList, ] = useState(coresData);
  const[marcaList, ] = useState(marcasData);
  const [filtros, setFiltros] = useState<{
    marca: string[];
    cor: string[];
    carroceria: string[];
    precoDe: string;
    precoAte: string;
    kmDe: string;
    kmAte: string;
    marcaBusca: string;
    modeloBusca: string;
    ordem: string;
  }>({
    marca: [],
    cor: [],
    carroceria: [],
    precoDe: "",
    precoAte: "",
    kmDe: "",
    kmAte: "",
    marcaBusca: "",
    modeloBusca: "",
    ordem: "",
  });

   const marcasOptions = marcaList.map(
    (marca: MarcaData) => marca.descricao
  );

  const marcaSelected = marcaList.find(
    (marca: MarcaData) => marca.public_id === filtros.marcaBusca
  );

  const modelosMarcaSelected = marcaSelected?.modelos.map(
    (modelo: ModeloData) => modelo.descricao
  ) ?? [];

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Filtros aplicados:", filtros);
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
        <p className="text-xs text-gray-400">
          Nenhuma opção disponível.
        </p>
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
              {renderOptions("Marca", "marca", marcaList)}

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
                      type={'number'}
                      name={'precoDe'} 
                      value={filtros.precoDe} 
                      handleChange={()=>handleChange} 
                      placeholder={'Mínimo'}
                    />

                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Até
                    </label>

                    <Inpunt 
                      type={'number'}
                      name={'precoAte'} 
                      value={filtros.precoAte} 
                      handleChange={()=>handleChange} 
                      placeholder={'Máximo'}
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
                      type={'number'}
                      name={'kmDe'} 
                      value={filtros.kmDe} 
                      handleChange={()=>handleChange} 
                      placeholder={'Mínimo'}
                    />

                  </div>

                  <div>
                    <label className="mb-1 block text-xs text-gray-500">
                      Até
                    </label>

                    <Inpunt 
                      type={'number'}
                      name={'kmAte'} 
                      value={filtros.kmAte} 
                      handleChange={()=>handleChange} 
                      placeholder={'Máximo'}
                    />

                  </div>
                </div>
              </div>

              {/* CORES */}
              {renderOptions("Cor", "cor", colorList)}

              {/* CARROCERIA 
              {renderOptions("Carroceria", "carroceria", carrocerias)}
              */}

              {/* APLICAR FILTROS */}
              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="submit"
                  className="w-full rounded-md bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Aplicar filtros
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFiltros({
                      marca: [],
                      cor: [],
                      carroceria: [],
                      precoDe: "",
                      precoAte: "",
                      kmDe: "",
                      kmAte: "",
                      marcaBusca: "",
                      modeloBusca: "",
                      ordem: "",
                    })
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Limpar filtros
                </button>
              </div>
            </form>
          </aside>

          {/* CONTEÚDO PRINCIPAL */}
          <section className="min-w-0 lg:col-span-9">

            {/* PESQUISA RÁPIDA */}
            <div className="mb-5 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:p-5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  console.log("Pesquisa rápida:", filtros);
                }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
              >

                <Select 
                  name={'marcaBusca'}
                  value={filtros.marcaBusca} 
                  handleChange={()=> handleChange} 
                  list={marcasOptions}
                />

                <Select 
                  name={'modeloBusca'}
                  value={filtros.modeloBusca} 
                  handleChange={()=> handleChange} 
                  list={modelosMarcaSelected}
                />

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <FaSearch />
                  Pesquisar
                </button>
              </form>
            </div>

            {/* ORDENAÇÃO */}
            <div className="mb-5 flex flex-col items-start justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-semibold text-gray-800">
                  Veículos disponíveis
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Confira os veículos encontrados.
                </p>
              </div>

              <Select 
                  name={'ordem'}
                  value={filtros.ordem} 
                  handleChange={()=> handleChange} 
                  list={[
                    "Ordenar por...",
                    "Menor preço",
                    "Maior preço",
                    "Menor ano",
                    "Maior ano",
                    "A-Z",
                    "Z-A",
                    "Data de publicação"
                  ]}
                />

            </div>

            {/* RESULTADOS */}
            <div className="min-h-64 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">

              {veiculosFiltrados ? (
                <>
                {veiculosFiltrados.map((moto:VeiculoTipe)=>(
                <CardsDestaque moto={moto}/>
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
