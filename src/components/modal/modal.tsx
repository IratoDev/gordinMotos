import { type ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

export const inputClass =
  'w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-vermelho-600 focus:outline-none focus:ring-1 focus:ring-vermelho-600';

export function Campo({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium text-stone-900 ${className}`}>
      {label}
      {children}
    </label>
  );
}

export function Check({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-stone-900">
      <input type="checkbox" className="h-4 w-4 accent-red-600" />
      {label}
    </label>
  );
}

type ModalProps = {
  aberto: boolean;
  titulo: string;
  onFechar: () => void;
  children: ReactNode;
  largura?: string;
};

export default function Modal({
  aberto,
  titulo,
  onFechar,
  children,
}: ModalProps) {
  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 p-4"
    
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg border border-stone-200 bg-white`}
      >
        {/* Cabeçalho */}
        <header className="flex items-center justify-between rounded-t-lg bg-stone-900 px-5 py-4 text-white">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <button
            onClick={onFechar}
            aria-label="Fechar"
            className="rounded-md p-1 text-stone-300 hover:text-white"
          >
            <FiX size={20} />
          </button>
        </header>

        {/* Conteúdo */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-5">{children}</div>

        
        </form>
      </div>
    </div>
  );
}
