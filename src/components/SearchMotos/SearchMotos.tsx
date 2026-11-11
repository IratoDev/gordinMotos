
import { useState } from "react";
import {responsiveSizes} from '../../assets/font/font'

type Tab = "marca" | "preco" | "ano";

export default function SearchMotos() {
  const [aba, setAba] = useState<Tab>("marca");

  const tabs = [
    { id: "marca", label: "Marca e modelo" },
    { id: "preco", label: "Faixa de preço" },
    { id: "ano", label: "Faixa de ano" },
  ] as const;

  return (
    <div className="w-full p-2 my-4 border border-cinza-300 rounded-lg shadow-md">
      {/* Abas */}
      <nav className="grid grid-cols-3 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setAba(tab.id)}
            style={{fontSize: responsiveSizes.text.medium}}
            className={`p-4 text-sm font-semibold transition ${
              aba === tab.id
                ? "border-b-2 border-vermelho-600 text-vermelho-600"
                : "text-cinza-500 hover:text-cinza-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Conteúdo */}
      <div className="flex flex-wrap items-center gap-3 p-4">

        {aba === "marca" && (
          <>
            <select className="w-full appearance-none bg-transparent py-2 text-sm text-gray-900 focus:outline-none cursor-pointer pr-8 flex-1">
              <option value="">Selecione a marca</option>
            </select>

            <select className="w-full appearance-none bg-transparent py-2 text-sm text-gray-900 focus:outline-none cursor-pointer pr-8 flex-1">
              <option value="">Selecione o modelo</option>
            </select>

            <button className="bg-verde-500 p-2 rounded-xl">
              <p className="text-branco font-semibold leading-6" style={{fontSize: responsiveSizes.text.small}}>Pesquisar</p>
            </button>
          </>
        )}

        {aba === "preco" && (
          <>
            <input
              type="number"
              placeholder="Preço de"
              className="w-full bg-transparent py-2 text-sm text-gray-900 focus:outline-none placeholder-gray-400 border-b border-gray-200 focus:border-gray-400 flex-1"
            />

            <input
              type="number"
              placeholder="Preço até"
              className="w-full bg-transparent py-2 text-sm text-gray-900 focus:outline-none placeholder-gray-400 border-b border-gray-200 focus:border-gray-400 flex-1"
            />

            <button className="bg-verde-500 p-2 rounded-xl">
              <p className="text-branco font-semibold leading-6" style={{fontSize: responsiveSizes.text.small}}>Filtrar</p>
            </button>
          </>
        )}

        {aba === "ano" && (
          <>
            <input
              type="number"
              placeholder="Ano de"
              maxLength={4}
              className="w-full bg-transparent py-2 text-sm text-gray-900 focus:outline-none placeholder-gray-400 border-b border-gray-200 focus:border-gray-400 flex-1"
            />

            <input
              type="number"
              placeholder="Ano até"
              maxLength={4}
              className="w-full bg-transparent py-2 text-sm text-gray-900 focus:outline-none placeholder-gray-400 border-b border-gray-200 focus:border-gray-400 flex-1"
            />

            <button className="bg-verde-500 p-2 rounded-xl">
              <p className="text-branco font-semibold leading-6" style={{fontSize: responsiveSizes.text.small}}>Filtrar</p>
            </button>
          </>
        )}

      </div>
    </div>
  );
}
