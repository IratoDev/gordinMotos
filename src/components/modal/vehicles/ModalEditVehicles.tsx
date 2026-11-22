import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FiImage, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { Inpunt } from "../../Ui/input";
import { Select } from "../../Ui/select";
import Modal, { Campo, inputClass } from "../modal";
import ModalCor from "../color/modalRegisterCor";
import ModalModelo from "../model/modalRegisterModelo";
import ModalMarca from "../marcas/modalRegisterMarca";
import type { FormField, FormSection } from "./modalVehiclesTypes";
import { api } from "../../../service/apiClient";
import { useApp } from "../../../context/Context";
import type { Categorias, Cores, Imagem, Marcas, Modelos, Veiculos } from "../../../context/dataTypes";

import { ModalErro } from "../../erroComponete/ErroComponent";
import { ModalLoading } from "../../loadingComponent/LoadingComponent";
import ModalCategoria from "../categori/modalRegisterCategoria";

const MAX_IMAGENS = 5;

// existente = já está no servidor (id = public_id) | nova = acabou de ser escolhida (tem file)
type ImagemItem = {
  id: string;
  url: string;
  file?: File;
  existente: boolean;
};

type Props = {
  aberto: boolean;
  onFechar: (e?:any) => void;
  veiculo: Veiculos | null; // item da lista de veículos
};

const FORM_INICIAL: Record<string, string> = {
  nome: "",
  categoria: "",
  marcas: "",
  modelo: "",
  placa: "",
  ano_fab: "",
  km: "",
  preco: "",
  cambio: "",
  combustivel: "",
  detalhes: "",
  opcionais: "",
};

const botaoAdicionar =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-vermelho-600 text-branco hover:opacity-90";

type EventoCampo = ChangeEvent<HTMLInputElement | HTMLSelectElement>;
const comoHandler = (fn: (e: EventoCampo) => void) => fn as unknown as () => void;

export function ModalUpdateVehicle({ aberto, onFechar, veiculo }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imagensRef = useRef<ImagemItem[]>([]);


  const { brands: marcas, colors: cores, categoris: categorias, setRefresh } = useApp();

  const [form, setForm] = useState<Record<string, string>>(FORM_INICIAL);
  const [destaque, setDestaque] = useState(false);
  const [ativo, setAtivo] = useState(false)

  const [imagens, setImagens] = useState<ImagemItem[]>([]);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [removidas, setRemovidas] = useState<string[]>([]); // public_id das fotos antigas apagadas

  const [coresIds, setCoresIds] = useState<string[]>([]);
  const [modalCadastro, setModalCadastro] = useState<"cor" | "modelo" | "marca" | "categoria" | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");




  const marcaSelecionada = marcas.find(
  (m: Marcas) => m.descricao === form.marcas);

  const modelos = marcaSelecionada?.modelos ?? [];

  const imagemPrincipal = imagens.find((img) => img.id === principal);
  const outrasImagens = imagens.filter((img) => img.id !== principal);
  const coresEscolhidas = cores.filter((c: Cores) => coresIds.includes(c.public_id));
  const coresDisponiveis = cores.filter((c: Cores) => !coresIds.includes(c.public_id));

  // Preenche o formulário com os dados do veículo sempre que o modal abre
  useEffect(() => {
    if (!aberto || !veiculo) return;

    const categoria = Array.isArray(veiculo.categoria) ? veiculo.categoria[0] : veiculo.categoria;

    setForm({
      nome: veiculo.nome ?? "",
      categoria: categoria?.descricao ?? "",
      marcas: veiculo.marca?.descricao ?? "",
      modelo: veiculo.modelo?.descricao ?? "",
      placa: veiculo.placa ?? "",
      ano_fab: String(veiculo.ano_fab ?? ""),
      km: String(veiculo.km ?? ""),
      preco: String(veiculo.preco ?? ""),
      cambio: veiculo.cambio ?? "",
      combustivel: veiculo.combustivel ?? "",
      detalhes: veiculo.detalhes ?? "",
      opcionais: veiculo.opcionais ?? "",
    });

    setAtivo(veiculo.ativo)


    setDestaque(Boolean(veiculo.destaque));
    setCoresIds((veiculo.cores ?? []).map((c: any) => c.public_id));


    const existentes: ImagemItem[] = (veiculo.imagens ?? []).map((img: any) => ({
      id: img.public_id,
      url: img.url,
      existente: true,
    }));
    setImagens(existentes);
    setPrincipal(
      (veiculo.imagens ?? []).find((img: Imagem) => img.principal)?.public_id ?? existentes[0]?.id ?? null,
    );
    setRemovidas([]);
    setErro("");
  }, [aberto, veiculo]);

  useEffect(() => {
    imagensRef.current = imagens;
  }, [imagens]);

  // só as fotos novas têm URL local para liberar
  useEffect(() => {
    return () =>
      imagensRef.current.forEach((img) => {
        if (!img.existente) URL.revokeObjectURL(img.url);
      });
  }, []);

  // ---------- Formulário ----------

  function handleChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "marcas" ? { modelo: "" } : {}),
    }));
  }

  function adicionarCor(descricao: string) {
    const cor = cores.find((c: Cores) => c.descricao === descricao);
    if (cor) setCoresIds((atuais) => [...atuais, cor.public_id]);
  }

  function removerCor(publicId: string) {
    setCoresIds((atuais) => atuais.filter((c) => c !== publicId));
  }

  // ---------- Imagens ----------

  function adicionarImagens(e: ChangeEvent<HTMLInputElement>) {
    const novas: ImagemItem[] = Array.from(e.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, MAX_IMAGENS - imagens.length)
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        existente: false,
      }));

    setImagens((atuais) => [...atuais, ...novas]);

    if (!principal && novas.length > 0) setPrincipal(novas[0].id);

    e.target.value = "";
  }

  function removerImagem(id: string) {
    const imagem = imagens.find((img) => img.id === id);
    if (!imagem) return;

    if (imagem.existente) {
      setRemovidas((atuais) => [...atuais, imagem.id]); // o backend apaga ao salvar
    } else {
      URL.revokeObjectURL(imagem.url);
    }

    const restantes = imagens.filter((img) => img.id !== id);
    setImagens(restantes);

    if (principal === id) setPrincipal(restantes[0]?.id ?? null);
  }

  // ---------- Fechar / enviar ----------

  function fechar() {
    imagens.forEach((img) => {
      if (!img.existente) URL.revokeObjectURL(img.url);
    });
    setModalCadastro(null);
    setErro("");
    onFechar();
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    if (imagens.length === 0) {
      setErro("O veículo precisa ter ao menos 1 foto.");
      return;
    }

    if(!veiculo){
      return
    }

    const dados = new FormData();

    Object.entries(form).forEach(([chave, valor]) => dados.append(chave, valor));
    dados.delete("marcas");
    dados.delete("categoria");
    dados.delete("modelo");

    dados.append("public_id", veiculo.public_id);

    // no update o backend espera categoria_id e modelo_id
    const categoriaId = categorias.find((c: Categorias) => c.descricao === form.categoria)?.public_id;
    const modeloId = modelos.find((m: Modelos) => m.descricao === form.modelo)?.public_id;
    if (categoriaId) dados.append("categoria_id", categoriaId);
    if (modeloId) dados.append("modelo_id", modeloId);

    dados.append("destaque", String(destaque));
    dados.append("ativo", String(ativo));
    dados.append("cores", JSON.stringify(coresIds));

    // fotos
    dados.append("remover_imagens", JSON.stringify(removidas));

    const novas = imagens.filter((img) => !img.existente);
    novas.forEach((img) => dados.append("files", img.file!));

    const principalAtual = imagens.find((img) => img.id === principal);
    if (principalAtual?.existente) {
      dados.append("imagem_principal", principalAtual.id);
    } else if (principalAtual) {
      dados.append("indice_principal", String(novas.findIndex((img) => img.id === principal)));
    }

    try {
      setLoading(true);
      await api.patch("/vehicles", dados);

      setRefresh((prev: any) => !prev);
      fechar();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível atualizar o veículo."),
      );
    } finally {
      setLoading(false);
    }
  }

  // ---------- Campos dinâmicos ----------

  const secoes: FormSection[] = [
    {
      title: "Informações do veículo",
      fields: [
        { type: "input", name: "nome", label: "Nome", placeholder: "Ex: Honda CB 500F", colSpan: 2 },
        {
          type: "select",
          name: "categoria",
          label: "Categoria",
          options: categorias.map((c: Categorias) => c.descricao),
          onAdd: () => setModalCadastro("categoria"),
        },
        {
          type: "select",
          name: "marcas",
          label: "Marca",
          options: marcas.map((m: Marcas) => m.descricao),
          onAdd: () => setModalCadastro("marca"),
        },
        {
          type: "select",
          name: "modelo",
          label: "Modelo",
          options: modelos.map((m: Modelos) => m.descricao),
          onAdd: () => setModalCadastro("modelo"),
        },
        { type: "input", name: "placa", label: "Placa", placeholder: "ABC1D23" },
        { type: "input", name: "ano_fab", label: "Ano de fabricação", inputType: "number", placeholder: "2022" },
        { type: "input", name: "km", label: "Quilometragem", inputType: "number", placeholder: "0" },
        { type: "input", name: "preco", label: "Preço (R$)", inputType: "number", placeholder: "0,00" },
        {
          type: "select",
          name: "cambio",
          label: "Câmbio",
          options: [
            "MANUAL",
            "MANUAL_4_MARCHAS",
            "MANUAL_5_MARCHAS",
            "MANUAL_6_MARCHAS",
            "SEMIAUTOMATICO",
            "SEMIAUTOMATICO_ROTATIVO",
            "AUTOMATICO",
            "CVT",
            "DCT",
            "AMT",
            "E_CLUTCH",
            "SEQUENCIAL",
            "ELETRONICO",
            "ELETRICO",
          ],
        },
        {
          type: "select",
          name: "combustivel",
          label: "Combustível",
          options: ["GASOLINA", "ETANOL", "FLEX", "DIESEL", "ELETRICO"],
        },
      ],
      extra: (
        <div className="space-y-2">
          <Campo label="Cores">
            <div className="flex gap-2">
              <div className="min-w-0 flex-1">
                <Select
                  name="cores"
                  value=""
                  list={coresDisponiveis.map((c: Cores) => c.descricao)}
                  handleChange={comoHandler((e) => adicionarCor(e.target.value))}
                />
              </div>

              <button
                type="button"
                onClick={() => setModalCadastro("cor")}
                aria-label="Cadastrar cor"
                title="Cadastrar cor"
                className={botaoAdicionar}
              >
                <FiPlus />
              </button>
            </div>
          </Campo>

          {coresEscolhidas.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {coresEscolhidas.map((cor: Cores) => (
                <li
                  key={cor.public_id}
                  className="flex items-center gap-1 rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-900"
                >
                  {cor.descricao}
                  <button
                    type="button"
                    onClick={() => removerCor(cor.public_id)}
                    aria-label={`Remover ${cor.descricao}`}
                    className="text-stone-500 hover:text-vermelho-600"
                  >
                    <FiX size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      title: "Detalhes",
      fields: [
        {
          type: "textarea",
          name: "detalhes",
          label: "Detalhes",
          placeholder: "Descreva os detalhes do veículo",
          colSpan: 2,
        },
        {
          type: "textarea",
          name: "opcionais",
          label: "Opcionais",
          placeholder: "Ex: ABS, partida elétrica",
          colSpan: 2,
        },
      ],
    },
  ];

  function renderField(field: FormField) {
    const value = form[field.name] ?? "";

    if (field.type === "input") {
      return (
        <Inpunt
          type={field.inputType ?? "text"}
          name={field.name}
          value={value}
          placeholder={field.placeholder ?? ""}
          handleChange={(e) => handleChange(field.name, e.target.value)}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          rows={3}
          name={field.name}
          value={value}
          placeholder={field.placeholder}
          onChange={(e) => handleChange(field.name, e.target.value)}
          className={inputClass}
        />
      );
    }

    const select = (
      <Select
        name={field.name}
        value={value}
        list={field.options}
        handleChange={comoHandler((e) => handleChange(field.name, e.target.value))}
      />
    );

    if (!field.onAdd) return select;

    return (
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">{select}</div>
        <button
          type="button"
          onClick={field.onAdd}
          aria-label={`Cadastrar ${field.label.toLowerCase()}`}
          title={`Cadastrar ${field.label.toLowerCase()}`}
          className={botaoAdicionar}
        >
          <FiPlus />
        </button>
      </div>
    );
  }

  return (
    <>
      <Modal aberto={aberto} onFechar={fechar} titulo="Editar veículo" largura="max-w-xl">
        <form noValidate className="space-y-6">
          {/* Imagens */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <div>
                <h3 className="text-sm font-semibold text-stone-900">Imagens</h3>
                <p className="text-xs text-stone-500">
                  Clique em uma miniatura para torná-la a imagem principal.
                </p>
              </div>

              <span className="rounded-md bg-stone-100 px-2 py-1 text-xs font-medium text-stone-900">
                {imagens.length}/{MAX_IMAGENS}
              </span>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={adicionarImagens}
            />

            {imagemPrincipal ? (
              <div className="space-y-3">
                <div className="relative overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                  <img
                    src={imagemPrincipal.url}
                    alt="Imagem principal do veículo"
                    className="h-64 w-full object-cover"
                  />

                  <span className="absolute left-3 top-3 rounded-md bg-vermelho-600 px-2 py-1 text-xs font-medium text-branco">
                    Principal
                  </span>

                  <button
                    type="button"
                    onClick={() => removerImagem(imagemPrincipal.id)}
                    aria-label="Remover imagem principal"
                    className="absolute right-3 top-3 rounded-md bg-white p-2 text-vermelho-600"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {outrasImagens.map((img) => (
                    <div
                      key={img.id}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-stone-200"
                    >
                      <button
                        type="button"
                        onClick={() => setPrincipal(img.id)}
                        title="Definir como principal"
                        className="h-full w-full"
                      >
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removerImagem(img.id)}
                        aria-label="Remover imagem"
                        className="absolute right-1 top-1 rounded bg-white p-1 text-vermelho-600"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  ))}

                  {imagens.length < MAX_IMAGENS && (
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      className="flex h-20 w-20 shrink-0 flex-col items-center justify-center gap-1 rounded-md border border-dashed border-stone-300 text-xs text-stone-500 hover:border-vermelho-600 hover:text-vermelho-600"
                    >
                      <FiPlus size={18} />
                      Adicionar
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-stone-300 p-8 text-sm text-stone-500 hover:border-vermelho-600"
              >
                <FiImage size={28} className="text-red-500" />
                Clique para escolher até {MAX_IMAGENS} imagens
              </button>
            )}
          </section>

          {/* Formulário dinâmico */}
          {secoes.map((secao) => (
            <section key={secao.title} className="space-y-4">
              <h3 className="border-b border-stone-200 pb-2 text-sm font-semibold text-stone-900">
                {secao.title}
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                {secao.fields.map((field) => (
                  <Campo
                    key={field.name}
                    label={field.label}
                    className={field.colSpan === 2 ? "md:col-span-2" : ""}
                  >
                    {renderField(field)}
                  </Campo>
                ))}
              </div>

              {secao.extra}
            </section>
          ))}

          {/* Configurações */}
          <section className="flex flex-col gap-4 border-t border-stone-200 pt-4">
            <label className="flex w-1/5 items-center justify-start gap-1 text-sm text-stone-900">
              <p>Destaque</p>

              <Inpunt
                type={"checkbox"}
                name={"destaque input"}
                checked={destaque}
                handleChange={(e) => setDestaque(e.target.checked)}
              />
            </label>

            <label className="flex w-1/5 items-center justify-start gap-1 text-sm text-stone-900">
              <p>Ativo</p>

              <Inpunt
                type={"checkbox"}
                name={"ativo input"}
                checked={ativo}
                handleChange={() => setAtivo((prev)=> !prev)}
              />
            </label>

          </section>
         
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
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </Modal>

      <ModalCor aberto={modalCadastro === "cor"} onFechar={() => setModalCadastro(null)} />
      <ModalMarca aberto={modalCadastro === "marca"} onFechar={() => setModalCadastro(null)} />


     
      {veiculo !== null &&(

        <ModalModelo 
        veiculo={Array(veiculo)}
        aberto={modalCadastro === "modelo"} 
        onFechar={() => setModalCadastro(null)} />
      )}

      <ModalErro
        aberto={erro !== ""}
        mensagem={erro}
        titulo={"Erro ao atualizar veículo"}
        onFechar={() => setErro("")}
      />
   
      <ModalCategoria aberto={modalCadastro === "categoria"} onFechar={() => setModalCadastro(null)} />

      <ModalLoading aberto={loading} mensagem={"Atualizando veículo"} />
    </>
  );
}