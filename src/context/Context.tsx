
import {
  createContext,
  useContext,
  type ReactNode
} from "react";

// ==========================================
// INTERFACES
// ==========================================

interface Imagem {
  public_id: string;
  url: string;
  principal: boolean;
}

interface Marca {
  public_id: string;
  descricao: string;
}

interface Modelo {
  public_id: string;
  descricao: string;
}

interface Categoria {
  public_id: string;
  descricao: string;
}

interface Cor {
  public_id: string;
  descricao: string;
  hexdecimal: string;
}

interface Veiculo {
  public_id: string;
  nome: string;
  detalhes: string;
  opcionais: string;
  cambio: string;
  km: string;
  ano_fab: string;
  ano_mo: string;
  placa: string;
  destaque: boolean;
  combustivel: string;
  preco: number;

  marca: Marca;
  modelo: Modelo;
  categoria: Categoria;
  cor: Cor;
  imagens: Imagem[];
}

interface CorData {
  id: string;
  public_id: string;
  descricao: string;
  hexadecimal: string;
}

interface ModeloData {
  id: string;
  public_id: string;
  descricao: string;
  marca_id: string;
}

interface MarcaData {
  id: string;
  public_id: string;
  descricao: string;
  modelos: ModeloData[];
}

// ==========================================
// CONTEXT
// ==========================================

interface AppContextData {
  veiculosData: Veiculo[];
  coresData: CorData[];
  marcasData: MarcaData[];
}

interface Props {
  children: ReactNode;
}

const Context = createContext<AppContextData | null>(null);

// ==========================================
// PROVIDER
// ==========================================

export function ContextProvider({ children }: Props) {

  const veiculosData: Veiculo[] = [
    {
      public_id: "a8f72c91-4d21-4a31-bf85-9c2e7d6a1234",
      nome: "G 310",
      detalhes: "Moto em excelente estado de conservação, revisada e pronta para rodar.",
      opcionais: "ABS, painel digital, iluminação LED, partida elétrica",
      cambio: "MANUAL",
      km: "0",
      ano_fab: "2018",
      ano_mo: "2018",
      placa: "ABC1D23",
      destaque: true,
      combustivel: "GASOLINA",
      preco: 36990.00,

      marca: {
        public_id: "marca-001",
        descricao: "BMW",
      },

      modelo: {
        public_id: "modelo-001",
        descricao: "GS",
      },

      categoria: {
        public_id: "categoria-001",
        descricao: "TRAIL",
      },

      cor: {
        public_id: "cor-001",
        descricao: "PRETO",
        hexdecimal: "#171717",
      },

      imagens: [
        {
          public_id: "imagem-001",
          url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
          principal: true,
        },
        {
          public_id: "imagem-002",
          url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39",
          principal: false,
        }
      ]
    }
  ];

  const coresData: CorData[] = [
    { id: "1", public_id: "cor-001", descricao: "PRETO", hexadecimal: "#171717" },
    { id: "2", public_id: "cor-002", descricao: "BRANCO", hexadecimal: "#FFFFFF" },
    { id: "3", public_id: "cor-003", descricao: "VERMELHO", hexadecimal: "#DC2626" },
    { id: "4", public_id: "cor-004", descricao: "AZUL", hexadecimal: "#2563EB" },
    { id: "5", public_id: "cor-005", descricao: "PRATA", hexadecimal: "#C0C0C0" },
    { id: "6", public_id: "cor-006", descricao: "CINZA", hexadecimal: "#6B7280" },
    { id: "7", public_id: "cor-007", descricao: "VERDE", hexadecimal: "#15803D" },
    { id: "8", public_id: "cor-008", descricao: "AMARELO", hexadecimal: "#EAB308" },
    { id: "9", public_id: "cor-009", descricao: "LARANJA", hexadecimal: "#EA580C" },
    { id: "10", public_id: "cor-010", descricao: "MARROM", hexadecimal: "#78350F" },
  ];

  const marcasData: MarcaData[] = [
    {
      id: "1",
      public_id: "marca-001",
      descricao: "HONDA",
      modelos: [
        { id: "1", public_id: "modelo-001", descricao: "CG 160 FAN", marca_id: "1" },
        { id: "2", public_id: "modelo-002", descricao: "CG 160 TITAN", marca_id: "1" },
        { id: "3", public_id: "modelo-003", descricao: "BIZ 125", marca_id: "1" },
        { id: "4", public_id: "modelo-004", descricao: "NXR 160 BROS", marca_id: "1" },
        { id: "5", public_id: "modelo-005", descricao: "CB 300F TWISTER", marca_id: "1" },
        { id: "6", public_id: "modelo-006", descricao: "XRE 300", marca_id: "1" },
        { id: "7", public_id: "modelo-007", descricao: "PCX 160", marca_id: "1" },
      ],
    },

    {
      id: "2",
      public_id: "marca-002",
      descricao: "YAMAHA",
      modelos: [
        { id: "8", public_id: "modelo-008", descricao: "FACTOR 150", marca_id: "2" },
        { id: "9", public_id: "modelo-009", descricao: "FAZER FZ25", marca_id: "2" },
        { id: "10", public_id: "modelo-010", descricao: "LANDER 250", marca_id: "2" },
        { id: "11", public_id: "modelo-011", descricao: "CROSSER 150", marca_id: "2" },
        { id: "12", public_id: "modelo-012", descricao: "MT-03", marca_id: "2" },
        { id: "13", public_id: "modelo-013", descricao: "R3", marca_id: "2" },
        { id: "14", public_id: "modelo-014", descricao: "NMAX 160", marca_id: "2" },
      ],
    },

    {
      id: "3",
      public_id: "marca-003",
      descricao: "BMW",
      modelos: [
        { id: "15", public_id: "modelo-015", descricao: "G 310 GS", marca_id: "3" },
        { id: "16", public_id: "modelo-016", descricao: "G 310 R", marca_id: "3" },
        { id: "17", public_id: "modelo-017", descricao: "F 850 GS", marca_id: "3" },
        { id: "18", public_id: "modelo-018", descricao: "F 900 GS", marca_id: "3" },
        { id: "19", public_id: "modelo-019", descricao: "R 1250 GS", marca_id: "3" },
        { id: "20", public_id: "modelo-020", descricao: "S 1000 RR", marca_id: "3" },
      ],
    },

    {
      id: "4",
      public_id: "marca-004",
      descricao: "KAWASAKI",
      modelos: [
        { id: "21", public_id: "modelo-021", descricao: "NINJA 400", marca_id: "4" },
        { id: "22", public_id: "modelo-022", descricao: "NINJA 650", marca_id: "4" },
        { id: "23", public_id: "modelo-023", descricao: "Z400", marca_id: "4" },
        { id: "24", public_id: "modelo-024", descricao: "Z650", marca_id: "4" },
        { id: "25", public_id: "modelo-025", descricao: "VERSYS 650", marca_id: "4" },
      ],
    },

    {
      id: "5",
      public_id: "marca-005",
      descricao: "SUZUKI",
      modelos: [
        { id: "26", public_id: "modelo-026", descricao: "V-STROM 650", marca_id: "5" },
        { id: "27", public_id: "modelo-027", descricao: "GSX-S750", marca_id: "5" },
        { id: "28", public_id: "modelo-028", descricao: "HAYABUSA", marca_id: "5" },
        { id: "29", public_id: "modelo-029", descricao: "INTRUDER 125", marca_id: "5" },
      ],
    },

    {
      id: "6",
      public_id: "marca-006",
      descricao: "ROYAL ENFIELD",
      modelos: [
        { id: "30", public_id: "modelo-030", descricao: "HIMALAYAN 450", marca_id: "6" },
        { id: "31", public_id: "modelo-031", descricao: "CLASSIC 350", marca_id: "6" },
        { id: "32", public_id: "modelo-032", descricao: "METEOR 350", marca_id: "6" },
        { id: "33", public_id: "modelo-033", descricao: "INTERCEPTOR 650", marca_id: "6" },
        { id: "34", public_id: "modelo-034", descricao: "CONTINENTAL GT 650", marca_id: "6" },
      ],
    },

    {
      id: "7",
      public_id: "marca-007",
      descricao: "TRIUMPH",
      modelos: [
        { id: "35", public_id: "modelo-035", descricao: "TIGER 900", marca_id: "7" },
        { id: "36", public_id: "modelo-036", descricao: "STREET TRIPLE", marca_id: "7" },
        { id: "37", public_id: "modelo-037", descricao: "BONNEVILLE T100", marca_id: "7" },
        { id: "38", public_id: "modelo-038", descricao: "SPEED 400", marca_id: "7" },
      ],
    },

    {
      id: "8",
      public_id: "marca-008",
      descricao: "DUCATI",
      modelos: [
        { id: "39", public_id: "modelo-039", descricao: "MONSTER", marca_id: "8" },
        { id: "40", public_id: "modelo-040", descricao: "MULTISTRADA V4", marca_id: "8" },
        { id: "41", public_id: "modelo-041", descricao: "PANIGALE V4", marca_id: "8" },
        { id: "42", public_id: "modelo-042", descricao: "SCRAMBLER", marca_id: "8" },
      ],
    },
  ];

  return (
    <Context.Provider value={{ veiculosData, coresData, marcasData }}>
      {children}
    </Context.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================

export function useApp(): AppContextData {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useApp deve ser utilizado dentro de ContextProvider");
  }

  return context;
}
