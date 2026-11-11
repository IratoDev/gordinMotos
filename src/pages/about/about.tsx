import {
  FaBuilding,
  FaBullseye,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

export default function About(){
        
    return(
        <>
            <main className='flex flex-col gap-8 relative w-screen h-full py-8 mt-24'>
                <div className="mx-auto max-w-7xl px-4">

                    {/* CABEÇALHO */}
                    <section className="mb-12">
                      <span className="mb-3 block text-sm font-semibold uppercase tracking-wider text-red-600">
                        Conheça nossa história
                      </span>

                      <h1 className="mb-5 text-3xl font-bold text-gray-900 md:text-4xl">
                        Sobre a empresa
                      </h1>

                      <p className="max-w-3xl text-base leading-8 text-gray-600 md:text-lg">
                        Conheça nossa trajetória, nossos valores e o compromisso
                        que temos em oferecer as melhores soluções para nossos
                        clientes.
                      </p>
                    </section>

                    {/* APRESENTAÇÃO */}
                    <section className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">

                      {/* IMAGEM */}
                      <div className="relative h-64 overflow-hidden rounded-xl bg-gray-100 shadow-sm md:h-[400px]">
                        <img
                          src="/images/empresa.jpg"
                          alt="Nossa empresa"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* TEXTO */}
                      <div>
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
                          <FaBuilding size={25} />
                        </div>

                        <h2 className="mb-5 text-2xl font-bold text-gray-900 md:text-3xl">
                          Quem somos
                        </h2>

                        <div className="space-y-4 text-sm leading-7 text-gray-600 md:text-base">
                          <p>
                            Somos uma empresa comprometida com a qualidade,
                            transparência e satisfação dos nossos clientes.
                            Trabalhamos constantemente para oferecer produtos
                            e serviços que atendam às necessidades de cada pessoa.
                          </p>

                          <p>
                            Nossa trajetória é construída através da confiança,
                            dedicação e busca contínua por melhorias. Acreditamos
                            que um bom atendimento e um relacionamento transparente
                            são fundamentais para construir parcerias duradouras.
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* VALORES */}
                    <section className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                      {/* MISSÃO */}
                      <div className="rounded-xl border border-gray-200 p-6 transition hover:shadow-md">
                        <FaBullseye
                          size={28}
                          className="mb-4 text-red-600"
                        />

                        <h3 className="mb-2 text-lg font-bold text-gray-900">
                          Nossa missão
                        </h3>

                        <p className="text-sm leading-7 text-gray-600">
                          Oferecer soluções de qualidade, buscando sempre
                          atender às expectativas e necessidades dos nossos clientes.
                        </p>
                      </div>

                      {/* VALORES */}
                      <div className="rounded-xl border border-gray-200 p-6 transition hover:shadow-md">
                        <FaShieldAlt
                          size={28}
                          className="mb-4 text-red-600"
                        />

                        <h3 className="mb-2 text-lg font-bold text-gray-900">
                          Nossos valores
                        </h3>

                        <p className="text-sm leading-7 text-gray-600">
                          Trabalhar com ética, respeito, responsabilidade
                          e transparência em todas as nossas relações.
                        </p>
                      </div>

                      {/* COMPROMISSO */}
                      <div className="rounded-xl border border-gray-200 p-6 transition hover:shadow-md sm:col-span-2 lg:col-span-1">
                        <FaUsers
                          size={28}
                          className="mb-4 text-red-600"
                        />

                        <h3 className="mb-2 text-lg font-bold text-gray-900">
                          Nosso compromisso
                        </h3>

                        <p className="text-sm leading-7 text-gray-600">
                          Construir relacionamentos duradouros através
                          de um atendimento próximo e de qualidade.
                        </p>
                      </div>

                    </section>
                </div>
            </main>
        </>
    )
}