import { useNavigate } from "react-router-dom";
import  Mobile  from "../../assets/image/Logo Mobile.png";
import  Desktop  from "../../assets/image/Logo Desktop.png";
import { useEffect, useState } from "react";


export function Logo() {

const [largura, setLargura] = useState(window.innerWidth);
const navigate = useNavigate();

 useEffect(() => {
    const atualizarLargura = () => {
      setLargura(window.innerWidth);
    };

    window.addEventListener("resize", atualizarLargura);

    return () => {
      window.removeEventListener("resize", atualizarLargura);
    };
  }, []);

return (
<div className={`w-full ${largura > 760 ? "max-w-60" : " max-w-24"} h-auto max-h-20 `}>
    <button
    onClick={() => navigate('/')} 
    className="flex-1 w-full" 
    >
    {largura > 760 ?(
        
        <img alt="Gordin Motos Multimarcas" src={Desktop} className="w-full h-full object-cover object-center"/>
        
    ):(
        
        <img alt="Gordin Motos Multimarcas" src={Mobile} className="w-full h-full object-cover object-center"/>

    )}
    </button>
</div>
)

}
