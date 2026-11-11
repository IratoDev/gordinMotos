import {responsiveSizes} from '../../assets/font/font'
import { BsSpeedometer2 } from 'react-icons/bs';
import { TbManualGearboxFilled } from 'react-icons/tb';
import { PiGasCanFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

export interface MotoImage {
  id: number;
  url: string;
  principal: boolean;
}

interface MotoMarca {
  descricao: string;
}

interface MotoModelo {
  descricao: string;
}

export interface MotoType {
  ano_fab: string;
  ano_mo: string;
  marca: MotoMarca;
  nome:string;
  modelo: MotoModelo;
  versao: string;
  preco: number;
  quilometragem: number;
  cambio: string;
  km:string;
  combustivel: string;
  cidade: string;
  estado: string;
  imagens: MotoImage[];
}

export function CardsDestaque({moto}: {moto: MotoType}){

    const navigate = useNavigate();

    return(
        <div className='
        flex w-full h-full min-h-[calc(100vh-300px)] border border-cinza-300 rounded-lg shadow-md pb-1
         md:max-w-[25vw] md:min-w-72 md:min-h-[calc(100vh-200px)] md:pb-4
        '
        >
            <button className='flex flex-col flex-1 ' onClick={()=>navigate('/info', { state: { moto } })}>

                <div className='w-full h-full max-h-[50%]'>
                  <img className='w-full h-full object-cover object-center rounded-t-lg' src={moto?.imagens?.find((img)=> img.principal === true )?.url}/>
                </div>

                <div className='flex flex-col justify-between text-start flex-1 w-full max-h-[50%] py-3 px-2'>
                  
                  <div className='w-full'>
                    <p className="text-cinza-600 font-semibold" style={{fontSize: responsiveSizes.text.small}}>{moto.ano_fab}/{moto.ano_mo}</p>
                    <h3 className="text-preto font-bold" style={{fontSize: responsiveSizes.text.medium}}>{moto.marca?.descricao} {moto.nome}</h3>
                    <p className="text-cinza-600 font-semibold" style={{fontSize: responsiveSizes.text.small}}>{moto.modelo?.descricao}</p>
                  </div>
                  
                  <h3 className='text-verde-600 font-bold' style={{fontSize: responsiveSizes.text.subtitle}}>R$ {moto.preco}</h3>
                  
                  <p className="text-cinza-600" style={{fontSize: responsiveSizes.text.small}}>{moto.cidade}</p>
                
                </div>

                <div className='flex justify-between gap-2 px-1 py-2 '>

                    <div className='flex flex-col justify-between items-center gap-1 bg-cinza-200 w-1/3 p-2 rounded-lg'> 
                      <TbManualGearboxFilled className='text-vermelho-500 scale-150' />
                      <p className='font-medium leading-4 text-black' style={{fontSize: responsiveSizes.text.small}}>{moto.cambio}</p>
                    </div>

                    <div className='flex flex-col justify-between items-center gap-1 bg-cinza-200 w-1/3 p-2 rounded-lg'> 
                      <BsSpeedometer2 className='text-vermelho-500 scale-150' />
                       <p className='font-medium leading-4 text-black' style={{fontSize: responsiveSizes.text.small}}>{moto.km}</p>
                    </div>

                    <div className='flex flex-col justify-between items-center gap-1 bg-cinza-200 w-1/3 p-2 rounded-lg'>
                       <PiGasCanFill className='text-vermelho-500 scale-150'/> 
                       <p className='font-medium leading-4 text-black' style={{fontSize: responsiveSizes.text.small}}>{moto.combustivel}</p>
                    </div>
                </div>
            
            </button>
                      
        </div>
    )
}