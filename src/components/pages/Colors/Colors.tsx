import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useApp } from "../../../context/Context";
import type { Cores } from "../../../context/dataTypes";
import { api } from "../../../service/apiClient";
import { ModalErro } from "../../erroComponete/ErroComponent";
import { ModalLoading } from "../../loadingComponent/LoadingComponent";
import ModalCor from "../../modal/color/modalRegisterCor";

import ModalEditCor from "../../modal/color/modelEditCor";

export default function ColorsPage() {
  const [registerModal, setRegisterModal] = useState(false);
  const [editModal, setEditModal] = useState(false);


  const [search, setSearch] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const { colors, setRefresh } = useApp();
  const [corSelected, setCoresSelected] = useState<Cores | null>(null);

  const cores = Array.isArray(colors) ? colors : [];

  const filteredCores = cores.filter((item: Cores) => {
    const term = search.toLowerCase();
    return (
      item.descricao?.toLowerCase().includes(term) ||
      item.hexadecimal?.toLowerCase().includes(term)
    );
  });

  const deleteCor = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/color/${id}`);
      setRefresh((prev: any) => !prev);
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível deletar a cor.")
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
            <h1 className="text-2xl font-bold text-stone-900">Cores</h1>
            <p className="text-sm text-stone-500">
              Quantidade de cores cadastradas: {cores.length}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRegisterModal(true)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
          >
            <FiPlus />
            Nova cor
          </button>
        </div>

        {/* Pesquisa */}
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou código"
            className="w-full rounded-lg border border-stone-200 py-2 pl-9 pr-3 outline-none focus:border-red-500"
          />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Cor</th>
                <th className="px-4 py-3 font-medium">Hexadecimal</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {filteredCores.length > 0 ? (
                filteredCores.map((item: any) => (
                  <tr key={item.public_id} className="hover:bg-stone-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="h-5 w-5 rounded-full border border-stone-300"
                          style={{ backgroundColor: item.hexadecimal }}
                        />
                        <span className="font-medium text-stone-900">
                          {item.descricao}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-stone-700">{item.hexadecimal}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          aria-label="Editar veículo"
                          onClick={() => {setCoresSelected(item); setEditModal(true)}}
                          className="rounded p-2 text-stone-500 hover:bg-stone-100"
                        >
                          <FiEdit2 />
                        </button>

                        <button
                          type="button"
                          aria-label="Excluir cor"
                          onClick={() => deleteCor(item.public_id)}
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
                  <td colSpan={3} className="px-4 py-10 text-center text-stone-500">
                    {search
                      ? "Nenhuma cor encontrada para essa pesquisa."
                      : "Nenhuma cor cadastrada."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modais */}
      <ModalCor aberto={registerModal} onFechar={() => setRegisterModal(false)} />

      <ModalErro
        aberto={erro !== ""}
        mensagem={erro}
        titulo="Erro cor"
        onFechar={() => setErro("")}
      />

      <ModalEditCor
        aberto={editModal}
        cor={corSelected}
        onFechar={() => setEditModal(false)}
      />

      <ModalLoading aberto={loading} mensagem="Deletando cor" />
    </>
  );
}