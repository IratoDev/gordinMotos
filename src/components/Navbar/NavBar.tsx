import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {LogoMobile, LogoDesktop} from '../Logo/Logo'
import {
  FaHeart,
  FaBars,
  FaTimes,
} from "react-icons/fa";


import {responsiveSizes} from '../../assets/font/font'
import { Inpunt } from "../ui/input";
import { FaMagnifyingGlass } from "react-icons/fa6";

interface LinkNav {
  nome: string;
  href: string;
}

interface ModalFavoritosProps {
  aberto: boolean;
  fechar: () => void;
}

interface NavMobileProps {
  menuAberto: boolean;
  setMenuAberto: (aberto: boolean) => void;
  links: LinkNav[];
  abrirFavoritos: () => void;
}

export default function Navbar() {
  
  const [largura,] = useState(window.innerWidth);
  const [menuAberto, setMenuAberto] = useState(false);
  const [favoritosAberto, setFavoritosAberto] = useState(false);

  // troca por router-navigation
  const links = [
    { nome: "Estoque", href: "/Veiculos" },
    { nome: "Avaliação", href: "/Avaliacoes" },
    { nome: "Financiamento", href: "/Financiamento" },
    { nome: "Empresa", href: "/Sobre" },
    { nome: "Contato", href: "/Contato" },
  ] as LinkNav[];

  const navigate = useNavigate();


  return (
    <header className="fixed top-0 left-0 z-50 w-screen shadow-md">
    <nav className="w-full bg-preto shadow-md">
      <div className="flex w-full items-center justify-between px-8 md:px-4 py-3">

        {/* Logo */}
        {largura < 768 ? <LogoMobile/> : <LogoDesktop/>}
       
        {/* Botão mobile */}
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          className="text-2xl text-branco md:hidden"
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
        >
          {menuAberto ? <FaTimes /> : <FaBars />}
        </button>

        {/* Componente de pesquisa*/}
        <div className="
        hidden w-full
        md:flex md:px-5
        ">
          
          <SerchVeicles/>
       
        </div>

        {/* Navegação */}
        <div
          className={`
            hidden absolute left-0 top-[80px] z-50 w-full bg-preto p-5 shadow-md
            md:static md:flex md:items-center md:gap-4  md:px-2 md:py-0 md:shadow-none md:justify-end
          `}
        >

          {/* Links */}
          <ul className="
          flex gap-4 flex-row items-center
           xl:gap-2
           lg:gap-1
          ">
            {links.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => navigate(`${link.href}`)}
                  style={{ fontSize: responsiveSizes.text.small }}
                  className=" text-branco transition-colors hover:text-vermelho-600 leading-4 font-semibold p-1"
                >
                  {link.nome}
                </button>
              </li>
            ))}

            {/* Favoritos */}
            <li>
              <button
                onClick={()=> setFavoritosAberto(true)}
                style={{ fontSize: responsiveSizes.text.small }}
                className="flex items-center gap-2 text-branco hover:text-red-600 leading-4 font-semibold p-2"
              >
                <FaHeart className="text-red-600" />
                Favoritos
              </button>
            </li>
          </ul>

        </div>        

      </div>
    </nav>

    {/* MENU MOBILE */}
      <NavMobile
        menuAberto={menuAberto}
        setMenuAberto={setMenuAberto}
        links={links}
        abrirFavoritos={() => {
          setMenuAberto(false);
          setFavoritosAberto(true);
        }}
      />

      {/* MODAL FAVORITOS */}
      <ModalFavoritos
        aberto={favoritosAberto}
        fechar={() => setFavoritosAberto(false)}
      />
    </header>
  );
}


function NavMobile({
  menuAberto,
  setMenuAberto,
  links,
  abrirFavoritos,
}: NavMobileProps) {

  const navigate = useNavigate();

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={() => setMenuAberto(false)}
        className={`
          fixed inset-0 top-0 z-40 bg-black/50 min-h-screen
          transition-opacity duration-300 md:hidden
          ${
            menuAberto
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }
        `}
      />

      {/* MENU LATERAL */}
      <aside
        className={`
          fixed right-0 top-0 z-50
          flex min-h-screen 
          w-1/2 min-w-[260px] max-w-[400px]
          bg-preto p-5 shadow-xl
          transition-transform duration-300 ease-in-out
          md:hidden
          ${
            menuAberto
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        <div className="flex flex-1 flex-col justify-between w-full h-screen py-5">
            <ul className="flex flex-col gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() =>{ setMenuAberto(false); navigate(`${link.href}`)}}
                    style={{ fontSize: responsiveSizes.text.medium}}
                    className="block font-medium text-branco transition-colors hover:text-vermelho-600"
                  >
                    {link.nome}
                  </button>
                </li>
              ))}

              {/* FAVORITOS */}
              <li>
                <button
                  onClick={abrirFavoritos}
                  className="flex items-center gap-2 font-medium text-branco hover:text-vermelho-600"
                >
                  <FaHeart className="text-red-600" />
                  Favoritos
                </button>
              </li>
            </ul>
            
        </div>
      </aside>
    </>
  );
}

function ModalFavoritos({
  aberto,
  fechar,
}: ModalFavoritosProps) {
  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={fechar}
        className={`
          fixed inset-0 z-[60] bg-black/60
          transition-opacity duration-300
          ${
            aberto
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          }
        `}
      />

      {/* PAINEL LATERAL */}
      <aside
        className={`
          fixed right-0 top-0 z-[70]
          h-dvh w-full max-w-[420px]
          bg-white p-5 shadow-2xl
          transition-transform duration-300 ease-in-out
          ${
            aberto
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <FaHeart className="text-red-600" />
            Favoritos
          </h2>

          <button
            onClick={fechar}
            className="text-xl text-gray-600 transition-colors hover:text-red-600"
            aria-label="Fechar favoritos"
          >
            <FaTimes />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="mt-6">
          <p className="text-center text-gray-500">
            Você ainda não possui veículos favoritos.
          </p>
        </div>
      </aside>
    </>
  );
}

function SerchVeicles(){

  return(
    <div className="flex w-full gap-4 border px-2">
      <Inpunt
      type='text' 
      name='serch'
      value='' 
      handleChange={()=> alert('teste')}
      placeholder='Busque por nome'
      />

      <button className="text-branco p-4 rounded-lg border text-sm">
        <FaMagnifyingGlass />
      </button>
    </div>
  )

}
