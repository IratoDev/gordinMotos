import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import type { Assessment, Categorias, Clientes, Cores, Marcas, Usuarios, Veiculos } from "./dataTypes";
import { api } from "../service/apiClient";

interface Props {
  children: ReactNode;
}

const Context = createContext<any | null>(null);

export function ContextProvider({ children }: Props) {

  const [users, setUsers] = useState<Usuarios[]>([])
  const [clients, setClients] = useState<Clientes[]>([])
  
  const [vehicles, setVehicles] = useState<Veiculos[]>([])
  const [brands, setBrands] = useState<Marcas[]>([]) //marcas

  const [colors, setColors] = useState<Cores[]>([])
  const [categoris, setCategoris] = useState<Categorias[]>([])

  const [assessment, setAssessment] = useState<Assessment[]>([])

  const [refresh, setRefresh] = useState(true)


  const listDatas = [
    {data: "users" , rota:"user/all", set: setUsers},
    {data: "clients" , rota:"client/all", set: setClients},
    {data: "veicles" , rota:"vehicles/all", set: setVehicles},
    {data: "brands" , rota:"brands/all", set: setBrands},

    {data: "colors" , rota:"color/all", set: setColors},
    {data: "categoris" , rota:"categori/all", set: setCategoris},
    {data: "assessment" , rota:"assessment/all/assessment/pendet", set: setAssessment},
    {data: "veicles" , rota:"vehicles/all", set: setVehicles},
  ]

  const loadData = async ()=>{
      
      await Promise.all(
  
        listDatas.map(async (data)=>{

            const response = await api.get(data.rota) 
          
            data.set(response.data)
    
        })
        
      )

  }

  useEffect(()=>{

    loadData()

  },[refresh])
 

  return (
    <Context.Provider
        /* aqui exporta os estados e funçoes */
      value={{ 
        users, 
        clients, 
        vehicles, 
        brands, 
        colors, 
        categoris, 
        setRefresh,
        assessment,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useApp() {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useContext deve ser utilizado dentro de ContextProvider");
  }

  return context;
}