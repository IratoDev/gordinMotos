import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import Modal from '../modal';
import { useApp } from '../../../context/Context';
import type { Modelos, Veiculos } from '../../../context/dataTypes';
import { ModalErro } from '../../erroComponete/ErroComponent';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';
import { api } from '../../../service/apiClient';
import { Select } from '../../Ui/select';

type Props = {
  aberto: boolean;
  onFechar: () => void;
};

export default function ModalDeleteModelo({ aberto, onFechar }: Props) {
  const { vehicles, brands,setRefresh } = useApp();

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [veiculoSelecionado, setVeiculoSelected] = useState<Veiculos | null>(null);

  // vehicles deve ser uma lista de veículos


  // modelos do veículo selecionado
  const modelos = brands.find((m:Modelos)=> m.descricao === veiculoSelecionado?.marca?.descricao )?.modelos ?? [];

  const deletarModelo = async (id: string) => {
    setLoading(true);
    setErro('');
    try {
      await api.delete(`/model/${id}`);
      setRefresh((prev: boolean) => !prev);
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(', ')
          : (mensagem ?? 'Não foi possível deletar o modelo.')
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
    <Modal aberto={aberto} titulo="Modelos" onFechar={onFechar}>
      <div className="space-y-4">
        {/* Seleção do veículo */}
        <Select 
        name='veiculos' 
        value={veiculoSelecionado?.nome ?? ''} 
        handleChange={(e)=> setVeiculoSelected(vehicles.find((v:Veiculos)=> v.nome === e.target.value) ?? null)} 
        list={vehicles.map((v:Veiculos) =>  v.nome )}
        />


        {/* Modelos do veículo selecionado */}
        <table className="w-full text-left text-sm">
          <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Modelos:</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {modelos.length > 0 ? (
              modelos.map((model:Modelos) => (
                <tr key={model.public_id} className="hover:bg-stone-50 transition">
                  <td className="px-4 py-3 font-medium text-stone-900">
                    {model.descricao}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">


                      <button
                        type="button"
                        aria-label="Excluir modelo"
                        disabled={loading}
                        onClick={() => deletarModelo(model.public_id)}
                        className="rounded p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <FiTrash2 />
                      </button>
                    
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="px-4 py-10 text-center text-stone-500">
                  {veiculoSelecionado
                    ? 'Nenhum modelo cadastrado para este veículo.'
                    : 'Selecione um veículo para ver os modelos.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Modal>

    <ModalErro
    aberto={erro === "" ? false : true} 
    mensagem={erro} 
    titulo="Erro modelo"
    onFechar={()=> setErro("")}
    />

    <ModalLoading
     aberto={loading}
     mensagem="Deletando modelo"
    />
    </>
  );
}