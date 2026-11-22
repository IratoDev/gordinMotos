import { useEffect, type ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';

type ModalProps = {
  aberto: boolean;
  fechar: () => void;
  titulo: string;
  modalSize: string;
  corFundo?: string;
  children: ReactNode;
};

export default function Modal({ aberto, fechar, titulo, children, modalSize, corFundo }: ModalProps) {
  useEffect(() => {
    if (!aberto) return;
    const aoApertar = (e: KeyboardEvent) => e.key === 'Escape' && fechar();
    window.addEventListener('keydown', aoApertar);
    return () => window.removeEventListener('keydown', aoApertar);
  }, [aberto, fechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${modalSize} rounded-xl ${corFundo ? corFundo : "bg-preto" } p-6 text-branco`}
      >
        <button
          onClick={fechar}
          aria-label="Fechar"
          className={`absolute right-4 top-4 ${corFundo ? "text-black hover:text-preto" : "text-branco/70 hover:text-branco"} `}
        >
          <FaTimes />
        </button>

        <h2 className={`mb-6 text-2xl font-bold ${corFundo ? "text-black" : "text-branco"} `}>{titulo}</h2>
        {children}
      </div>
    </div>
  );
}