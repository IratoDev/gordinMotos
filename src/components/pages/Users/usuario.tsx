import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useApp } from '../../../context/Context';
import type { Usuarios } from '../../../context/dataTypes';
import { ModalErro } from '../../erroComponete/ErroComponent';
import { ModalLoading } from '../../loadingComponent/LoadingComponent';
import ModalRegisterUsuario from '../../modal/user/modalRegisterUser';
import { useState } from 'react';
import ModalEditUsuario from '../../modal/user/modalEditUser';
import { api } from '../../../service/apiClient';

export default function UsuariosPage() {

  const { users, setRefresh} = useApp()

  const [registerModal, setRegisterModal] = useState(false);  
  const [editModal, setEditModal] = useState(false);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false)

  const [userSelected, setUserSelected] = useState<Usuarios | null>(null)

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/user/${id}`);
      setRefresh((prev: any) => !prev);
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível deletar usuario")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="w-full space-y-6">

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Usuários
          </h1>

          <p className="text-sm text-stone-500">
            Quem pode entrar no painel.
          </p>
        </div>

        <button
        onClick={()=>setRegisterModal(true)} 
        className="
        flex items-center gap-2 rounded-lg bg-red-600 
        px-4 py-2 text-sm font-medium text-white"
        >
          <FiPlus />
          Novo usuário
        </button>

      </div>

      {/* Tabela */}
      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">

        <table className="w-full text-left text-sm">

          <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Criado em</th>
              <th className="px-4 py-3 font-medium">Última alteração</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">

            {/* Usuário */}

            {users.length > 0 ? (

              users.map((user:Usuarios)=>(

              <tr key={user.public_id} className="hover:bg-stone-50">

              <td className="px-4 py-3 font-medium text-stone-900">
                {user.nome}
              </td>

              <td className="px-4 py-3 text-stone-700">
                {user.criado_em
                ? new Date(user.criado_em).toLocaleString('pt-BR')
                : '-'}
              </td>

              <td className="px-4 py-3 text-stone-700">
                {user.modificado_em
                ? new Date(user.modificado_em).toLocaleString('pt-BR')
                : '-'}
              </td>

              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">

                  <button 
                  onClick={()=> {setEditModal(true); setUserSelected(user)}}
                  className="rounded p-2 text-stone-500 hover:bg-stone-100">
                    <FiEdit2 />
                  </button>

                  <button
                  onClick={() => deleteUser(user.public_id)} 
                  className="rounded p-2 text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 />
                  </button>

                </div>
              </td>

                </tr>
              ))

            ) : (

              <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-stone-500"
                  >
                    Nenhum veículo cadastrado.
                  </td>
                </tr>

            )
            
            }


          </tbody>

        </table>
      </div>

    </div>

    <ModalRegisterUsuario
    aberto={registerModal}
    onFechar={()=>setRegisterModal(false)}
    />

    <ModalEditUsuario
    aberto={editModal}
    onFechar={()=> setEditModal(false)} 
    usuario={userSelected}
    />
    
    <ModalErro 
    aberto={erro !== '' ? true : false}
    mensagem={erro} 
    titulo="Erro usuario"
    onFechar={()=> setErro('')} 
    />
    
    <ModalLoading 
    aberto = {loading} 
    mensagem = "Deletando usuario"
    />
    </>
  );
}