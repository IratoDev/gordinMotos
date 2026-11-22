import { useState, type FormEvent } from 'react';
import Modal, { Campo } from '../modal';
import { ModalErro } from '../../erroComponete/ErroComponent';
import { Inpunt } from '../../Ui/input';
import { api } from '../../../service/apiClient';
import { useApp } from '../../../context/Context';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';

type Props = { aberto: boolean; onFechar: () => void };

const FORM_INICIAL: Record<string, string> = {
  descricao: "",
};

export default function ModalRegisterCategoria({ aberto, onFechar }: Props) {

  const {setRefresh} = useApp()

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("");
  const [form, setForm] = useState<Record<string, string>>(FORM_INICIAL);
  
  function handleChange(name: string, value: string) {
  setForm((prev) => ({
    ...prev,
    [name]: value,
  }));
  }

  function limpar() {
      
        setForm(FORM_INICIAL);
       
        setErro("");
  }
    
  function fechar() {
        limpar();
        onFechar();
  }
    
  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (!form.descricao.trim()) {
      setErro("Informe uma descrição para a categoria");
      return;
    }

    setLoading(true)

    try {

      await api.post("/categori", form);

      setLoading(false)
      setRefresh((prev:any)=> !prev)
      fechar();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível cadastrar o categoria."),
      );
    } finally {
      setLoading(false)
      
    }
  }

  return (
    <>
    <Modal aberto={aberto} onFechar={onFechar} titulo="Cadastrar categoria">
      <Campo label="Descrição">

        <div className='w-full mb-5'>
          <Inpunt 
          type={"text"}
          name="categoria descricao"
          value={form.descricao}
          handleChange={(e) => handleChange('descricao', e.target.value)}
          placeholder="Ex: Street"
          />
        </div>

        {erro && (
          <ModalErro  
          aberto={erro !== "" ? true : false} 
          mensagem={erro} 
          titulo={"Erro ao cadastrar categoria"}
           onFechar={()=> setErro('')} />
                   
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
              {loading ? "Cadastrando..." : "Cadastrando Categoria"}
            </button>
        </div>
      </Campo>
    </Modal>

    <ModalLoading 
    aberto={loading} 
    mensagem={"Cadastrando Categoria"}
    />


    </>
  );
}
