import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/NavBar";
import Home from "./pages/home/home";
import About from "./pages/about/about";
import Vehicles from "./pages/vehicles/vehicles";
import Assessment from "./pages/assessment/assessment";
import Contact from "./pages/contact/contact";
import Footer from "./components/Baseboard/BaseBoard";
import { Info } from "./pages/info/info";
import { ContextProvider, useApp } from "./context/Context";
import LoginModal from "./components/modal/modalLoginCliente";
import CadastroModal from "./components/modal/modalRegisterClient";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";

function Modais() {
  const { modal, setModal } = useApp();

  return (
    <>
      <LoginModal
        aberto={modal === 'login'}
        fechar={() => setModal(null)}
        irParaCadastro={() => setModal('cadastro')}
      />

      <CadastroModal
        aberto={modal === 'cadastro'}
        fechar={() => setModal(null)}
        irParaLogin={() => setModal('login')}
      />
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ContextProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Sobre" element={<About />} />
          <Route path="/Veiculos" element={<Vehicles />} />
          
          <Route element={<PrivateRoute/>}>
            <Route path="/Avaliacoes" element={<Assessment />} />
          </Route>
  
          <Route path="/Contato" element={<Contact />} />
          <Route path="/Info" element={<Info />} />
        </Routes>


        <Modais />
        <Footer />
      </ContextProvider>
    </BrowserRouter>
  );
}