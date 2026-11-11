import {responsiveSizes} from '../../assets/font/font'
import SearchMotos from '../../components/SearchMotos/SearchMotos'
import { useEffect, useState } from 'react';

import { CardsDestaque } from '../../components/CardsDestaque/CardsDestaque';
import { type MotoType } from '../../components/CardsDestaque/CardsDestaque';
import { useApp } from '../../context/Context';
import { FaMotorcycle, FaPhone, FaWhatsapp } from 'react-icons/fa';


const categoriasMotos = [
  {
    nome: "Big Trail",
    icone: <FaMotorcycle size={30}/>,
  },
  {
    nome: "Custom",
    icone: <FaMotorcycle size={30}/>,
  },
  {
    nome: "Off Road",
    icone: <FaMotorcycle size={30}/>,
  },
  {
    nome: "Scooter",
    icone: <FaMotorcycle size={30}/>,
  },
  {
    nome: "Street",
    icone: <FaMotorcycle size={30}/>,
  },
  {
    nome: "Elétrica",
    icone: <FaMotorcycle size={30}/>,
  },
  {
    nome: "Quadriciclo",
    icone: <FaMotorcycle size={30}/>,
  },
];

export default function Home(){

  const [largura, setLargura] = useState(window.innerWidth);

  useEffect(() => {
    const atualizarLargura = () => {
      setLargura(window.innerWidth);
    };

    window.addEventListener("resize", atualizarLargura);

    return () => {
      window.removeEventListener("resize", atualizarLargura);
    };
  }, []);

  const { veiculosData, } = useApp();

  const motosDestaque = veiculosData.slice(0, largura < 768 ? 5 : 10);


    return(

        <>
        <main className='
        flex flex-col relative w-screen h-full py-8 mt-16
        md:mt-10
        '>

            {/* seção banner*/}
            <section className="
              flex items-center justify-between w-screen  min-h-[280px]
              overflow-hidden bg-[radial-gradient(ellipse_at_75%_55%,#5a0a10_0%,#0b0b0c_62%)] px-6 py-4
              md:px-16 md:min-h-[480px] 
              
            ">
            
             <div className='
             flex flex-col justify-center items-center text-center w-full border
             md:w-2/5 md:items-start
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
                
                <div className="flex  gap-3 md:flex-row">
                      <a
                        href="tel:+5543999529363"
                        className="
                        flex items-center gap-2 bg-vermelho-600 hover:bg-vermelho-700 transition
                        text-branco font-extrabold uppercase tracking-widest px-4 py-3
                        [clip-path:polygon(10px_0,100%_0,calc(100%_-_10px)_100%,0_100%)]
                        ">

                        <FaPhone />
                        <span className='text-[10px] md:text-xs'>(43) 99952-9363</span>
                      </a>
                
                      <a
                        href="https://wa.me/5543999175256"
                        target="_blank"
                        rel="noreferrer"
                        className="
                        flex items-center gap-2 bg-verde-600 hover:bg-verde-700 transition
                        text-branco font-extrabold uppercase tracking-widest px-4 py-3
                        [clip-path:polygon(10px_0,100%_0,calc(100%_-_10px)_100%,0_100%)]
                        ">
                        <FaWhatsapp />

                        <span className='text-[10px] md:text-xs'>(43) 99917-5256</span>
                      </a>
                </div>
              

             </div>

            </section>

            {/* seção busca por categoria*/}
            <section className='w-full bg-preto '>
              <div className='
              flex flex-col justify-between gap-2 items-center py-4 mx-2
              md:px-4 md:mx-16
              '>

                  <div className='w-full'>
                  <h5 className='text-vermelho-600 uppercase text-sm font-bold'>categorias</h5>
                  <h3 className='
                  text-2xl font-bold text-branco
                  '>Busque por estilo</h3>
                  </div>
                  
                  <div className='
                  flex flex-wrap gap-2 w-full items-start justify-start pl-1
                  md:justify-between
                  '>
                    {categoriasMotos.map((categoria) => (
                      <button
                        key={categoria.nome}
                        className="
                        flex justify-center items-center gap-4 w-44  bg-vermelho-600 px-3 py-2 
                        md:w-40
                        "
                      >
                        <div className='text-branco'>
                          {categoria.icone}
                        </div>
                        
                        <p className='text-branco text-sm'>{categoria.nome}</p>
                        
                      </button>
                    ))}
                  </div>
              
              </div>
            </section>

            {/* seção busca moto*/}
            <section className='
            flex flex-col justify-center py-5 w-full border border-red-500
            md:p-8 mb:mt-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64'>

                <h1 className='font-bold text-center mb-10' style={{fontSize: responsiveSizes.text.subtitle}}>Encontre a moto dos seus sonhos</h1>

                <SearchMotos/>

                <button className='p-4 bg-preto text-branco font-bold rounded-lg mx-auto'>
                  Ver todos os veiculos
                </button>
            </section>

            {/* seção destaque*/}
            <section className='
            flex flex-col items-center justify-between gap-4 w-full border px-4 mt-8 border-red-500
            md:p-8 lg:px-16 xl:px-32'
            >
                <h1 className='font-bold text-center mb-10' style={{fontSize: responsiveSizes.text.subtitle}}>Confira alguns destaques</h1>
                
                <div className='
                flex flex-col justify-between w-full gap-8 border border-blue-500
                md:flex-row md:flex-wrap md:justify-center
                '>
                    {motosDestaque.map((moto:MotoType)=>(
                      <CardsDestaque moto={moto}/>
                    ))}
                </div>
            
            </section>

            {/* seção instagram */}
            <section className='
            w-full border border-red-500
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

        </main>

        </>


)

}