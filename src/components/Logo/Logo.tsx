import { useNavigate } from "react-router-dom";
import  Mobile  from "../../assets/image/Logo Mobile.png";
import  Desktop  from "../../assets/image/Logo Desktop.png";


export function LogoDesktop() {

const navigate = useNavigate();

return (
<div className="w-full max-w-60 h-auto max-h-20">
    <button
    onClick={() => navigate('/')} 
    className="flex-1 w-full" 
    >
    <img alt="Gordin Motos Multimarcas" src={Desktop} className="w-full h-full object-cover object-center"/>
    </button>
</div>
)

}

export function LogoMobile() {

const navigate = useNavigate();

return (
<div className="flex w-full max-w-32 h-auto max-h-20 ">
    <button
    onClick={() => navigate('/')}
    className="flex-1 w-full" 
    >
    <img alt="Gordin Motos Multimarcas" src={Mobile} className="w-full h-full object-cover object-center"/>
    </button>

</div>   
)

}