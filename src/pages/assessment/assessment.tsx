import { useEffect, useState} from "react";


import { useApp } from "../../context/Context";
import type { Veiculos } from "../../context/dataTypes";
import { ModalAviso } from "../../components/modal/aviso/AvisoModal";
import { VehicleSearch } from "./VehicleSearch";
import { api } from "../../service/apiClient";
import { ModalErro } from "../../components/erroComponete/ErroComponent";
import { ModalLoading } from "../../components/loadingComponent/LoadingComponent";
import { getUserId } from "../../lib/cookie";
import { FaStar } from "react-icons/fa";




export default function Assessment() {
  const { loggedIn, vehicles } = useApp();
  const clienteId = getUserId();

  // junto com os outros estados:
  const [estrelas, setEstrelas] = useState(0);
  const [hover, setHover] = useState(0);

  const [form, setForm] = useState<Record<string, string >>({
    informacoesAdicionais: "",
    vehicles_public_id:"",
    cliente_public_id: clienteId as string,
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Veiculos | null>(null);
  const [erroVeiculo, setErroVeiculo] = useState("");

  const [avisoModal, setAvisoModal] = useState(!loggedIn);

  useEffect(() => {
    if (!loggedIn) {
      setAvisoModal(true);
    }
    setForm(prev => ({...prev,cliente_public_id: clienteId as string}));

  }, [loggedIn]);

  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState("");
  
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  function limpar() {
  
      setForm({
        informacoesAdicionais: "",
        vehicles_public_id:""
      });
      setSelectedVehicle(null)
      setErro("");
      setEstrelas(0)
  }
  
  function handleSelectVehicle(vehicle: Veiculos) {
    setSelectedVehicle(vehicle);
    setForm((prev) => ({ ...prev, vehicles_public_id: vehicle.public_id }));
    setErroVeiculo("");
  }


  const enviar = async (e: React.FormEvent) => {
  
    e.preventDefault();
    
    if (!form.vehicles_public_id) {
      setErro('Selecione um veiculo.');
      return;
    }
    
    if (!form.cliente_public_id) {
      setErro('Preencha todos os formularios.');
      return;
    }
    setLoading(true)
  
      setErro('');
  
      try {
        await api.post("/assessment/", { ...form, estrelas }); 
        
        limpar()
        console.log("acionado")
        setLoading(false)
  
      } catch (err: any) {
        const mensagem = err?.response?.data?.message;
        setErro(
          Array.isArray(mensagem)
            ? mensagem.join(", ")
            : (mensagem ?? "Não foi possível criar avaliação."),
        );
       
      }finally{
        setLoading(false)
      }
  
  };


  console.log("formulario",form, clienteId)

  return (
    <>
      <main className="relative flex min-h-screen w-full flex-col gap-8 py-8 mt-24">
        <div className="mx-auto w-full max-w-7xl px-4">
          {/* Cabeçalho */}
          <section className="mb-10 space-y-2">
            <h1 className="text-3xl font-bold text-cinza-800">
              Avalie a sua moto com a gente.
            </h1>

            <p className="text-sm text-cinza-600">
              Preencha o formulário abaixo e tenha a melhor avaliação do mercado
              para sua moto.
            </p>
          </section>

          <form onSubmit={enviar} className="space-y-10">
            {/* Veículo (busca no catálogo) */}
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-cinza-800">
                Dados da Moto
              </h2>

              <VehicleSearch
                vehicles={vehicles}
                selected={selectedVehicle}
                onSelect={handleSelectVehicle}
                onClear={() => setSelectedVehicle(null)}
              />

              {erroVeiculo && (
                <p className="text-sm text-vermelho-500">{erroVeiculo}</p>
              )}
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-bold text-cinza-800">Sua Avaliação</h2>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} estrelas`}
                    onClick={() => setEstrelas(n)}
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                  >
                    <FaStar
                      size={32}
                      className={
                        n <= (hover || estrelas) ? "text-yellow-400" : "text-cinza-300"
                      }
                    />
                  </button>
                ))}
            </div>
            </section>

            {/* Informações adicionais */}
            <section className="space-y-5">
              <h2 className="text-2xl font-bold text-cinza-800">
                Informações Adicionais
              </h2>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="informacoesAdicionais"
                  className="text-sm font-medium text-cinza-700"
                >
                  Descreva o estado da sua moto
                </label>

                <textarea
                  id="informacoesAdicionais"
                  name="informacoesAdicionais"
                  value={form.informacoesAdicionais}
                  onChange={handleChange}
                  placeholder="Informe detalhes sobre sua moto, conservação, acessórios, manutenção..."
                  rows={5}
                  className="w-full resize-y rounded-md border border-cinza-300 bg-branco px-3 py-3 text-sm text-cinza-700 outline-none transition focus:border-vermelho-500 focus:ring-2 focus:ring-vermelho-100"
                />
              </div>
            </section>

            {/* Botão */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-md bg-vermelho-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Solicitar avaliação
              </button>
            </div>
          </form>

        </div>
      </main>

      <ModalAviso
        aberto={avisoModal}
        titulo="Identifique-se para continuar"
        mensagem="
    Para fazer uma avaliação da sua moto, é necessário estar conectado à sua conta.
    Faça login ou cadastre-se para continuar."
        textoBotao="Entendi"
        onFechar={() => setAvisoModal(false)}
      />

      <ModalErro 
      aberto={erro === "" ? false : true}
      mensagem={erro} 
      titulo="Erro ao cria avaliação"
      onFechar={() => setErro('')}
      />;
  
      <ModalLoading aberto={loading} mensagem="Criado avaliação"/>
    </>
  );
}