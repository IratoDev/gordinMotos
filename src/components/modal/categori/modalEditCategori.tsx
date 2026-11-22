import { useEffect, useState, type FormEvent } from 'react';
import Modal, { Campo } from '../modal';
import { ModalErro } from '../../erroComponete/ErroComponent';
import { Inpunt } from '../../Ui/input';
import { api } from '../../../service/apiClient';
import { useApp } from '../../../context/Context';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';

type Categoria = { public_id: string; descricao: string };

type Props = {
  aberto: boolean;
  onFechar: () => void;
  categoria: Categoria | null;
};

export default function ModalEditCategoria({ aberto, onFechar, categoria }: Props) {
  const { setRefresh } = useApp();
  
  const [form, setForm] = useState({
    public_id:"",
    descricao:""
  })
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");


  // Preenche o campo quando abrir com uma categoria
  useEffect(() => {
    if (aberto && categoria) {
      setForm({
        public_id: categoria.public_id ?? "",
        descricao: categoria.descricao ?? ""
      });
      setErro("");
    }
  }, [aberto, categoria]);

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

    if (!categoria) return;

    if (!form.descricao.trim()) {
      setErro("Informe uma descrição para a categoria");
      return;
    }

    setLoading(true);

    try {
      await api.patch('/categori/', form);

      setRefresh((prev: any) => !prev);
      fechar();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível editar a categoria."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal aberto={aberto} onFechar={fechar} titulo="Editar categoria">
        <Campo label="Descrição">
          <div className="w-full mb-5">
            <Inpunt
              type="text"
              name="descricao"
              value={form.descricao}
              handleChange={(e)=> handleChange('descricao', e.target.value)}
              placeholder="Ex: Street"
            />
          </div>

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
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </Campo>
      </Modal>

      <ModalErro
        aberto={erro !== ""}
        mensagem={erro}
        titulo="Erro ao editar categoria"
        onFechar={() => setErro("")}
      />

      <ModalLoading aberto={loading} mensagem="Atualizando categoria" />
    </>
  );
}