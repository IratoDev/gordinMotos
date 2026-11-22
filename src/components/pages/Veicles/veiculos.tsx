
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import {  useState } from "react";
import { ModalRegisterVehicle } from "../../modal/vehicles/ModalRegisterVehicles";
import { useApp } from "../../../context/Context";
import type { Cores, Veiculos } from "../../../context/dataTypes";
import { api } from "../../../service/apiClient";
import { ModalErro } from "../../erroComponete/ErroComponent";
import { ModalLoading } from "../../loadingComponent/LoadingComponent";
import { ModalUpdateVehicle } from "../../modal/vehicles/ModalEditVehicles";

import ModalModelo from "../../modal/model/modalRegisterModelo";
import ModalDeleteModelo from "../../modal/model/modalDeleteModelo";


export default function VeiculosPage() {
  const [registerModal, setRegisterModal] = useState<"vehicle" | "model" | "delete-model" | "" | string>("");;
  const [search, setSearch] = useState("");

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false)

  const { vehicles, setRefresh, } = useApp();

  const [vehicleSelected, setVehicleSelected] = useState<Veiculos | null>(null)
  const [modalEdit, setModalEdit] = useState(false)


  // Garante que sempre trabalharemos com um array
  const vehicle = Array.isArray(vehicles) ? vehicles : [];

  // Pesquisa por nome ou placa
  const filteredVehicles = vehicle.filter((item) => {
    const term = search.toLowerCase();

    return (
      item.nome?.toLowerCase().includes(term) ||
      item.placa?.toLowerCase().includes(term)
    );
  });

  const listBtn = [
    {id:1, label: "Novo veículo",set: "vehicle"},
    {id:3, label: "Novo modelo",set: "model"},
    {id:1, label: "Excluir modelos",set: "delete-model"},
  ]

  const deleteVehicle = async (id: string)=>{

    setLoading(true)

    try {
      
      await api.delete(`/vehicles/${id}`,);

      setLoading(false)
      setRefresh((prev:any)=> !prev)
      
    } catch (err:any) {

      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível deletar o veículo."),
      );
    } finally{

      setLoading(false)

    }

  }

  console.log("lista de veiculos", vehicle)

  
  return (
    <>
      <div className="w-full space-y-6">

        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">
              Veículos
            </h1>
            <p className="text-sm text-stone-500">
              Quantidade de veículos cadastrados: {vehicles.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">

            {listBtn.map((btn)=>(

              <button
                key={btn.id}
                type="button"
                onClick={() => setRegisterModal(btn.set)}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
              >
                <FiPlus />
                {btn.label}
              </button>

            ))}

          </div>

        </div>

        {/* Pesquisa */}
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou placa"
            className="w-full rounded-lg border border-stone-200 py-2 pl-9 pr-3 outline-none focus:border-red-500"
          />
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="w-full text-left text-sm">

            <thead className="border-b border-stone-200 bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Veículo</th>
                <th className="px-4 py-3 font-medium">Marca / modelo</th>
                <th className="px-4 py-3 font-medium">Cor</th>
                <th className="px-4 py-3 font-medium">Ano</th>
                <th className="px-4 py-3 font-medium">Km</th>
                <th className="px-4 py-3 font-medium">Preço</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">

              {filteredVehicles.length > 0 ? (

                filteredVehicles.map((item:Veiculos) =>(

                    <tr
                      key={item.public_id}
                      className="hover:bg-stone-50 transition"
                    >

                      {/* Veículo */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-16 rounded bg-stone-200 ">
                            {item.imagens.length < 0 ? 
                            
                            <></>

                            :
                            
                              <img
                              className="w-full h-full object-cover rounded" 
                              src={item.imagens.find((img)=> img.principal === true)?.url} alt="imagem veiculo"
                              />

                            }
                          </div>

                          <div>
                            <p className="font-medium text-stone-900">
                              {item.nome}
                            </p>
                            <p className="text-xs text-stone-500">
                              {item.placa}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Marca / Modelo */}
                      <td className="px-4 py-3 text-stone-700">
                        {item.modelo?.descricao ?? "Não informado"}
                      </td>

                      {/* Cores */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {item.cores?.map((cor:Cores) => (
                            <span
                              key={cor.hexadecimal}
                              title={cor.descricao}
                              className="h-5 w-5 rounded-full border border-stone-300"
                              style={{
                                backgroundColor: cor.hexadecimal,
                              }}
                            />
                          ))}
                        </div>
                      </td>

                      {/* Ano */}
                      <td className="px-4 py-3 text-stone-700">
                        {item.ano_fab}
                      </td>

                      {/* Quilometragem */}
                      <td className="px-4 py-3 text-stone-700">
                        {Number(item.km).toLocaleString("pt-BR")} km
                      </td>

                      {/* Preço */}
                      <td className="px-4 py-3 font-medium text-stone-900">
                        {Number(item.preco).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>

                      {/* Ações */}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            aria-label="Editar veículo"
                            onClick={() => {
                              setVehicleSelected(item);
                              setModalEdit(true)
                            }}
                            className="rounded p-2 text-stone-500 hover:bg-stone-100"
                          >
                            <FiEdit2 />
                          </button>

                          <button
                            type="button"
                            aria-label="Excluir veículo"
                            onClick={()=> deleteVehicle(item.public_id)}
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
                    {search
                      ? "Nenhum veículo encontrado para essa pesquisa."
                      : "Nenhum veículo cadastrado."}
                  </td>
                </tr>

              )}

            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <ModalRegisterVehicle
        aberto={registerModal === "vehicle" ? true : false}
        onFechar={() => setRegisterModal("")}
      />


      <ModalModelo
      aberto={registerModal === "model" ? true : false}
      veiculo={vehicle} 
      onFechar={() => setRegisterModal("")}
      />

      <ModalDeleteModelo
      aberto={registerModal === "delete-model" ? true : false}
      onFechar={() => setRegisterModal("")}
      />

      <ModalErro 
      aberto={erro !== '' ? true : false}
      mensagem={erro} 
      titulo="Erro veiculo"
      onFechar={()=> setErro('')} 
      />

      <ModalUpdateVehicle 
      aberto={modalEdit} 
      onFechar={()=> setModalEdit(false)} 
      veiculo={vehicleSelected}
      />
      
      <ModalLoading 
      aberto = {loading} 
      mensagem = "Deletando veículo"
      />

    </>
  );
}
