
import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
  type ReactNode,
  useEffect
} from "react";
import type { Assessment, Categorias, Cores, Marcas, Veiculos } from "./dataTypes";
import { api } from "../service/apiClient";
import { getToken } from "../lib/cookie";
import {  getFavoritos, } from "../hooks/favoritos/favoritosHooks";



interface AppContextData {
  vehicles: Veiculos[];
  colors: Cores[];
  brands: Marcas[];
  categoris: Categorias[];
  assessment: Assessment[];
  veiculosFavoritos: Veiculos[];

  modal: "login" | "cadastro" | null;
  toggleFavorito: (e:any)=> void
  setModal: Dispatch<SetStateAction<"login" | "cadastro" | null>>;
  loggedIn: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
}

interface Props {
  children: ReactNode;
}

const Context = createContext<AppContextData | null>(null);

// ==========================================
// PROVIDER
// ==========================================

export function ContextProvider({ children }: Props) {

  const [modal, setModal] = useState<"login" | "cadastro" | null>(null);
  const [loggedIn, setLoggedIn] = useState(false)
  
  const [vehicles, setVehicles] = useState<Veiculos[]>([])
  const [brands, setBrands] = useState<Marcas[]>([]) //marcas
  const [assessment, setAssessment] = useState<Assessment[]>([])
  const [colors, setColors] = useState<Cores[]>([])
  const [categoris, setCategoris] = useState<Categorias[]>([])
  
  const [favoritosList, setFavoritoList] = useState<string[]>([]);


  
  const listDatas = [

    {data: "veicles" , rota:"vehicles/all/vehicles", set: setVehicles},
    {data: "brands" , rota:"brands/all", set: setBrands},

    {data: "colors" , rota:"color/all", set: setColors},
    {data: "categoris" , rota:"categori/all", set: setCategoris},
    {data: "assessment" , rota:"assessment/all/assessment", set: setAssessment}

  ]

  const loadData = async ()=>{
      
      await Promise.all(
  
        listDatas.map(async (data)=>{

            const response = await api.get(data.rota) 
          
            data.set(response.data)
    
        })
        
      )

  }

  // data list do site
  useEffect(()=>{

  (()=>{ 

    const token = getToken()
    
    if(token){
      setLoggedIn(true)
    }

  })()

  setFavoritoList(getFavoritos())

  loadData()

  },[])

  // favoritos
  useEffect(() => {
  setFavoritoList(getFavoritos()); 
  }, []);


  const toggleFavorito = (id: string) => {
  setFavoritoList(prev => {
    const existe = prev.includes(id);

    const atualizados = existe
      ? prev.filter(favorito => favorito !== id)
      : [...prev, id];

    localStorage.setItem(
      "veiculosFavoritos",
      JSON.stringify(atualizados)
    );

      return atualizados;
    });
  };

  const veiculosFavoritos = vehicles.filter(v =>
  favoritosList.includes(v.public_id)
  );


  return (
    <Context.Provider value={{ 
      vehicles,
      brands,
      colors,
      categoris,
      assessment,
      veiculosFavoritos,
      toggleFavorito,
      modal, 
      setModal, 
      loggedIn, 
      setLoggedIn
      }}>

      {children}
    
    </Context.Provider>
  );
}



export function useApp(): AppContextData {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useApp deve ser utilizado dentro de ContextProvider");
  }

  return context;
}
