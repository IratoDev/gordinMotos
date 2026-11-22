
import { useRef } from "react";
import type { Assessment } from "../../../context/dataTypes";

interface Props {
  avaliacoes: Assessment[];
}

export function CarrosselAvaliacoes({ avaliacoes }: Props) {
  const carrosselRef = useRef<HTMLDivElement>(null);

  function navegar(direcao: "anterior" | "proximo") {
    carrosselRef.current?.scrollBy({
      left: direcao === "proximo" ? 350 : -350,
      behavior: "smooth",
    });
  }

  if (!avaliacoes.length) return null;

  return (
    <section className="w-full py-8 space-y-7">

      {/* Cabeçalho */}
      <div className="flex items-end justify-between gap-4">

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
            Experiência dos clientes
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            O que dizem nossos clientes
          </h2>

          <p className="text-sm text-gray-500">
            Confira as experiências de quem já comprou conosco.
          </p>
        </div>

        {/* Navegação */}
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => navegar("anterior")}
            aria-label="Avaliação anterior"
            className="w-10 h-10 flex items-center justify-center rounded-full
            bg-gray-900 text-white transition-all duration-300
            hover:bg-red-600 hover:scale-105 active:scale-95"
          >
            ❮
          </button>

          <button
            type="button"
            onClick={() => navegar("proximo")}
            aria-label="Próxima avaliação"
            className="w-10 h-10 flex items-center justify-center rounded-full
            bg-gray-900 text-white transition-all duration-300
            hover:bg-red-600 hover:scale-105 active:scale-95"
          >
            ❯
          </button>
        </div>
      </div>

      {/* Carrossel */}
      <div
        ref={carrosselRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory
        scroll-smooth py-4 px-1
        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {avaliacoes.map((avaliacao) => {
          const imagem = avaliacao.veiculo.imagens?.find(
            (img) => img.principal === true
          )?.url;

          return (
            <article
              key={avaliacao.public_id}
              className="group flex flex-col shrink-0 w-[285px] sm:w-[330px]
              snap-start rounded-2xl border border-gray-200
              bg-white p-5 shadow-sm transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl hover:border-gray-300"
            >

              {/* Estrelas */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={`text-lg ${
                        index < avaliacao.estrelas
                          ? "text-amber-400"
                          : "text-gray-200"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <span className="text-xs font-bold text-gray-500">
                  {avaliacao.estrelas}.0 / 5
                </span>
              </div>

              {/* Comentário */}
              <div className="relative flex-1 mb-6">
                <span className="absolute -top-4 -left-1 text-4xl
                font-serif text-gray-200">
                  “
                </span>

                <p className="relative z-10 text-sm leading-7 text-gray-600
                pt-2 min-h-[100px]">
                  {avaliacao.texto || "Cliente não deixou um comentário."}
                </p>
              </div>

              {/* Veículo */}
              <div className="border-t border-gray-100 pt-4">

                <span className="text-[10px] font-bold uppercase
                tracking-widest text-gray-400">
                  Veículo avaliado
                </span>

                <div className="flex items-center gap-3 mt-3">

                  <div className="w-[76px] h-[65px] shrink-0 overflow-hidden
                  rounded-xl bg-gray-100">
                    {imagem ? (
                      <img
                        src={imagem}
                        alt={avaliacao.veiculo.nome}
                        className="w-full h-full object-cover
                        transition-transform duration-500
                        group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center
                      justify-center text-gray-400 text-xs">
                        Sem foto
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {avaliacao.veiculo.nome}
                    </h3>

                    <p className="text-xs text-gray-500 mt-1 truncate">
                      {avaliacao.veiculo.marca?.descricao}
                      {" | "}
                      {avaliacao.veiculo.modelo?.descricao}
                    </p>
                  </div>

                </div>
              </div>

            </article>
          );
        })}
      </div>

    </section>
  );
}
