import { useEffect, useState } from 'react';
import { useApp } from '../../../context/Context';
import Modal, { Campo } from '../modal';
import { api } from '../../../service/apiClient';
import { Inpunt } from '../../Ui/input';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';
import { ModalErro } from '../../erroComponete/ErroComponent';

export type Usuario = {
  public_id: string;
  nome: string;
  email: string;
  ativo: boolean;
};

type Props = {
  aberto: boolean;
  onFechar: () => void;
  usuario: Usuario | null; // usuário que será editado
};

const FORM_INICIAL = {
    public_id:'',
    nome: '',
    email: '',
    senha: '',
    ativo: true,
};

export default function ModalEditUsuario({ aberto, onFechar, usuario }: Props) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const { setRefresh } = useApp();

  // Preenche o formulário sempre que abrir com um usuário
  useEffect(() => {
    if (aberto && usuario) {
      setForm({
        public_id: usuario.public_id,
        nome: usuario.nome,
        email: usuario.email,
        senha: '',
        ativo: usuario.ativo,
      });
      setErro('');
    }
  }, [aberto, usuario]);

  function handleChange(name: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function fechar() {
    setErro('');
    onFechar();
  }

  async function enviar() {
    if (!usuario) return;
    setErro('');

    if (!form.nome.trim()) {
      setErro('Informe o nome');
      return;
    }
    if (!form.email.trim()) {
      setErro('Informe um email');
      return;
    }

    setLoading(true);

    try {
      // Só manda a senha se o usuário digitou uma nova
      const dados: Record<string, unknown> = {
        public_id: form.public_id,
        nome: form.nome,
        email: form.email,
        ativo: form.ativo,
      };
      if (form.senha) dados.senha = form.senha;

      await api.patch(`/user/`, dados);

      setRefresh((prev: boolean) => !prev);
      fechar();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(', ')
          : (mensagem ?? 'Não foi possível atualizar o usuário.'),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal aberto={aberto} onFechar={fechar} titulo="Editar usuário">
        <Campo label="Nome">
          <Inpunt
            type="text"
            name="nome"
            value={form.nome}
            handleChange={(e) => handleChange('nome', e.target.value)}
            placeholder="Nome completo"
          />
        </Campo>

        <Campo label="E-mail">
          <Inpunt
            type="email"
            name="email"
            value={form.email}
            handleChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@exemplo.com"
          />
        </Campo>

        <Campo label="Nova senha (opcional)">
          <Inpunt
            type="password"
            name="password"
            value={form.senha}
            handleChange={(e) => handleChange('senha', e.target.value)}
            placeholder="Deixe vazio para manter a atual"
          />
        </Campo>

        <label className="flex items-center gap-2 text-sm text-stone-900">
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(e) => handleChange('ativo', e.target.checked)}
          />
          Ativo
        </label>

        {erro && (
          <ModalErro
            aberto={true}
            mensagem={erro}
            titulo="Erro ao atualizar usuário"
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
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </button>
        </div>
      </Modal>

      <ModalLoading aberto={loading} mensagem="Atualizando usuário" />
    </>
  );
}