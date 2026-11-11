import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function Contact(){
        
    return(
        <>
            <main className="relative flex min-h-screen w-full flex-col gap-8 py-8 mt-24">
                <div className="mx-auto w-full max-w-7xl px-4">

                    {/* Cabeçalho */}
                    <section className="mb-10 text-center">
                      <span className="text-sm font-semibold uppercase tracking-wider text-vermelho-500">
                        Fale conosco
                      </span>

                      <h1 className="mt-2 text-3xl font-bold text-cinza-800 md:text-4xl">
                        Entre em contato
                      </h1>

                      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-cinza-600 md:text-base">
                        Estamos prontos para atender você. Entre em contato
                        pelos nossos telefones ou venha nos visitar.
                      </p>
                    </section>

                    {/* Cards */}
                    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                      {/* Telefones */}
                      <div className="flex flex-col rounded-xl border border-cinza-300 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-vermelho-500">
                          <FaPhoneAlt size={20} />
                        </div>

                        <h2 className="text-xl font-bold text-cinza-800">
                          Telefones
                        </h2>

                        <p className="mt-2 text-sm text-cinza-600">
                          Entre em contato diretamente com nossa equipe.
                        </p>

                        <div className="mt-6 space-y-4">
                          <a
                            href="tel:+5543999529363"
                            className="flex items-center gap-3 text-sm font-medium text-cinza-700 transition hover:text-vermelho-500"
                          >
                            <FaPhoneAlt className="shrink-0 text-vermelho-500" />
                            (43) 99952-9363
                          </a>

                          <a
                            href="tel:+5543999175256"
                            className="flex items-center gap-3 text-sm font-medium text-cinza-700 transition hover:text-vermelho-500"
                          >
                            <FaPhoneAlt className="shrink-0 text-vermelho-500" />
                            (43) 99917-5256
                          </a>
                        </div>

                        <div className="mt-auto pt-6">
                          <a
                            href="https://wa.me/5543999529363"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-vermelho-500 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                          >
                            <FaWhatsapp size={18} />
                            Conversar pelo WhatsApp
                          </a>
                        </div>
                      </div>

                      {/* Endereço */}
                      <div className="flex flex-col rounded-xl border border-cinza-300 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-vermelho-500">
                          <FaMapMarkerAlt size={22} />
                        </div>

                        <h2 className="text-xl font-bold text-cinza-800">
                          Nossa localização
                        </h2>

                        <p className="mt-2 text-sm text-cinza-600">
                          Estamos esperando sua visita. Confira nosso endereço.
                        </p>

                        <div className="mt-6 flex items-start gap-3">
                          <FaMapMarkerAlt className="mt-1 shrink-0 text-vermelho-500" />

                          <p className="text-sm leading-relaxed text-cinza-700">
                            Avenida Maracanã, 3530
                            <br />
                            Vila Araponguinha
                            <br />
                            Arapongas - PR
                          </p>
                        </div>

                        <div className="mt-auto pt-6">
                          <a
                            href="https://www.google.com/maps/place/Av.+Maracan%C3%A3,+3530+-+Vila+Edio,+Arapongas+-+PR,+86705-582/@-23.4020657,-51.4277447,17z/data=!4m7!3m6!1s0x94eca159bca9a33f:0xebd8a55c1778e71!8m2!3d-23.4018603!4d-51.427185!10e3!16s%2Fg%2F11hb74wpvf?entry=ttu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-lg border border-cinza-300 px-4 py-3 text-sm font-semibold text-cinza-700 transition hover:border-vermelho-500 hover:text-vermelho-500"
                          >
                            Ver localização no mapa
                            <FaExternalLinkAlt size={12} />
                          </a>
                        </div>
                      </div>

                      {/* Horários */}
                      <div className="flex flex-col rounded-xl border border-cinza-300 bg-white p-6 shadow-sm">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-vermelho-500">
                          <FaClock size={22} />
                        </div>

                        <h2 className="text-xl font-bold text-cinza-800">
                          Horário de atendimento
                        </h2>

                        <p className="mt-2 text-sm text-cinza-600">
                          Confira nossos horários e programe sua visita.
                        </p>

                        <div className="mt-6 space-y-4">
                          <div className="flex items-center justify-between gap-3 border-b border-cinza-300 pb-3">
                            <span className="text-sm font-medium text-cinza-700">
                              Segunda a sexta
                            </span>

                            <span className="text-sm text-cinza-600">
                              08:00 às 18:00
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3 border-b border-cinza-300 pb-3">
                            <span className="text-sm font-medium text-cinza-700">
                              Sábado
                            </span>

                            <span className="text-sm text-cinza-600">
                              08:00 às 13:00
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-cinza-700">
                              Domingo
                            </span>

                            <span className="text-sm text-cinza-500">
                              Fechado
                            </span>
                          </div>
                        </div>
                      </div>

                    </section>

                    {/* Chamada final */}
                    <section className="mt-10 rounded-xl bg-cinza-800 px-6 py-8 text-center md:px-10">
                      <h2 className="text-xl font-bold text-white md:text-2xl">
                        Precisa de ajuda?
                      </h2>

                      <p className="mt-2 text-sm text-gray-300">
                        Nossa equipe está pronta para tirar suas dúvidas e ajudar você.
                      </p>

                      <a
                        href="https://wa.me/5543999529363"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-vermelho-500 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                      >
                        <FaWhatsapp size={18} />
                        Fale com nossa equipe
                      </a>
                    </section>
                </div>
            </main>
        </>
    )
}