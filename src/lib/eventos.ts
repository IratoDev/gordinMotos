import { setupApiClient } from "../service/api";


const api = setupApiClient();

type Evento =
  | { tipo: "VISUALIZOU" | "CLICOU_WHATSAPP"; veiculo_id: string }
  | { tipo: "BUSCOU"; termo_busca: string };

export function registrarEvento(evento: Evento) {
  api.post("/eventos", evento).catch(() => {}); // se falhar, o cliente nem percebe
}