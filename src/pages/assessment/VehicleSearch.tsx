import { useMemo, useState } from "react";
import type { Veiculos } from "../../context/dataTypes";

interface VehicleSearchProps {
  vehicles: Veiculos[];
  selected: Veiculos | null;
  onSelect: (vehicle: Veiculos) => void;
  onClear: () => void;
}

// Remove acentos e deixa minúsculo
const normalize = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// Pega a foto principal (ou a primeira)
function getPhoto(vehicle: Veiculos) {
  const main = vehicle.imagens?.find((img) => img.principal);
  return main?.url ?? vehicle.imagens?.[0]?.url ?? null;
}

// Card visual do veículo (foto, nome, modelo e marca)
function VehicleCard({ vehicle }: { vehicle: Veiculos }) {
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

export function VehicleSearch({
  vehicles,
  selected,
  onSelect,
  onClear,
}: VehicleSearchProps) {
  const [search, setSearch] = useState("");

  // Busca por nome, marca ou modelo (mínimo 2 letras)
  const results = useMemo(() => {
    const term = normalize(search.trim());
    if (term.length < 2) return [];

    return vehicles
      .filter((v) =>
        normalize(
          `${v.nome} ${v.marca?.descricao ?? ""} ${v.modelo?.descricao ?? ""}`
        ).includes(term)
      )
      .slice(0, 6);
  }, [search, vehicles]);

  function handleSelect(vehicle: Veiculos) {
    onSelect(vehicle);
    setSearch("");
  }

  // Veículo já escolhido: mostra só o card
  if (selected) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-md border border-vermelho-500 bg-branco p-3">
        <VehicleCard vehicle={selected} />

        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-sm font-medium text-vermelho-500 hover:underline"
        >
          Trocar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Busque por nome, marca ou modelo. Ex. Fazer"
        className="w-full rounded-md border border-cinza-300 bg-branco px-3 py-3 text-sm text-cinza-700 outline-none transition focus:border-vermelho-500 focus:ring-2 focus:ring-vermelho-100"
      />

      {search.trim().length >= 2 && results.length === 0 && (
        <p className="text-sm text-cinza-600">Nenhum veículo encontrado.</p>
      )}

      {results.length > 0 && (
        <ul className="divide-y divide-cinza-300 overflow-hidden rounded-md border border-cinza-300 bg-branco shadow-sm">
          {results.map((vehicle) => (
            <li key={vehicle.public_id}>
              <button
                type="button"
                onClick={() => handleSelect(vehicle)}
                className="w-full p-3 text-left transition hover:bg-cinza-100"
              >
                <VehicleCard vehicle={vehicle} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}