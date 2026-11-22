import { useState } from 'react';
import type { Marcas, Veiculos } from '../../../context/dataTypes';
import { Select } from '../../Ui/select';
import Modal, { Campo } from '../modal';
import { ModalErro } from '../../erroComponete/ErroComponent';
import { Inpunt } from '../../Ui/input';
import { api } from '../../../service/apiClient';
import { useApp } from '../../../context/Context';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';

type Props = {
  aberto: boolean;
  veiculo?: Veiculos[] | null; // lista de produtos
  marca?: Marcas;              // marca direta
  onFechar: () => void;
};

const FORM_INICIAL = {
  descricao: '',
  ano_mod: '',
};

export default function ModalModelo({ aberto, veiculo, marca, onFechar }: Props) {
  const { setRefresh } = useApp();

  const [veiculoSelected, setVeiculoSelected] = useState<Veiculos | null>(null);
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  // funciona pros dois casos: marca direta ou marca dentro do veículo
  const marcaPublicId = marca?.public_id ?? veiculoSelected?.marca?.public_id;

  const veiculosUnicos = veiculo
  ? veiculo.filter(
      (v, i, arr) => v && arr.findIndex((x) => x?.nome === v.nome) === i,
    )
  : [];

  function handleChange(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function limpar() {
    setForm(FORM_INICIAL);
    setVeiculoSelected(null);
    setErro('');
  }

  function fechar() {
    limpar();
    onFechar();
  }

  async function enviar() {
    setErro('');

    if (!marcaPublicId) {
      setErro('Selecione um veículo');
      return;
    }
    if (!form.descricao.trim()) {
      setErro('Informe a descrição do modelo');
      return;
    }
    if (!form.ano_mod) {
      setErro('Informe o ano do modelo');
      return;
    }

    setLoading(true);
    try {
      await api.post('/model', {
        descricao: form.descricao,
        ano_mod: Number(form.ano_mod),
        marca_public_id: marcaPublicId,
      });

      setRefresh((prev: boolean) => !prev);
      fechar();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(', ')
          : (mensagem ?? 'Não foi possível cadastrar o modelo.'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal aberto={aberto} onFechar={fechar} titulo="Cadastrar modelo">
        {/* Select só aparece quando veio a lista de veículos */}
        {veiculo && (
          <Campo label="Veiculo">
            <Select
              name="veiculo"
              value={veiculoSelected?.nome ?? ''}
              handleChange={(e) =>
                setVeiculoSelected(
                  veiculosUnicos.find((v) => v?.nome === e.target.value) ?? null,
                )
              }
              list={veiculosUnicos.filter(Boolean).map((v) => v.nome)}
            />
          </Campo>
        )}

        <Campo label="Descrição">
          <Inpunt
            type="text"
            name="descricao"
            value={form.descricao}
            handleChange={(e) => handleChange('descricao', e.target.value)}
            placeholder="Ex: CB 500F"
          />
        </Campo>

        <Campo label="Ano do modelo">
          <Inpunt
            type="number"
            name="ano_mod"
            value={form.ano_mod}
            handleChange={(e) => handleChange('ano_mod', e.target.value)}
            placeholder="2023"
          />
        </Campo>

        {erro && (
          <ModalErro
            aberto={true}
            mensagem={erro}
            titulo="Erro ao cadastrar modelo"
            onFechar={() => setErro('')}
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={fechar}
            className="rounded-md border border-stone-300 px-4 py-2.5 text-sm text-stone-900 hover:bg-stone-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={enviar}
            disabled={loading}
            className="rounded-md bg-vermelho-600 px-4 py-2.5 text-sm font-medium text-branco hover:opacity-90 disabled:opacity-60"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar modelo'}
          </button>
        </div>
      </Modal>

      <ModalLoading aberto={loading} mensagem="Cadastrando Modelo" />
    </>
  );
}