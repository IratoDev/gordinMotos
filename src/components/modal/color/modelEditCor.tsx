import { useEffect, useState, type FormEvent } from 'react';
import Modal, { Campo } from '../modal';
import { ModalErro } from '../../erroComponete/ErroComponent';
import { Inpunt } from '../../Ui/input';
import { api } from '../../../service/apiClient';
import { useApp } from '../../../context/Context';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';
import type { Cores } from '../../../context/dataTypes';

type cor = { public_id: string; descricao: string, hexadecimal: string };

type Props = {
  aberto: boolean;
  onFechar: () => void;
  cor: Cores | null;
};

export default function ModalEditCor({ aberto, onFechar, cor }: Props) {
  const { setRefresh } = useApp();
  
  const [form, setForm] = useState<cor>({
    public_id:"",
    descricao:"",
    hexadecimal: ""
  })

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");


  // Preenche o campo quando abrir com uma categoria
  useEffect(() => {
    if (aberto && cor) {
      setForm({
        public_id: cor.public_id ?? "",
        descricao: cor.descricao ?? "",
        hexadecimal: cor.hexadecimal ?? ""
      });
      setErro("");
    }
  }, [aberto, cor]);

  function fechar() {
    setErro("");
    onFechar();
  }

  function handleChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (!cor) return;

    if (!form.descricao.trim()) {
      setErro("Informe uma descrição para a cor");
      return;
    }

    if (!form.hexadecimal.trim()) {
      setErro("Informe um codigo hexadecimal para a cor");
      return;
    }

    setLoading(true);

    try {
      await api.patch('/color/', form);

      setRefresh((prev: any) => !prev);
      fechar();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível editar a cor."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal aberto={aberto} onFechar={fechar} titulo="Editar categoria">
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

      <ModalErro
        aberto={erro !== ""}
        mensagem={erro}
        titulo="Erro ao editar cor"
        onFechar={() => setErro("")}
      />

      <ModalLoading aberto={loading} mensagem="Atualizando cor" />
    </>
  );
}