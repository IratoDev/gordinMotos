const FAVORITOS_KEY = "veiculosFavoritos";

export function getFavoritos(): string[] {
  return JSON.parse(
    localStorage.getItem(FAVORITOS_KEY) || "[]"
  );
}

export function adicionarFavorito(id: string) {
  const favoritos = getFavoritos();

  if (favoritos.includes(id)) return;

  localStorage.setItem(
    FAVORITOS_KEY,
    JSON.stringify([...favoritos, id])
  );
}

export function removerFavorito(id: string) {
  const favoritos = getFavoritos().filter(
    favorito => favorito !== id
  );

  localStorage.setItem(
    FAVORITOS_KEY,
    JSON.stringify(favoritos)
  );
}