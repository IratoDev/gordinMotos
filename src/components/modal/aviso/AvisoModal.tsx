
import { FiAlertCircle } from 'react-icons/fi';

type Props = {
  aberto: boolean;
  titulo?: string;
  mensagem: string;
  textoBotao?: string;
  onFechar: () => void;
};

export function ModalAviso({
  aberto,
  titulo = 'Aviso',
  mensagem,
  textoBotao = 'Entendi',
  onFechar,
}: Props) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100">
            <FiAlertCircle className="text-2xl text-amber-600" />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            {titulo}
          </h2>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-600">
          {mensagem}
        </p>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onFechar}
            className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-amber-600"
          >
            {textoBotao}
          </button>
        </div>

      </div>
    </div>
  );
}
