import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { FaMotorcycle, FaWhatsapp } from 'react-icons/fa';
import { FiEye, FiPercent, FiStar, FiMessageSquare } from 'react-icons/fi';
import { api } from '../../service/apiClient';
import { useApp } from '../../context/Context';
import type { Veiculos } from '../../context/dataTypes';
import { Select } from '../Ui/select';
import { ModalLoading } from '../loadingComponent/LoadingComponent';
import { ModalErro } from '../erroComponete/ErroComponent';

/* ---------- Tipos ---------- */

type ItemRanking = {
  nome: string;
  valor: number;
};

type Indicadores = {
  visualizacoes: number;
  cliquesWhatsApp: number;
  veiculosAtivos: number;
  totalAvaliacoes: number;
  mediaNotas: number;
};

type StatProps = {
  icon: IconType;
  label: string;
  value: string | number;
};

type RankingProps = {
  titulo: string;
  itens: ItemRanking[];
  vazio?: string;
};

type PeriodoType ={
  label: string,
  value: number
}

/* ---------- Helpers ---------- */

const indicadoresVazio: Indicadores = {
  visualizacoes: 0,
  cliquesWhatsApp: 0,
  veiculosAtivos: 0,
  totalAvaliacoes: 0,
  mediaNotas: 0,
};

// Converte o que a API devolve para { nome, valor }.
// AJUSTE os nomes dos campos conforme o seu back-end.
function paraRanking(lista: any): ItemRanking[] {
  if (!Array.isArray(lista)) return [];
  return lista.map((item) => ({
    nome: String(
      item.nome ?? item.marca ?? item.termo ?? item.termo_busca ?? item.descricao ?? '',
    ),
    valor: Number(
      item.valor ??
        item.total ??
        item.quantidade ??
        (item._count ? Object.values(item._count)[0] : 0) ??
        0,
    ),
  }));
}

/* ---------- Componentes ---------- */

function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-stone-200 bg-white p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-900 text-white">
        <Icon size={18} />
      </span>

      <div>
        <p className="text-2xl font-semibold text-stone-900">{value}</p>
        <p className="text-sm text-stone-500">{label}</p>
      </div>
    </div>
  );
}

function Ranking({ titulo, itens, vazio = 'Sem dados no período.' }: RankingProps) {
  const maior = Math.max(...itens.map((i) => i.valor), 1);

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5 overflow-y-auto h-full max-h-[400px]">
      <h2 className="mb-4 text-base font-semibold text-stone-900">{titulo}</h2>

      {itens.length === 0 ? (
        <p className="text-sm text-stone-500">{vazio}</p>
      ) : (
        <ol className="space-y-3">
          {itens.map((item, index) => (
            <li key={index}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="text-stone-700">{item.nome}</span>
                <span className="font-medium text-stone-900">{item.valor}</span>
              </div>

              <div className="h-2 rounded-full bg-stone-100">
                <div
                  className="h-2 rounded-full bg-red-600"
                  style={{ width: `${(item.valor / maior) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

/* ---------- Página ---------- */

export default function DashboardPage() {
  
  const {vehicles} = useApp()
  const periodo = [
    {label:"Últimos 7 dias", value:7},
    {label:"Últimos 30 dias", value:30},
    {label:"Últimos 60 dias", value:760},
  ]

  const [indicadores, setIndicadores] = useState<Indicadores>(indicadoresVazio);
  const [motosMaisVistas, setMotosMaisVistas] = useState<ItemRanking[]>([]);
  const [motosMaisContatadas, setMotosMaisContatadas] = useState<ItemRanking[]>([]);
  const [termosMaisBuscados, setTermosMaisBuscados] = useState<ItemRanking[]>([]);
  const [estoquePorMarca, setEstoquePorMarca] = useState<ItemRanking[]>([]);
  const [motosSemVisualizacao, setMotosSemVisualizacao] = useState<ItemRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [periodoSelected, setPeridoSelected] = useState<PeriodoType>(periodo[0])

  const veiculosAtivos = vehicles.filter((v:Veiculos)=> v.ativo === true)


  useEffect(() => {
  const loadData = async () => {
    try {
      const fim = new Date();
      const inicio = new Date();

      inicio.setDate(
        inicio.getDate() - periodoSelected.value
      );

      const params = {
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
      };

      const [ind, vistas, contatadas, termos, estoque, semVisualizacao] =
        await Promise.all([
          api.get('analytics/indicadores', { params }),
          api.get('analytics/motos-mais-vistas', { params }),
          api.get('analytics/motos-mais-contatadas', { params }),
          api.get('analytics/termos-mais-buscados', { params }),
          api.get('analytics/estoque-por-marca', { params }),
          api.get('analytics/motos-sem-visualizacao', { params }),
        ]);

      setIndicadores({ ...indicadoresVazio, ...ind.data });
      setMotosMaisVistas(paraRanking(vistas.data));
      setMotosMaisContatadas(paraRanking(contatadas.data));
      setTermosMaisBuscados(paraRanking(termos.data));
      setEstoquePorMarca(paraRanking(estoque.data));
      setMotosSemVisualizacao(paraRanking(semVisualizacao.data));

    } catch (err: any) {
      setErro(
        err?.response?.data?.message ??
        'Não foi possível carregar o painel.'
      );
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [periodoSelected]);

  // Conversão = cliques no WhatsApp ÷ visualizações
  const conversao =
    indicadores.visualizacoes > 0
      ? ((indicadores.cliquesWhatsApp / indicadores.visualizacoes) * 100).toFixed(1)
      : '0.0';

  if (loading) {
    return <ModalLoading aberto={loading} mensagem="Carregando dados da deshboard"/>;
  }

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Deshboard</h1>
          <p className="text-sm text-stone-500">
            O que os clientes estão olhando na loja.
          </p>
        </div>

        <Select
        name="periodo" 
        value={periodoSelected.label ?? ''}
        handleChange={(e)=> setPeridoSelected(periodo.find((p)=> p.label === e.target.value)!)} 
        list={periodo.map((p)=> p.label)}
        />

      </div>

     {erro &&(
      <ModalErro
      aberto={erro === "" ? false : true} 
      mensagem="" 
      titulo=""
      onFechar={() => setErro('')}
      />
     )}

      {/* Indicadores */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Stat icon={FiEye} label="Visualizações" value={indicadores.visualizacoes} />
        <Stat icon={FaWhatsapp} label="Cliques no WhatsApp" value={indicadores.cliquesWhatsApp} />
        <Stat icon={FiPercent} label="Conversão (WhatsApp ÷ visualizações)" value={`${conversao}%`} />
        <Stat icon={FaMotorcycle} label="Veículos ativos" value={veiculosAtivos.length} />
        <Stat icon={FiMessageSquare} label="Avaliações" value={indicadores.totalAvaliacoes} />
        <Stat icon={FiStar} label="Nota média" value={Number(indicadores.mediaNotas ?? 0).toFixed(1)} />
      </div>

      {/* Rankings */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Ranking titulo="Motos mais vistas" itens={motosMaisVistas} />
        <Ranking titulo="Motos com mais cliques no WhatsApp" itens={motosMaisContatadas} />
        <Ranking titulo="Termos mais buscados" itens={termosMaisBuscados} />
        <Ranking titulo="Estoque por marca" itens={estoquePorMarca} />
        <Ranking
          titulo="Motos sem nenhuma visualização"
          itens={motosSemVisualizacao}
          vazio="Todas as motos tiveram visualização."
        />
      </div>
    </div>
  );
}