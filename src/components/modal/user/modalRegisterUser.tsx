import { useState } from 'react';
import { useApp } from '../../../context/Context';
import Modal, { Campo, Check } from '../modal';
import { api } from '../../../service/apiClient';
import { Inpunt } from '../../Ui/input';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';
import { ModalErro } from '../../erroComponete/ErroComponent';

type Props = { aberto: boolean; onFechar: () => void };

const FORM_INICIAL = {
  nome:"",
  email:"",
  senha:"",
  ativo:"",
};

export default function ModalRegisterUsuario({ aberto, onFechar }: Props) {

  const [form, setForm] = useState(FORM_INICIAL);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const { setRefresh } = useApp();
  
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
  
     
      if (!form.nome.trim()) {
        setErro('Informe seu nome');
        return;
      }
      if (!form.email) {
        setErro('Informe um email');
        return;
      }

       if (!form.senha) {
        setErro('Informe uma senha');
        return;
      }
  
      setLoading(true);
  
      try {
        await api.post('/user/signup', {
          nome:form.nome,
          email: form.email,
          senha: form.senha,
          ativo: form.ativo
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
    <Modal aberto={aberto} onFechar={onFechar} titulo="Cadastrar usuário">
      <Campo label="Nome">
        <Inpunt
        type="text"
        name="nome"
        value={form.nome} 
        handleChange={(e)=> handleChange('nome',  e.target.value)} 
        placeholder="Nome completo"
        />
        
      </Campo>

      <Campo label="E-mail">
        <Inpunt
        type="email"
        name="email"
        value={form.email} 
        handleChange={(e)=> handleChange('email',  e.target.value)} 
        placeholder="email@exemplo.com"
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

      <Campo label="Senha">
        <Inpunt
        type="password"
        name="password"
        value={form.senha} 
        handleChange={(e)=> handleChange('senha',  e.target.value)} 
        placeholder="••••••••"
        />
        
      </Campo>

      <Check label="Ativo" />

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
          {loading ? 'Cadastrando...' : 'Cadastrar modelo'}
        </button>
      </div>
    </Modal>

    <ModalLoading
    aberto={loading} 
    mensagem={"Cadastrando Usuario"}
    />
    </>
  );
}
