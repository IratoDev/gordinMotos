import { FiCheck, FiStar, FiTrash2 } from 'react-icons/fi';
import { useApp } from '../../../context/Context';
import type { Assessment } from '../../../context/dataTypes';
import { api } from '../../../service/apiClient';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';
import { ModalErro } from '../../erroComponete/ErroComponent';
import { useState } from 'react';

type Filtro = 'pendentes' | 'aprovadas' | 'todas';

export default function AvaliacoesPage() {
  const { assessment, setRefresh } = useApp();

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagemLoading, setMensagemLoading] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('pendentes');

  const pendentes = assessment.filter((a: Assessment) => !a.aprovada);
  const aprovadas = assessment.filter((a: Assessment) => a.aprovada === true);

  console.log("avaliação", pendentes, aprovadas, assessment)

  const listaFiltrada =
    filtro === 'pendentes' ? pendentes : filtro === 'aprovadas' ? aprovadas : assessment;

  const pegarErro = (error: any, padrao: string) => {
    const mensagem = error?.response?.data?.message;
    setErro(Array.isArray(mensagem) ? mensagem.join(', ') : (mensagem ?? padrao));
  };

  const removeAssessment = async (assessmentId: string) => {
    setMensagemLoading('Deletando avaliação');
    setLoading(true);
    try {
      await api.delete(`assessment/${assessmentId}`);
      setRefresh((prev: boolean) => !prev);
    } catch (error) {
      pegarErro(error, 'Não foi possível deletar a avaliação.');
    } finally {
      setLoading(false);
    }
  };

  const aprovedAssessment = async (assessmentId: string) => {
    setMensagemLoading('Aprovando avaliação');
    setLoading(true);
    try {
      await api.patch('assessment/', { public_id: assessmentId, aprovada:true });
      setRefresh((prev: boolean) => !prev);
    } catch (error) {
      pegarErro(error, 'Não foi possível aprovar a avaliação.');
    } finally {
      setLoading(false);
    }
  };

  const classeFiltro = (ativo: boolean) =>
    ativo
      ? 'rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white'
      : 'rounded px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100';

  return (
    <>
      <div className="w-full space-y-6">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Avaliações</h1>
          <p className="text-sm text-stone-500">
            Aprove o que pode aparecer no site ou remova o que não deve.
          </p>
        </div>

        {/* Filtros */}
        <div className="inline-flex rounded-md border border-stone-300 bg-white p-1">
          <button
            onClick={() => setFiltro('pendentes')}
            className={classeFiltro(filtro === 'pendentes')}
          >
            Pendentes ({pendentes.length})
          </button>

          <button
            onClick={() => setFiltro('aprovadas')}
            className={classeFiltro(filtro === 'aprovadas')}
          >
            Aprovadas ({aprovadas.length})
          </button>

          <button
            onClick={() => setFiltro('todas')}
            className={classeFiltro(filtro === 'todas')}
          >
            Todas ({assessment.length})
          </button>
        </div>

        {/* Lista de avaliações */}
        <ul className="space-y-3">
          {listaFiltrada.length === 0 && (
            <li className="rounded-lg border border-dashed border-stone-300 bg-white p-6 text-center text-sm text-stone-500">
              Nenhuma avaliação encontrada.
            </li>
          )}

          {listaFiltrada.map((item: Assessment) => (
            <li
              key={item.public_id}
              className="rounded-lg border border-stone-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  {/* Autor, nota e status */}
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-medium text-stone-900">
                      {item.cliente.nome}
                    </span>

                    <span className="inline-flex text-amber-400">
                      {Array.from({ length: 5 }, (_, i) => (
                        <FiStar
                          key={i}
                          className={
                            i < item.nota
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }
                        />
                      ))}
                    </span>

                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.aprovada
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.aprovada ? 'Aprovada' : 'Pendente'}
                    </span>
                  </p>

                  {/* Veículo e data */}
                  <p className="mt-0.5 text-xs text-stone-500">
                    {`${item.veiculo.nome} | ${item.veiculo.modelo.marca.descricao} | ${item.veiculo.modelo.descricao}`}{' '}
                    · {new Date(item.criado_em).toLocaleDateString('pt-BR')}
                  </p>

                  {/* Comentário */}
                  <p className="mt-2 max-w-prose text-sm text-stone-700">
                    {item.texto}
                  </p>
                </div>

                {/* Ações */}
                <div className="flex gap-2">
                  {!item.aprovada && (
                    <button
                      onClick={() => aprovedAssessment(item.public_id)}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                      <FiCheck />
                      Aprovar
                    </button>
                  )}

                  <button
                    onClick={() => removeAssessment(item.public_id)}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <FiTrash2 />
                    Remover
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ModalErro
        aberto={erro !== ''}
        mensagem={erro}
        titulo="Erro avaliação"
        onFechar={() => setErro('')}
      />

      <ModalLoading aberto={loading} mensagem={mensagemLoading} />
    </>
  );
}