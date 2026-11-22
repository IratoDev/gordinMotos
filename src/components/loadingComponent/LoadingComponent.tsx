
import { FiLoader } from "react-icons/fi";

type ModalLoadingProps = {
  aberto: boolean;
  mensagem?: string;
};

export function ModalLoading({
  aberto,
  mensagem = "Aguarde, estamos processando...",
}: ModalLoadingProps) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4">
      <div className="flex w-full max-w-xs flex-col items-center rounded-xl bg-white p-8 shadow-xl">

        <FiLoader
          size={42}
          className="mb-5 animate-spin text-vermelho-600"
        />

        <h2 className="text-lg font-semibold text-gray-800">
          Aguarde...
        </h2>

        <p className="mt-2 text-center text-sm text-gray-500">
          {mensagem}
        </p>

      </div>
    </div>
  );
}
