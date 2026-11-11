import {BrowserRouter,Routes, Route} from "react-router-dom";
import Navbar from "./components/Navbar/NavBar";
import  Home  from "./pages/home/home";
import About from "./pages/about/about";
import Vehicles from "./pages/vehicles/vehicles";
import Assessment from "./pages/assessment/assessment";
import Contact from "./pages/contact/contact";

import Footer from "./components/Baseboard/BaseBoard";
import Financing from "./pages/financing/financing";
import { Info } from "./pages/info/info";
import { ContextProvider } from "./context/Context";


export default function AppRouter(){

return(
<BrowserRouter>

<ContextProvider>
<Navbar/>

<Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/Sobre" element={<About/>}/>
    <Route path="/Veiculos" element={<Vehicles/>}/>
    <Route path="/Avaliacoes" element={<Assessment/>}/>
    <Route path="/Contato" element={<Contact/>}/>
    <Route path="/Financiamento" element={<Financing/>}/>
    <Route path="/Info" element={<Info/>}/>

</Routes>

<Footer/>

</ContextProvider>

</BrowserRouter>
)

}