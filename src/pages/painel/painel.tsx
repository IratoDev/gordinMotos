import { useState } from 'react';
import { FaMotorcycle, FaSignOutAlt } from 'react-icons/fa';
import {
  FiBarChart2,
  FiChevronDown,
  FiChevronUp,
  FiStar,
  FiUsers,
} from 'react-icons/fi';

import DashboardPage from '../../components/Dashboard/dashboardpage';
import VeiculosPage from '../../components/pages/Veicles/veiculos';
import AvaliacoesPage from '../../components/pages/Assessment/avaliacao';
import UsuariosPage from '../../components/pages/Users/usuario';
import ColorsPage from '../../components/pages/Colors/Colors';
import BrandsPage from '../../components/pages/Brands/Brands';
import CategorisPage from '../../components/pages/Categori/Categori';

import { removeTokens } from '../../lib/cookie';
import { Logo } from '../../components/Logo/Logo';

export default function Painel() {
  const [content, setContent] = useState('painel');
  const [veiculosOpen, setVeiculosOpen] = useState(false);


  const veiculoSubmenu = [
    { key: 'veiculos', label: 'Cadastrar veículo' },
    { key: 'marcas', label: 'Cadastrar marca' },
    { key: 'cor', label: 'Cadastrar cor' },
    { key: 'categoria', label: 'Cadastrar categoria' },
  ];

  const buttonList = [
    { label: 'painel', icon: <FiBarChart2 size={18} /> },
    { label: 'veiculos', icon: <FaMotorcycle size={18} /> },
    { label: 'avaliacoes', icon: <FiStar size={18} /> },
    { label: 'usuario', icon: <FiUsers size={18} /> },
  ];

  return (
    <main className="flex w-full min-h-screen flex-col bg-branco md:flex-row">

      {/* Menu lateral */}
      <aside className="relative bg-stone-900 text-stone-300 md:w-60 md:shrink-0">

        {/* Logo */}
        <div className="flex justify-center items-center gap-2 px-5 py-4 text-white">
          <Logo/>
        </div>

        {/* Navegação */}
        <nav
          aria-label="Administração"
          className="flex relative gap-4 overflow-x-auto px-3 h-[80%] md:flex-col "
        >
          {buttonList.map((button, i) => {
            const isVeiculos = button.label === 'veiculos';

            return (
              <div key={i} className="flex flex-col gap-1">
                <button
                  onClick={() => {
                    if (isVeiculos) {
                      setVeiculosOpen(!veiculosOpen);
                    } else {
                      setContent(button.label);
                      setVeiculosOpen(false);
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-md bg-vermelho-600 px-3 py-2 text-sm font-medium text-branco"
                >
                  {button.icon}
                  {button.label}
                  {isVeiculos && (
                    <span className="ml-auto">
                      {veiculosOpen ? (
                        <FiChevronUp size={16} />
                      ) : (
                        <FiChevronDown size={16} />
                      )}
                    </span>
                  )}
                </button>

                {isVeiculos && veiculosOpen && (
                  <div className="ml-4 flex flex-col gap-1 border-l border-stone-700 pl-2">
                    {veiculoSubmenu.map((item) => (
                      <button
                        key={item.key}
                        onClick={() => setContent(item.key)}
                        className="rounded-md bg-stone-800 px-3 py-2 text-left text-sm text-stone-200 hover:bg-vermelho-600"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {/* Botão sair */}
          
          <div className='flex items-center justify-center w-full max-w-24 
           md:absolute md:bottom-0 md:max-w-52'>
            <button
              onClick={ () => {
                removeTokens();
                window.location.reload();
              }}
              className="
              flex flex-1 items-center gap-3 rounded-md  bg-vermelho-600 px-6 py-2 
              text-sm font-medium text-branco 
              "
            >
              <FaSignOutAlt />
              <p className="text-center">Sair</p>
            </button>
          </div>
          
        </nav>

      </aside>

      {/* Conteúdo principal */}
      <div className="min-w-0 flex-1 p-4 md:p-8">
        <div className="space-y-6">

          <div className="w-full">
            <h1 className="text-2xl font-bold text-stone-900">Painel admin</h1>
          </div>

          {/* Área de conteúdo */}
          <div className="max-h-[500px] rounded-lg border border-stone-200 bg-white p-5 overflow-y-auto">
            {content === 'painel' ? <DashboardPage /> :
             content === 'veiculos' ? <VeiculosPage /> :
             content === 'avaliacoes' ? <AvaliacoesPage /> :
             content === 'usuario' ? <UsuariosPage /> :
             content === 'marcas' ? <BrandsPage/> :
             content === 'cor' ? <ColorsPage/> :
             content === 'categoria' ? <CategorisPage/>:
             null}
          </div>

        </div>
      </div>
    </main>
  );
}