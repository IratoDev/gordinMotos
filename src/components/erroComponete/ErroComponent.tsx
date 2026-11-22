
import { FiAlertCircle, FiX } from "react-icons/fi";

type ModalErroProps = {
  aberto: boolean;
  mensagem: string;
  titulo?: string;
  onFechar: () => void;
};

export function ModalErro({
  aberto,
  mensagem,
  titulo = "Ocorreu um erro",
  onFechar,
}: ModalErroProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md animate-in fade-in zoom-in rounded-xl bg-white p-6 shadow-xl">

        <button
          type="button"
          onClick={onFechar}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
          aria-label="Fechar"
        >
          <FiX size={22} />
        </button>

        <div className="flex flex-col items-center text-center">

          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
            <FiAlertCircle size={32} />
          </div>

          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            {titulo}
          </h2>

          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            {mensagem}
          </p>

          <button
            type="button"
            onClick={onFechar}
            className="w-full rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700"
          >
            Entendi
          </button>

        </div>
      </div>
    </div>
  );
}
