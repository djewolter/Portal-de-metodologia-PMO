import React, { useEffect, useRef } from 'react';
import { XMarkIcon } from './Icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar a modal ao pressionar a tecla 'Escape'
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);
  
  // Efeito para adicionar/remover classe no body e evitar scroll de fundo
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Handler para fechar a modal ao clicar no overlay (fundo escuro)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Verifica se o clique foi no elemento do overlay e não nos filhos
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 animate-fadeIn"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-5xl mx-auto rounded-2xl shadow-2xl flex flex-col max-h-[90vh] animate-scaleIn"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors z-10"
          aria-label="Fechar modal"
        >
          <XMarkIcon className="h-7 w-7" />
        </button>
        <div className="overflow-y-auto p-6 sm:p-8 md:p-10 pt-12 scrollbar-thin">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;