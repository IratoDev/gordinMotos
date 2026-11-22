import type { FormEvent } from "react";
import { FaSearch } from "react-icons/fa";

type Props = {
  value: string;
  onChange: (valor: string) => void;
  onSearch: () => void;
};

export function SearchText({ value, onChange, onSearch }: Props) {
  // Enter no input também dispara a pesquisa
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite marca, modelo ou nome da moto..."
        className="w-full flex-1 rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-red-600"
      />

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-md bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        <FaSearch />
        Pesquisar
      </button>
    </form>
  );
}