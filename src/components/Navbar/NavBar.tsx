import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaHeart,
  FaBars,
  FaTimes,
  FaUserPlus,
  FaSignInAlt,
  FaTrash,
} from "react-icons/fa";


import {responsiveSizes} from '../../assets/font/font'
import { useApp } from "../../context/Context";
import { removeTokens } from "../../lib/cookie";
import type { Veiculos } from "../../context/dataTypes";
import { Logo } from "../Logo/Logo";

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
  
  const [menuAberto, setMenuAberto] = useState(false);
  const [favoritosAberto, setFavoritosAberto] = useState(false);

  // troca por router-navigation
  const links = [
    { nome: "Estoque", href: "/Veiculos" },
    { nome: "Avaliação", href: "/Avaliacoes" },
    { nome: "Empresa", href: "/Sobre" },
    { nome: "Contato", href: "/Contato" },
  ] as LinkNav[];

  const navigate = useNavigate();

  const {loggedIn, setModal} = useApp()

  const deslog = () =>{
    removeTokens()
    window.location.reload();
    return
  }

  return (
    <header className="fixed top-0 left-0 z-50 w-screen shadow-md">
    <nav className="w-full bg-preto shadow-md ">
      <div className="flex w-full items-center justify-between px-8 md:px-4 py-3">

        {/* Logo */}
        <Logo/>
       
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

        {/* Navegação */}
        <div
          className={`
            hidden absolute left-0 top-[80px] z-50 w-full bg-preto shadow-md
            md:static md:flex md:items-center md:shadow-none md:justify-end 
          `}
        >

          {/* Links */}
          <ul className="
          flex gap-4 flex-row items-center
           xl:gap-2
           lg:gap-1
           md:gap-1
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

        {/* Sign in & Sign up */}
        {!loggedIn ? (

          <div className="
          hidden items-center gap-4 
          md:flex md:px-2
          ">

            <button
              className="
              flex items-center gap-2 px-4 py-3 font-bold  justify-center
              border border-vermelho-600 text-branco rounded-md
              hover:bg-vermelho-600 transition
              "
              style={{ fontSize: responsiveSizes.text.small }}
              onClick={()=> setModal("login")}
            >
              <FaSignInAlt />
              Entrar
            </button>

            <button
              className="
              flex items-center gap-2 px-4 py-3 font-bold  justify-center
              bg-vermelho-600 text-branco rounded-md
              hover:bg-vermelho-700 transition
              "
              style={{ fontSize: responsiveSizes.text.small }}
              onClick={()=> setModal("cadastro")}
            >
              <FaUserPlus />
              Cadastrar
            </button>

          </div>

          ):(

          <div className=" hidden flex-col items-center gap-4 px-5
          md:flex">

            <button
              className="
              flex items-center gap-2 px-4 py-3 text-sm font-bold  justify-center
              bg-vermelho-600 text-branco rounded-md
              hover:bg-vermelho-700 transition
              "
              style={{ fontSize: responsiveSizes.text.medium }}
              onClick={()=> deslog() }
            >
              <FaUserPlus />
              Sair
            </button>

          </div>

          )}       

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

  const {loggedIn, setModal} = useApp()

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
          flex flex-col min-h-screen 
          justify-center
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
        <div className="flex flex-1 flex-col justify-start gap-8 w-full h-screen py-5">
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
            
          {/* Sign in & Sign up */}
          {loggedIn ? (


          <div className="flex flex-col items-center gap-4 w-full ">

            <button
              className="
              flex items-center gap-2 px-2 py-4 text-sm font-bold w-full justify-center
              bg-vermelho-600 text-branco rounded-md
              hover:bg-vermelho-700 transition
              "
              style={{ fontSize: responsiveSizes.text.medium }}
              onClick={()=> removeTokens()}
            >
              <FaUserPlus />
              Sair
            </button>

          </div>
          ):(

          <div className="flex flex-col items-center gap-4 w-full ">

            <button
              className="
              flex items-center gap-2 px-2 py-4 text-sm font-bold w-full justify-center
              border border-vermelho-600 text-branco rounded-md
              hover:bg-vermelho-600 transition
              "
              style={{ fontSize: responsiveSizes.text.medium }}
              onClick={()=> setModal("login")}
            >
              <FaSignInAlt />
              Entrar
            </button>

            <button
              className="
              flex items-center gap-2 px-2 py-4 text-sm font-bold w-full justify-center
              bg-vermelho-600 text-branco rounded-md
              hover:bg-vermelho-700 transition
              "
              style={{ fontSize: responsiveSizes.text.medium }}
              onClick={()=> setModal("cadastro")}
            >
              <FaUserPlus />
              Cadastrar
            </button>

          </div>

          )}


        </div>


      </aside>
    </>
  );
}

function ModalFavoritos({
  aberto,
  fechar,
}: ModalFavoritosProps) {

  const {
    veiculosFavoritos,
    toggleFavorito
  } = useApp();

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
        aria-hidden={!aberto}
        className={`
          fixed right-0 top-0 z-[70]
          flex h-dvh w-full max-w-[420px] flex-col
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
        <div className="flex shrink-0 items-center justify-between border-b pb-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <FaHeart className="text-red-600" />
              Favoritos
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {veiculosFavoritos.length} veículos salvos
            </p>
          </div>

          <button
            onClick={fechar}
            className="text-xl text-gray-600 transition-colors hover:text-red-600"
            aria-label="Fechar favoritos"
          >
            <FaTimes />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="mt-5 flex-1 space-y-3 overflow-y-auto">

          {veiculosFavoritos.length === 0 ? (

            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <FaHeart className="text-4xl text-gray-300" />

              <p className="font-semibold text-gray-600">
                Nenhum veículo favorito
              </p>

              <p className="max-w-[250px] text-sm text-gray-400">
                Adicione veículos aos favoritos para encontrá-los facilmente depois.
              </p>
            </div>

          ) : (

            veiculosFavoritos.map((vehicle) => (
              <div
                key={vehicle.public_id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
              >

                <div className="min-w-0 flex-1">
                  <VehicleCard vehicle={vehicle} />
                </div>

                <button
                  onClick={() => toggleFavorito(vehicle.public_id)}
                  className="shrink-0 rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label={`Remover ${vehicle.nome} dos favoritos`}
                  title="Remover dos favoritos"
                >
                  <FaTrash />
                </button>

              </div>
            ))

          )}

        </div>

      </aside>
    </>
  );
}

function VehicleCard({ vehicle }: { vehicle: Veiculos }) {

  function getPhoto(vehicle: Veiculos) {
  const main = vehicle.imagens?.find((img) => img.principal);
  return main?.url ?? vehicle.imagens?.[0]?.url ?? null;
  }

  const photo = getPhoto(vehicle);

  return (
    <div className="flex items-center gap-4">

      {photo ? (
        <img
          src={photo}
          alt={vehicle.nome}
          className="h-16 w-24 shrink-0 rounded-md object-cover"
        />
      ) : (
        <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-md bg-cinza-100 text-xs text-cinza-600">
          Sem foto
        </div>
      )}

      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-cinza-800">
          {vehicle.nome}
        </p>

        <p className="truncate text-xs text-cinza-600">
          {vehicle.marca?.descricao} • {vehicle.modelo?.descricao}
        </p>
      </div>

    </div>
  );
}
