import React from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from './Icons';

interface BackButtonProps {
  fallback?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ fallback = '/' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBackClick = () => {
    // Se location.key for 'default', significa que o usuário acessou esta página diretamente.
    // Nesse caso, não há histórico dentro do aplicativo para o qual voltar.
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleBackClick}
      className="inline-flex items-center gap-2 px-3 py-2 mb-4 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3095A6]"
      aria-label="Voltar à página anterior"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Voltar
    </button>
  );
};

export default BackButton;