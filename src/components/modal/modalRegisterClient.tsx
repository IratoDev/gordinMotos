import { useState } from 'react';
import Modal from './modal';
import { api } from '../../service/apiClient';
import { ModalErro } from '../erroComponete/ErroComponent';
import { ModalLoading } from '../loadingComponent/LoadingComponent';
import { Inpunt } from '../ui/input';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

type Props = {
  aberto: boolean;
  fechar: () => void;
  irParaLogin: () => void;
};


export default function CadastroModal({ aberto, fechar, irParaLogin }: Props) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    data_nascimento:'',
  });
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("");
  const [hidePassword, setHidePassword] = useState(true)
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  function limpar() {

    setForm({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmarSenha: '',
    data_nascimento:'',
    });

    setErro("");
  }

  const enviar = async (e: React.FormEvent) => {

    setLoading(true)
    e.preventDefault();

    if (form.senha !== form.confirmarSenha) {
      setErro('As senhas não conferem.');
      return;
    }

    setErro('');


    try {
      await api.post("/client/signup", form); 
      
      setLoading(false)
      limpar()

      fechar();

    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível cadastrar usuario."),
      );
    }finally{
      setLoading(false)
    }

  };

  return (
    <>
    <Modal modalSize ="max-w-2xl" aberto={aberto} fechar={fechar} titulo="Criar conta">
      <form onSubmit={enviar} className="flex flex-col gap-4">
        
        <Inpunt
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          handleChange={handleChange}
        />
      
        <Inpunt
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          handleChange={handleChange}
        />
      
        <Inpunt
          type="tel"
          name="telefone"
          placeholder="Telefone (WhatsApp)"
          value={form.telefone}
          handleChange={handleChange}
        />
      
        <Inpunt
          type="date"
          name="data_nascimento"
          placeholder="Data de nascimento"
          value={form.data_nascimento}
          handleChange={handleChange}
        />

        <div className='flex gap-2 w-full '>
        <Inpunt
          type={hidePassword ? "password" : "text"}
          name="senha"
          placeholder="Senha"
          value={form.senha}
          handleChange={handleChange}
        />

        <button
        type='button'
        className='text-white p-4 border rounded-xl' 
        onClick={()=> setHidePassword((prev)=> !prev)}>
          {hidePassword ? (
            <FaRegEyeSlash />
          ):(
            <FaRegEye />
          )}
        </button>

        </div>
      
        <div className='flex gap-2 w-full '>
        <Inpunt
          type={hideConfirmPassword? "password" : "text"}
          name="confirmarSenha"
          placeholder="Confirmar senha"
          value={form.confirmarSenha}
          handleChange={handleChange}
        />

        <button
        type='button'
        className='text-white p-4 border rounded-xl' 
        onClick={()=> setHideConfirmPassword((prev)=> !prev)}>
          {hideConfirmPassword ? (
            <FaRegEyeSlash />
          ):(
            <FaRegEye />
          )}
        </button>
        </div>
      
        <button
          type="submit"
          className="rounded-md bg-vermelho-600 py-2 font-bold hover:bg-vermelho-700 transition"
        >
          Cadastrar
        </button>
        
        <p className="text-center text-sm text-branco/70">
          Já tem conta?{' '}
          <button
            type="button"
            onClick={irParaLogin}
            className="font-bold text-vermelho-600"
          >
            Entrar
          </button>
        </p>
      </form>
    </Modal>

    <ModalErro 
    aberto={erro === "" ? false : true}
    mensagem={erro} 
    titulo="Erro ao cadastrar usuario"
    onFechar={() => setErro('')}
    />;

    <ModalLoading aberto={loading} mensagem="Cadastrando usuario"/>
    </>
  );
}