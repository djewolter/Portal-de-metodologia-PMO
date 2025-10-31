

import React from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { Link } from 'react-router-dom';
import { PortfolioProject } from '../types';
import Indicator from './Indicator';
import { CalendarDaysIcon, PencilIcon } from './Icons';

interface ProjectPortfolioCardProps {
  project: PortfolioProject;
  onEdit: (projectId: string) => void;
}

const getStatusColor = (status: PortfolioProject['status']) => {
  switch (status) {
    case 'Em andamento':
    case 'Go Live realizado. Operação assistida':
      return 'bg-blue-100 text-black';
    case 'Em Risco':
      return 'bg-red-100 text-black';
    case 'Concluído':
      return 'bg-gray-200 text-black';
    case 'Suspenso':
      return 'bg-orange-100 text-black';
    case 'Atrasado':
    case 'Não Iniciado':
    case 'Atrasado (replanejado data de entrega)':
      return 'bg-yellow-100 text-black';
    default:
      return 'bg-gray-100 text-black';
  }
};

const ProjectPortfolioCard: React.FC<ProjectPortfolioCardProps> = ({ project, onEdit }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fadeIn">
      <div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-black flex-1 pr-2">{project.name}</h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStatusColor(project.status)}`}>
                {project.status}
            </span>
        </div>
        <p className="text-sm text-black/70 mb-4">GP Responsável: <span className="font-semibold text-black">{project.manager}</span></p>
        
        <div className="flex items-center gap-3 mb-4">
            <Indicator label="SPI" value={project.spi} />
            <Indicator label="CPI" value={project.cpi} />
        </div>

        <div className="flex items-center gap-2 text-sm text-black/70">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Última atualização: {new Date(project.lastUpdate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between gap-2">
        <Link
          to={`/portfolio/${project.id}`}
          className="flex-1 text-center bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:brightness-110 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3095A6]"
        >
          Detalhes
        </Link>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(project.id);
          }}
          className="p-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition-colors"
          aria-label={`Editar projeto ${project.name}`}
        >
          <PencilIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ProjectPortfolioCard;