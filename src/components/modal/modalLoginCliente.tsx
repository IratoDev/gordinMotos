import { useState } from 'react';
import Modal from './modal';
import { ModalErro } from '../erroComponete/ErroComponent';
import { ModalLoading } from '../loadingComponent/LoadingComponent';
import { api } from '../../service/apiClient';
import { useApp } from '../../context/Context';
import { setSession } from '../../lib/cookie';
import { Inpunt } from '../ui/input';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

type Props = {
  aberto: boolean;
  fechar: () => void;
  irParaCadastro: () => void;
};


export default function LoginModal({ aberto, fechar, irParaCadastro }: Props) {
  const [form, setForm] = useState({
    email: '',
    senha: '',
  });

   const [loading, setLoading] = useState(false)
    const [erro, setErro] = useState("");
    const [hidePassword, setHidePassword] = useState(true)
  
    const {setLoggedIn} = useApp()
  
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  
    function limpar() {
  
      setForm({
     
      email: '',
      senha: '',
     
      });
  
      setErro("");
    }
  
    const enviar = async (e: React.FormEvent) => {
  
      setLoading(true)
      e.preventDefault();
  
      if (!form.senha) {
        setErro('As senhas não conferem.');
        return;
      }
  
      setErro('');
  
  
      try {
        const { data } = await api.post("/auth/client", form);;
        setSession(data.acessToken, data.refreshToken);
        setLoading(false)
        limpar()
        setLoggedIn(true)
        fechar();
  
      } catch (err: any) {
        const mensagem = err?.response?.data?.message;
        setErro(
          Array.isArray(mensagem)
            ? mensagem.join(", ")
            : (mensagem ?? "Não foi possível fazer login"),
        );
      }finally{
        setLoading(false)
      }
  
    };

    console.log("botão de esconder senha",hidePassword)

  return (
    <>
    <Modal  modalSize ="max-w-2xl" aberto={aberto} fechar={fechar} titulo="Entrar">
      <form onSubmit={enviar} className="flex flex-col gap-4">

        <Inpunt
        type="email" 
        name="email"
        value={ form?.email ?? ""} 
        handleChange={handleChange} 
        placeholder="E-mail"
        
        />

        <div className='flex gap-4'>

          <Inpunt
          type={hidePassword ? "password" : "text"} 
          name="senha"
          value={ form?.senha ?? ""} 
          handleChange={handleChange} 
          placeholder="Senha"
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

        <button
          type="submit"
          className="rounded-md bg-vermelho-600 py-2 font-bold hover:bg-vermelho-700 transition"
        >
          Entrar
        </button>

        <p className="text-center text-sm text-branco/70">
          Não tem conta?{' '}
          <button type="button" onClick={irParaCadastro} className="font-bold text-vermelho-600">
            Cadastre-se
          </button>
        </p>
      </form>
    </Modal>

     <ModalErro 
      aberto={erro === "" ? false : true}
      mensagem={erro} 
      titulo="Erro ao realizar o login"
      onFechar={() => setErro('')}
      />;
  
      <ModalLoading aberto={loading} mensagem="logando...."/>
    </>
  );
}