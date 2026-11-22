import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useApp } from "../../../context/Context";
import { api } from "../../../service/apiClient";
import { ModalErro } from "../../erroComponete/ErroComponent";
import { ModalLoading } from "../../loadingComponent/LoadingComponent";

import ModalRegisterCategoria from "../../modal/categori/modalRegisterCategoria";
import ModalEditCategoria from "../../modal/categori/modalEditCategori";
import type { Categorias } from "../../../context/dataTypes";

export default function CategorisPage() {
  const [registerModal, setRegisterModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [search, setSearch] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const { categoris, setRefresh } = useApp();
  const [categoriSelected, setCategoriSelected] = useState<Categorias | null>(null);

  const categorias = Array.isArray(categoris) ? categoris : [];

  const filteredCategorias = categorias.filter((item: any) =>
    item.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const deleteCategoria = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/categori/${id}`);
      setRefresh((prev: any) => !prev);
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível deletar a categoria.")
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
            <h1 className="text-2xl font-bold text-stone-900">Categorias</h1>
            <p className="text-sm text-stone-500">
              Quantidade de categorias cadastradas: {categorias.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRegisterModal(true)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            <FiPlus />
            Nova categoria
          </button>
        </div>

        {/* Pesquisa */}
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome"
            className="w-full rounded-lg border border-stone-200 py-2 pl-9 pr-3 outline-none focus:border-red-500"
          />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Categoria</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredCategorias.length > 0 ? (
                filteredCategorias.map((item: any) => (
                  <tr key={item.public_id} className="hover:bg-stone-50 transition">
                    <td className="px-4 py-3 font-medium text-stone-900">
                      {item.descricao}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          aria-label="Editar veículo"
                          onClick={() => {setCategoriSelected(item); setEditModal(true)}}
                          className="rounded p-2 text-stone-500 hover:bg-stone-100"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          aria-label="Excluir categoria"
                          onClick={() => deleteCategoria(item.public_id)}
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
                  <td colSpan={2} className="px-4 py-10 text-center text-stone-500">
                    {search
                      ? "Nenhuma categoria encontrada para essa pesquisa."
                      : "Nenhuma categoria cadastrada."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modais */}
      <ModalRegisterCategoria
        aberto={registerModal}
        onFechar={() => setRegisterModal(false)}
      />

      <ModalEditCategoria
        aberto={editModal}
        categoria={categoriSelected}
        onFechar={() => setEditModal(false)}
      />

      <ModalErro
        aberto={erro !== ""}
        mensagem={erro}
        titulo="Erro categoria"
        onFechar={() => setErro("")}
      />

      <ModalLoading aberto={loading} mensagem="Deletando categoria" />
    </>
  );
}