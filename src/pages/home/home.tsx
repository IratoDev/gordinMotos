import {responsiveSizes} from '../../assets/font/font'
import SearchMotos from '../../components/SearchMotos/SearchMotos'
import { useEffect, useState } from 'react';

import { CardsDestaque } from '../../components/CardsDestaque/CardsDestaque';
import { useApp} from '../../context/Context';
import { FaArrowRight, FaHandHoldingUsd, FaMotorcycle, FaShieldAlt, FaTools, FaWhatsapp } from 'react-icons/fa';
import type { Veiculos } from '../../context/dataTypes';
import { CarrosselAvaliacoes } from '../../components/carousel/Avaliação/CarroselAvaliacao';
import motosBanner from "../../assets/image/motosbanner2.jpg"
import { useNavigate } from 'react-router-dom';
import imgCloud from "../../assets/image/clouds.3c700c13.webp"


export default function Home(){

  const navigate = useNavigate();
  const [largura, setLargura] = useState(window.innerWidth);
  const [mostrarTodasMarcas, setMostrarTodasMarcas] = useState(false);

  useEffect(() => {
    const atualizarLargura = () => {
      setLargura(window.innerWidth);
    };

    window.addEventListener("resize", atualizarLargura);

    return () => {
      window.removeEventListener("resize", atualizarLargura);
    };
  }, []);

  const { vehicles, brands, assessment } = useApp();

  const motosDestaque = vehicles.slice(0, largura < 768 ? 5 : 10);

  const diferenciais = [
  {
    icone: <FaTools size={22} />,
    titulo: 'Seminovas revisadas',
    texto: 'Cada moto passa por revisão antes de ir para a loja.',
  },
  {
    icone: <FaShieldAlt size={22} />,
    titulo: 'Procedência garantida',
    texto: 'Documentação conferida e histórico transparente.',
  },
  {
    icone: <FaHandHoldingUsd size={22} />,
    titulo: 'Financiamento facilitado',
    texto: 'Simule e envie os dados direto pelo WhatsApp.',
  },
  ];




    return(

        <>
        <main className='
        flex flex-col relative w-screen h-full  mt-16
        md:mt-10
        '>

            {/* seção banner*/}
            <section className="
              flex items-center justify-between w-screen relative min-h-[450px]
              overflow-hidden px-6 py-4 max-md:bg-[position:80%_center]
              md:px-16
              2xl:min-h-[680px]
              md:min-h-[580px]
            "
            style={{backgroundImage: `url(${motosBanner})`, backgroundRepeat: "no-repeat", backgroundSize:"cover",}}
            >
            
             <div className='
             flex flex-col justify-center items-center text-center w-full
             bg-black/50 p-5 rounded-lg mt-10
             md:bg-transparent
             xl:w-2/5
             md:w-3/5 md:items-start
             '>

                <div className='flex-1'>
                
                  <h1
                  style={{fontSize: responsiveSizes.text.title}}  
                  className='
                  italic uppercase leading-tight font-extrabold text-branco
                  md:text-left
                  '>
                  a moto dos seus <span className='text-vermelho-600'>sonhos</span> está aqui
                  </h1>

                  <p  className='
                  font-medium text-center text-wrap mb-10 pr-6 text-branco
                  md:text-left
                  ' style={{fontSize: responsiveSizes.text.small}}>
                    Seminovas revisadas, procedencia garantida e financiamento facilitado.
                    <span className='font-bold' > Fale direto com a gente:</span>
                  </p>
                </div>  
                
                <div className="
                flex flex-col gap-3 
                md:flex-row
                ">
                      <button
                      type='button'
                        onClick={() => navigate("/Veiculos")}
                         className="
                         z-10
                        inline-flex items-center justify-center gap-3
                        bg-vermelho-600 hover:bg-vermelho-700
                        text-branco font-extrabold uppercase
                        tracking-wider px-7 py-4 rounded-md
                        transition duration-300 text-sm
                        "
                      >
                        Ver estoque
                        <FaArrowRight />
                      </button>

                      <button
                        onClick={() =>
                          window.open(
                            "https://wa.me/5543999175256",
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                        className="
                        z-10
                        inline-flex items-center justify-center gap-3
                        border border-white/40
                        bg-white/10 hover:bg-white/20
                        backdrop-blur-sm
                        text-branco font-bold
                        px-7 py-4 rounded-md
                        transition duration-300 text-sm
                        "
                      >
                        <FaWhatsapp size={25}/>
                        Fale conosco
                      </button>
                </div>
              

             </div>

          
              <div className="cloud">
                  <img src={imgCloud} alt="" className="img_cloud"/>
              </div>
            </section>


            {/* seção diferenciais */}
            <section className="px-4 py-12 md:px-8 lg:px-16 xl:px-32 2xl:px-64 shadow-md border border-cinza-300">
              <div className="grid gap-4 md:grid-cols-3">
                {diferenciais.map((item) => (
                  <div
                    key={item.titulo}
                    className="flex items-start gap-4 border-l-4 border-vermelho-600 pl-4 py-2"
                  >
                    <div className="mt-1 text-vermelho-600">{item.icone}</div>
                    <div>
                      <h3 className="font-bold text-lg">{item.titulo}</h3>
                      <p className="text-sm text-neutral-600">{item.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* seção busca por categoria*/}
            <section className="
              bg-preto
              px-5 py-8
              md:px-12 lg:px-20 xl:px-32
            ">
              <div className="mb-8">

                <span className="
                  text-vermelho-500
                  uppercase font-bold tracking-widest text-xs
                ">
                  Encontre sua preferência
                </span>

                <h2 className="text-branco text-3xl font-extrabold mt-2">
                  Explore por marcas
                </h2>

                <p className="text-gray-400 mt-2">
                  Confira as fabricantes disponíveis em nosso estoque.
                </p>

              </div>

              <div className="
                hidden md:grid
                md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6
                gap-3
              ">
                {brands.map((marca) => (
                  <button
                    key={marca.public_id}
                    onClick={() =>
                      navigate(`/veiculos?marca=${marca.public_id}`)
                    }
                    className="
                      flex flex-col items-center justify-center
                      gap-3 min-h-24 p-2
                      rounded-lg border border-white/10
                      bg-white/5 text-white
                      hover:border-vermelho-600
                      hover:bg-white/10 transition duration-300
                    "
                  >
                    <FaMotorcycle size={25} className="text-vermelho-500" />
                  
                    <p className="text-sm font-semibold text-center line-clamp-1">
                      {marca.descricao}
                    </p>
                  </button>
                ))}
              </div>

              <div className="
                grid grid-cols-2 gap-3
                md:hidden
              ">
              
                {brands
                  .slice(0, mostrarTodasMarcas ? brands.length : 5)
                  .map((marca) => (
                  
                    <button
                      key={marca.public_id}
                      onClick={() =>
                        navigate(`/veiculos?marca=${marca.public_id}`)
                      }
                      className="
                        flex flex-col items-center justify-center
                        gap-3 min-h-24 p-2
                        rounded-lg border border-white/10
                        bg-white/5 text-white
                        hover:border-vermelho-600
                        hover:bg-white/10
                        transition duration-300
                      "
                    >
                      <FaMotorcycle
                        size={25}
                        className="text-vermelho-500"
                      />

                      <p className="text-sm font-semibold text-center line-clamp-1">
                        {marca.descricao}
                      </p>
                    </button>

                  ))}

              </div>
                
              {/* botão ver mais - somente celular */}
              {brands.length > 5 && (
                <button
                  onClick={() => setMostrarTodasMarcas(!mostrarTodasMarcas)}
                  className="
                    mt-5 w-full py-3
                    text-vermelho-500 font-semibold text-sm
                    border border-vermelho-500/40
                    rounded-lg
                    hover:bg-vermelho-500/10
                    transition
                    md:hidden
                  "
                >
                  {mostrarTodasMarcas
                    ? 'Ver menos categorias'
                    : 'Ver mais categorias'}
                </button>
              )}

            </section>

            {/* seção busca moto*/}
            <section className='
            flex flex-col justify-center py-5 w-full px-4 
            md:p-8 md:px-8 md:mt-8 
            lg:px-16 
            xl:px-32 
            2xl:px-64'>

                <h1 className='font-bold text-center mb-10' style={{fontSize: responsiveSizes.text.subtitle}}>Encontre a moto dos seus sonhos</h1>

                <SearchMotos/>

                <button
                onClick={()=>navigate('/Veiculos')} 
                className='p-4 bg-preto text-branco font-bold rounded-lg mx-auto mt-5'>
                  Ver todos os veiculos
                </button>
            </section>

            {/* seção destaque*/}
            <section
              id="destaques"
              className="
                bg-white px-5 py-16
                md:px-12 lg:px-20 xl:px-32
              "
            >
              <div className="
                flex flex-col md:flex-row
                md:items-end md:justify-between
                gap-4 mb-10
              ">
              
                <div>
                          
                  <span className="
                    text-vermelho-600
                    uppercase font-bold tracking-widest text-xs
                  ">
                    Oportunidades para você
                  </span>
                          
                  <h2 className="
                    text-3xl md:text-4xl
                    font-extrabold text-gray-900 mt-2
                  ">
                    Motos em destaque
                  </h2>
                          
                  <p className="text-gray-500 mt-2">
                    Confira alguns dos modelos disponíveis.
                  </p>
                          
                </div>
                          
                <button
                  onClick={() => navigate('/veiculos')}
                  className="
                    flex items-center gap-2
                    font-bold text-vermelho-600
                    hover:text-vermelho-700 transition
                  "
                >
                  Ver estoque completo
                  <FaArrowRight />
                </button>
                          
              </div>
                          
              {motosDestaque.length > 0 ? (
              
                <div className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                  gap-x-8 gap-y-10
                  w-full
                  
                ">
                  {motosDestaque.map((moto: Veiculos) => (
                    <CardsDestaque
                      key={moto.public_id}
                      moto={moto}
                    />
                  ))}
                </div>
            
              ) : (
              
                <div className="
                  text-center py-16
                  rounded-xl bg-gray-50
                ">
                  <FaMotorcycle
                    size={40}
                    className="mx-auto text-gray-300 mb-4"
                  />
            
                  <h3 className="font-bold text-gray-700 text-xl">
                    Nenhum veículo em destaque
                  </h3>
              
                  <p className="text-gray-500 mt-2">
                    Volte em breve para conferir nossas novidades.
                  </p>
                </div>
            
              )}
            </section>

            {/* seção carrosel */}
            {assessment.length > 0 && (
            <section className='flex flex-col items-center justify-between gap-4 w-full px-4 mt-8 
            md:p-8 lg:px-16 xl:px-32'>
              <CarrosselAvaliacoes avaliacoes={assessment}/>
            </section>
            
            )}

            {/* seção instagram */}
            <section className='
            w-full
            md:p-8 mb:mt-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'
            >
                <div className="w-full flex justify-center px-2 sm:px-4">
                  <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <iframe
                      src="https://www.instagram.com/gordinmotosmultimarcas/embed/?cr=1&v=12&wp=934&rd=https%3A%2F%2Fwww.gordinmotos.com.br&rp=%2F"
                      title="Instagram Gordin Motos Multimarcas"
                      className="block w-full min-h-[500px] sm:min-h-[650px] lg:min-h-[844px] border-0"
                      allowTransparency={true}
                      allowFullScreen
                      loading="lazy"
                      scrolling="no"
                    />
                  </div>
                </div>
            </section>

            {/*  seção chamada final */}
            <section className="
              relative overflow-hidden
              bg-preto
              px-5 py-16
              -mb-7
              md:px-12 md:py-20
            ">
            
              <div className="
                absolute right-0 top-0
                w-1/3 h-full
                bg-vermelho-600/10
                -skew-x-12 translate-x-20
              " />

              <div className="
                relative z-10
                max-w-4xl mx-auto
                text-center
              ">
              
                <span className="
                  text-vermelho-500
                  uppercase font-bold tracking-widest text-xs
                ">
                  Estamos aqui para ajudar
                </span>

                <h2 className="
                  text-branco
                  text-3xl md:text-5xl
                  font-extrabold italic uppercase
                  mt-3
                ">
                  Ainda não encontrou sua próxima moto?
                </h2>

                <p className="
                  text-gray-300 mt-5 mb-8
                  text-base md:text-lg
                ">
                  Conte para nossa equipe o que você procura.
                  Vamos ajudar você a encontrar a moto ideal.
                </p>

                <a
                  href={"https://wa.me/5543999175256"}
                  target="_blank"
                  rel="noreferrer"
                  className="
                    inline-flex items-center justify-center gap-3
                    bg-vermelho-600 hover:bg-vermelho-700
                    text-branco font-extrabold uppercase
                    tracking-wider px-8 py-4 rounded-lg
                    transition duration-300
                  "
                >
                  <FaWhatsapp size={22} />
                  Falar com um consultor
                </a>

              </div>

            </section>

        </main>

        </>


)

}