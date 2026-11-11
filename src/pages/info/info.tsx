
import { useLocation, Link } from "react-router-dom";
import { Gallery } from "../../components/Galerry/Galerry";

import {
  FaWhatsapp,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaShareAlt,
  FaEnvelope,
  FaRegHeart,
} from "react-icons/fa";

export function Info() {
  const location = useLocation();
  const moto = location.state?.moto;

  if (!moto) {
    return <p>Veículo não encontrado.</p>;
  }

  const telefone = "43999175256";

  const precoFormatado = Number(moto.preco).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const infoMotos = [
    { label: "Ano Fab.", value: moto.ano_fab },
    { label: "Ano Mod.", value: moto.ano_mo },
    { label: "Km", value: moto.km },
    { label: "Combustível", value: moto.combustivel },
    { label: "Cor", value: moto.cor?.descricao },
    { label: "Placa", value: moto.placa },
  ];

  return (
    <main className="relative flex min-h-screen w-full flex-col gap-8 py-8">

      <div className="mx-auto max-w-7xl px-4">

        {/* CABEÇALHO */}
        <header className="
          flex items-center justify-between
          border-b border-cinza-300
          py-3 text-xs
        ">
          <nav className="flex items-center gap-2 text-cinza-500">
            <Link to="/">CARROS</Link>
            <span>›</span>
            <span>{moto.marca.descricao}</span>
            <span>›</span>
            <span>{moto.modelo.descricao}</span>
            <span>›</span>
            <Link to="/" className="text-preto font-medium">
              ← Voltar para a busca
            </Link>
          </nav>

          <div className="hidden sm:flex items-center gap-3">
            <span>Compartilhar</span>
            <FaWhatsapp className="text-base cursor-pointer" />
            <FaFacebookF className="text-base cursor-pointer" />
            <FaShareAlt className="text-base cursor-pointer" />
          </div>
        </header>

        {/* CONTEÚDO PRINCIPAL */}
        <section className="
          grid grid-cols-1
          lg:grid-cols-[minmax(0,1.9fr)_minmax(340px,1fr)]
          gap-5 lg:gap-4
          py-4
        ">

          {/* GALERIA */}
          <article className="w-full min-w-0">

            <div className="relative w-full">
              <Gallery images={moto.imagens} />

              <button className="
                absolute top-3 right-3 z-10
                flex items-center justify-center
                w-10 h-10 rounded-full
                bg-white/90 shadow-md
                text-cinza-500
              ">
                <FaRegHeart className="text-lg" />
              </button>
            </div>

          </article>

          {/* INFORMAÇÕES */}
          <article className="
            flex flex-col gap-4
            w-full min-w-0
          ">

            {/* TÍTULO E PREÇO */}
            <div className="flex flex-col gap-1">

              <h1 className="text-xl font-bold leading-tight">
                {moto.marca.descricao} {moto.nome}
              </h1>

              <p className="text-sm text-cinza-500 font-medium">
                {moto.modelo.descricao} / {moto.ano_fab}
              </p>

              <h2 className="text-2xl font-bold text-red-600 mt-1">
                R$ {precoFormatado}
              </h2>

            </div>

            {/* CARACTERÍSTICAS */}
            <div className="
              grid grid-cols-2 sm:grid-cols-3
              gap-2
            ">
              {infoMotos.map((info, index) => (
                <div
                  key={index}
                  className="
                    flex flex-col items-center justify-center
                    min-h-[58px]
                    border border-cinza-300
                    rounded-sm p-2
                    text-center
                  "
                >
                  <span className="text-xs text-cinza-500">
                    {info.label}
                  </span>

                  <span className="text-sm font-semibold uppercase">
                    {info.value || "Não informado"}
                  </span>
                </div>
              ))}
            </div>

            {/* BOTÕES DE CONTATO */}
            <div className="flex flex-col gap-2">

              <button className="
                flex items-center justify-center gap-2
                w-full h-11
                bg-preto text-white
                text-sm font-semibold
                rounded-sm
                hover:bg-cinza-700 transition
              ">
                <FaEnvelope />
                ENVIAR PROPOSTA
              </button>

              <a
                href={`https://wa.me/55${telefone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex items-center justify-center gap-2
                  w-full h-11
                  bg-green-600 text-white
                  text-sm font-semibold
                  rounded-sm
                  hover:bg-green-700 transition
                "
              >
                <FaWhatsapp className="text-lg" />
                FALE COM A LOJA
              </a>

              <a
                href={`tel:${telefone}`}
                className="
                  flex items-center justify-center gap-2
                  w-full h-10
                  border border-cinza-300
                  rounded-sm
                  text-sm font-medium
                  hover:bg-cinza-100 transition
                "
              >
                <FaPhoneAlt className="text-red-600" />
                (43) 99917-5256
              </a>

            </div>

            {/* LOCALIZAÇÃO */}
            <div className="
              flex flex-col gap-4
              w-full p-4
              border border-cinza-300
              rounded-sm
            ">

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">
                  Localização
                </h3>

                <button className="
                  border border-cinza-300
                  px-3 py-2
                  text-xs font-medium
                  rounded-sm
                  hover:bg-cinza-100
                ">
                  Ver mapa ↗
                </button>
              </div>

              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 text-cinza-500 shrink-0" />

                <p className="text-xs text-cinza-600 leading-relaxed">
                  Avenida Maracanã, 3530 Loja Vila Araponguinha -
                  ARAPONGAS
                </p>
              </div>

            </div>

          </article>

        </section>

        {/* DETALHES */}
        <section className="
          flex flex-col gap-5
          w-full py-8
          border-t border-cinza-300
        ">
          <h2 className="text-xl font-bold">
            Detalhes do veículo
          </h2>

          {/* Inserir informações adicionais */}
        </section>

        {/* OPCIONAIS */}
        <section className="
          flex flex-col gap-5
          w-full py-8
          border-t border-cinza-300
        ">
          <h2 className="text-xl font-bold">
            Opcionais
          </h2>

          {/* Inserir opcionais */}
        </section>

        {/* RELACIONADOS */}
        <section className="
          flex flex-col gap-5
          w-full py-8
          border-t border-cinza-300
        ">
          <h2 className="text-xl font-bold">
            Veículos relacionados
          </h2>

          {/* Inserir cards de veículos */}
        </section>

      </div>
      
    </main>
  );
}
