import {responsiveSizes} from '../../assets/font/font'
import { BsSpeedometer2 } from 'react-icons/bs';
import { TbManualGearboxFilled } from 'react-icons/tb';
import { PiGasCanFill } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import type { Veiculos } from '../../context/dataTypes';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { getFavoritos,  } from '../../hooks/favoritos/favoritosHooks';
import { useApp } from '../../context/Context';


export interface MotoImage {
  id: number;
  url: string;
  principal: boolean;
}




export function CardsDestaque({moto}: {moto: Veiculos}){

    const [btnFavoritos, setBtnFavoritos] = useState(() =>
    getFavoritos().includes(moto.public_id)
    );  

    const {toggleFavorito} = useApp()

    const navigate = useNavigate();

    const handelFavoritos = (e: React.MouseEvent) => {
    e.stopPropagation();

    toggleFavorito(moto.public_id);
  
    setBtnFavoritos(prev => !prev);
    };

    useEffect(()=>{
      setBtnFavoritos(getFavoritos().includes(moto.public_id))
    },[toggleFavorito])

    return(
        <div className='
        flex flex-col w-full h-full min-h-[calc(100vh-300px)] border border-cinza-300 rounded-lg shadow-md pb-1
         md:max-w-[25vw] md:min-w-72 md:min-h-[calc(100vh-200px)] md:pb-4
        '
        >
            

            <button className='flex flex-col flex-1 z-9' onClick={()=>navigate('/info', { state: { moto } })}>
                <div className='relative w-full h-full max-h-[50%]'>
                    <button 
                    onClick={handelFavoritos}
                    className='absolute top-2 right-2 border z-10 flex items-center justify-center
                    w-10 h-10 rounded-full
                  bg-white/90 shadow-md
                  text-cinza-500' 
                    >
                
                    {btnFavoritos ?(
                      <FaHeart />
                    ):(
                      <FaRegHeart />
                    )}
                    </button>

                    <img className='w-full h-full object-cover object-center rounded-t-lg' src={moto?.imagens?.find((img)=> img.principal === true )?.url}/>
                </div>


                <div className='flex flex-col justify-between text-start flex-1 w-full max-h-[50%] py-3 px-2'>
                  
                  <div className='w-full'>
                    <p className="text-cinza-600 font-semibold" style={{fontSize: responsiveSizes.text.small}}>{moto.ano_fab}/{moto.modelo.ano_mod}</p>
                    <h3 className="text-preto font-bold" style={{fontSize: responsiveSizes.text.medium}}>{moto.marca?.descricao} {moto.nome}</h3>
                    <p className="text-cinza-600 font-semibold" style={{fontSize: responsiveSizes.text.small}}>{moto.modelo?.descricao}</p>
                  </div>
                  
                  <h3 className='text-verde-600 font-bold' style={{fontSize: responsiveSizes.text.subtitle}}>R$ {moto.preco}</h3>
                  
                  <p className="text-cinza-600" style={{fontSize: responsiveSizes.text.small}}>arapongas</p>
                
                </div>

                <div className='flex justify-between gap-2 px-1 py-2 '>

                    <div className='flex flex-col justify-between items-center gap-2 min-w-0 bg-cinza-200 w-1/3 p-2 rounded-lg'> 
                      <TbManualGearboxFilled className='text-vermelho-500 scale-150' />
                      <p className='font-medium leading-4 text-black truncate w-full  text-xs'>{moto.cambio}</p>
                    </div>

                    <div className='flex flex-col justify-between items-center gap-2 bg-cinza-200 w-1/3 p-2 rounded-lg'> 
                      <BsSpeedometer2 className='text-vermelho-500 scale-150' />
                       <p className='font-medium leading-4 text-black text-xs'>{moto.km}</p>
                    </div>

                    <div className='flex flex-col justify-between items-center gap-2 bg-cinza-200 w-1/3 p-2 rounded-lg'>
                       <PiGasCanFill className='text-vermelho-500 scale-150'/> 
                       <p className='font-medium leading-4 text-black text-xs'>{moto.combustivel}</p>
                    </div>
                </div>
            
            </button>
                      
        </div>
    )
}