
import React from 'react';
import { InfoIcon } from './Icons';

const Legend: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 border border-gray-200 rounded-lg">
      <h3 className="flex items-center text-xl font-semibold text-gray-700 mb-4">
        <InfoIcon className="h-6 w-6 mr-3 text-gray-500" />
        Legenda
      </h3>
      <div className="flex flex-col md:flex-row md:items-center gap-x-8 gap-y-4">
        <div className="flex items-center">
          <div className="h-8 w-12 rounded bg-gray-200 border border-gray-300 mr-3 shadow-sm"></div>
          <span className="text-gray-600">Ações do Escritório de Projetos (PMO)</span>
        </div>
        <div className="flex items-center">
          <span className="h-3 w-3 rounded-full bg-red-500 mr-3"></span>
          <span className="text-gray-600">Ações Obrigatórias</span>
        </div>
      </div>
    </div>
  );
};

export default Legend;
