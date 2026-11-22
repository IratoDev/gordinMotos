import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { FiImage, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { Inpunt } from "../../Ui/input";
import { Select } from "../../Ui/select";
import Modal, { Campo, inputClass } from "../modal";
import ModalCor from "../color/modalRegisterCor";
import ModalModelo from "../model/modalRegisterModelo";
import ModalMarca from "../marcas/modalRegisterMarca";
import type { FormField, FormSection, Imagem, Props } from "./modalVehiclesTypes";
import { api } from "../../../service/apiClient";
import { useApp } from "../../../context/Context";
import type { Categorias, Cores, Marcas, Modelos } from "../../../context/dataTypes";

import { ModalErro } from "../../erroComponete/ErroComponent";
import { ModalLoading } from "../../loadingComponent/LoadingComponent";
import ModalCategoria from "../categori/modalRegisterCategoria";

const MAX_IMAGENS = 5;

const FORM_INICIAL: Record<string, string> = {
  nome: "",
  categoria: "",
  marcas: "", // só serve para filtrar os modelos; não é enviado
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

// Campos que podem ficar vazios
const CAMPOS_OPCIONAIS = ["detalhes", "opcionais"];


type EventoCampo = ChangeEvent<HTMLInputElement | HTMLSelectElement>;
const comoHandler = (fn: (e: EventoCampo) => void) => fn as unknown as () => void;

export function ModalRegisterVehicle({ aberto, onFechar }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imagensRef = useRef<Imagem[]>([]);

  // Usa direto do contexto (sem useState) para sempre refletir os dados atuais
  const { brands: marcas, colors: cores, categoris: categorias, setRefresh} = useApp();

  const [form, setForm] = useState<Record<string, string>>(FORM_INICIAL);
  const [destaque, setDestaque] = useState(false);

  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [principal, setPrincipal] = useState<string | null>(null);

  const [coresIds, setCoresIds] = useState<string[]>([]);
  const [modalCadastro, setModalCadastro] = useState<"cor" | "modelo" | "marca" | "categoria" | null>(null);

  const [loading, setLoading] = useState(false)
  
  const [erro, setErro] = useState("");
  

  // A marca escolhida no select define quais modelos aparecem
  const marcaSelecionada = marcas.find((m:Marcas) => m.descricao === form.marcas);
  const modelos = marcaSelecionada?.modelos ?? [];

  const imagemPrincipal = imagens.find((img) => img.id === principal);
  const outrasImagens = imagens.filter((img) => img.id !== principal);
  const coresEscolhidas = cores.filter((c:Cores) => coresIds.includes(c.public_id));
  const coresDisponiveis = cores.filter((c:Cores) => !coresIds.includes(c.public_id));

  // Guarda a lista atual para liberar as URLs só quando o componente sair da tela
  useEffect(() => {
    imagensRef.current = imagens;
  }, [imagens]);

  useEffect(() => {
    return () => imagensRef.current.forEach((img) => URL.revokeObjectURL(img.url));
  }, []);

  // ---------- Formulário ----------

  function handleChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // trocou a marca: o modelo antigo não vale mais
      ...(name === "marcas" ? { modelo: "" } : {}),
    }));
  }

  // O Select só trabalha com texto: recebemos a descrição e guardamos o public_id
  function adicionarCor(descricao: string) {
    const cor = cores.find((c:Cores) => c.descricao === descricao);
    if (cor) setCoresIds((atuais) => [...atuais, cor.public_id]);
  }

  function removerCor(publicId: string) {
    setCoresIds((atuais) => atuais.filter((c) => c !== publicId));
  }

  // ---------- Imagens ----------

  function adicionarImagens(e: ChangeEvent<HTMLInputElement>) {
    const novas = Array.from(e.target.files ?? [])
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, MAX_IMAGENS - imagens.length)
      .map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }));

    setImagens((atuais) => [...atuais, ...novas]);

    if (!principal && novas.length > 0) setPrincipal(novas[0].id);

    e.target.value = "";
  }

  function removerImagem(id: string) {
    const imagem = imagens.find((img) => img.id === id);
    if (!imagem) return;

    URL.revokeObjectURL(imagem.url);

    const restantes = imagens.filter((img) => img.id !== id);
    setImagens(restantes);

    if (principal === id) setPrincipal(restantes[0]?.id ?? null);
  }

  // ---------- Fechar / enviar ----------

  function limpar() {
    imagens.forEach((img) => URL.revokeObjectURL(img.url));
    setForm(FORM_INICIAL);
    setDestaque(false);
    setImagens([]);
    setPrincipal(null);
    setCoresIds([]);
    setModalCadastro(null);
    setErro("");
  }

  function fechar() {
    limpar();
    onFechar();
  }

  function validar() {
  const novos: any[] = [];

  secoes.forEach((secao) => {
    secao.fields.forEach((field) => {
      if (CAMPOS_OPCIONAIS.includes(field.name)) return;
      if (!form[field.name]?.trim()) {
        novos.push(`Preencha : ${field.name} `)
      }
    });
  });

  return novos;
}


  async function enviar(e: FormEvent) {
    e.preventDefault();
    setErro("");

    const novos = validar();

    console.log("novo", novos)
    setErro(String(novos.map((m)=> m )));

    const primeiro = Object.keys(novos)[0];
    if (primeiro) {
      document
        .querySelector(`[name="${primeiro}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (imagens.length === 0) {
      setErro("Envie ao menos 1 foto.");
      return;
    }


    setLoading(true)

    const dados = new FormData();

    Object.entries(form).forEach(([chave, valor]) => dados.append(chave, valor));
    dados.delete("marcas"); // só serve para filtrar modelos

    // categoria e modelo estão no form como descrição; o backend espera o public_id
    dados.set("categoria", categorias.find((c:Categorias) => c.descricao === form.categoria)?.public_id ?? "");
    dados.set("modelo", modelos.find((m:Modelos) => m.descricao === form.modelo)?.public_id ?? "");

    dados.append("destaque", String(destaque));
    dados.set("km", String(parseFloat(form.km) || 0));
    dados.append("cores", JSON.stringify(coresIds)); // o service faz JSON.parse

    // a ordem dos arquivos define o índice da principal
    imagens.forEach((img) => dados.append("imagens", img.file));
    dados.append("indice_principal", String(imagens.findIndex((img) => img.id === principal)));
    

    try {

      // Assume que o `api` é axios: ele coloca o Content-Type multipart sozinho.
      // Se o seu apiClient for outro (fetch), me avise.
      await api.post("/vehicles", dados);

      setLoading(false)
      setRefresh((prev:any)=> !prev)
      fechar();
    } catch (err: any) {
      const mensagem = err?.response?.data?.message;
      setErro(
        Array.isArray(mensagem)
          ? mensagem.join(", ")
          : (mensagem ?? "Não foi possível cadastrar o veículo."),
      );
    } finally {
      setLoading(false)
      
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
          options: categorias.map((c:Categorias) => c.descricao),
          onAdd: () => setModalCadastro("categoria"),
        },
        {
          type: "select",
          name: "marcas",
          label: "Marca",
          options: marcas.map((m:Marcas) => m.descricao),
          onAdd: () => setModalCadastro("marca"),
        },
        {
          type: "select",
          name: "modelo",
          label: "Modelo",
          options: modelos.map((m:Modelos) => m.descricao),
          onAdd: () => setModalCadastro("modelo"),
        },
        { type: "input", name: "placa", label: "Placa", placeholder: "ABC1D23" },
        { type: "input", name: "ano_fab", label: "Ano de fabricação", inputType: "number", placeholder: "2022" },
        { type: "input", name: "km", label: "Quilometragem", inputType: "number", placeholder: "0" },
        { type: "input", name: "preco", label: "Preço (R$)", inputType: "number", placeholder: "0,00" },
        { type: "select", 
          name: "cambio", 
          label: "Câmbio", 
          options: [
              'MANUAL',
              'MANUAL_4_MARCHAS',
              'MANUAL_5_MARCHAS',
              'MANUAL_6_MARCHAS',
              'SEMIAUTOMATICO',
              'SEMIAUTOMATICO_ROTATIVO',
              'AUTOMATICO',
              'CVT',
              'DCT',
              'AMT',
              'E_CLUTCH',
              'SEQUENCIAL',
              'ELETRONICO',
              'ELETRICO',
          ] },
        {
          type: "select",
          name: "combustivel",
          label: "Combustível",
          options: [
            "GASOLINA",
            "ETANOL", 
            "FLEX",
            "DIESEL",
            "ELETRICO"],
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
                  list={coresDisponiveis.map((c:Cores) => c.descricao)}
                  handleChange={(e) => adicionarCor(e.target.value)}
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
              {coresEscolhidas.map((cor:Cores) => (
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
      <Modal aberto={aberto} onFechar={fechar} titulo="Cadastrar veículo" largura="max-w-xl">
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
          <section className="border-t border-stone-200 pt-4">
            <label className="flex justify-start items-center gap-1 text-sm text-stone-900 w-1/5">
              <p>Destaque</p>

              <Inpunt
                type={"checkbox"}
                name={"destaque input"}
                checked={destaque}
                handleChange={(e) => setDestaque(e.target.checked)}
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
              className="rounded-md bg-vermelho-600 px-4 py-2.5 text-sm font-medium text-branco hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Salvando..." : "Cadastrar veículo"}
            </button>
          </div>
        </form>
      </Modal>

      <ModalCor aberto={modalCadastro === "cor"} onFechar={() => setModalCadastro(null)} />
      <ModalMarca aberto={modalCadastro === "marca"} onFechar={() => setModalCadastro(null)} />
      <ModalModelo marca={marcaSelecionada}  aberto={modalCadastro === "modelo"} onFechar={() => setModalCadastro(null)} />
      <ModalCategoria aberto={modalCadastro === "categoria"} onFechar={() => setModalCadastro(null)} />
      
      <ModalErro  
      aberto={erro !== "" ? true : false} 
      mensagem={erro} 
      titulo={"Erro ao cadastrar veiculo"}
      onFechar={()=> setErro('')} />

      <ModalLoading 
      aberto={loading} 
      mensagem={"Cadastrando Veículo"}
      />
    </>
  );
}