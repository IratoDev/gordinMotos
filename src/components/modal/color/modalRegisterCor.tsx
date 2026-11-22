import { useState } from 'react';
import { useApp } from '../../../context/Context';
import { ModalErro } from '../../erroComponete/ErroComponent';
import Modal, { Campo } from '../modal';
import { api } from '../../../service/apiClient';
import { Inpunt } from '../../Ui/input';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';

type Props = { aberto: boolean; onFechar: () => void };

const FORM_INICIAL = {
  descricao: '',
  hexadecimal: '#dc2626',
};

export default function ModalCor({ aberto, onFechar }: Props) {
  const { setRefresh } = useApp();

  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  function handleChange(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function limpar() {
    setForm(FORM_INICIAL);
    setErro('');
  }

  function fechar() {
    limpar();
    onFechar();
  }

  async function enviar() {
    setErro('');

    if (!form.descricao.trim()) {
      setErro('Informe uma descrição para a cor');
      return;
    }

    setLoading(true);

    try {
      await api.post('/color', form);

      setRefresh((prev: boolean) => !prev);
      fechar();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(', ')
          : (mensagem ?? 'Não foi possível cadastrar a cor.'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
    <Modal aberto={aberto} onFechar={fechar} titulo="Cadastrar cor">
      <Campo label="Descrição">
        <Inpunt
          type="text"
          name="descricao"
          value={form.descricao}
          handleChange={(e) => handleChange('descricao', e.target.value)}
          placeholder="Ex: Vermelho"
        />
      </Campo>

      <Campo label="Cor">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={form.hexadecimal}
            onChange={(e) => handleChange('hexadecimal', e.target.value)}
            className="h-10 w-14 cursor-pointer rounded-md border border-stone-300 bg-white p-1"
          />

          <Inpunt
            type="text"
            name="hexadecimal"
            value={form.hexadecimal}
            handleChange={(e) => handleChange('hexadecimal', e.target.value)}
            placeholder="#DC2626"
          />
        </div>
      </Campo>

      {erro && (
        <ModalErro
          aberto={true}
          mensagem={erro}
          titulo="Erro ao cadastrar cor"
          onFechar={() => setErro('')}
        />
      )}

      {/* Ações */}
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
          {loading ? 'Cadastrando...' : 'Cadastrar cor'}
        </button>
      </div>
    </Modal>
    <ModalLoading aberto={loading} mensagem="Cadastrando Cor" />
    </>
  );
}