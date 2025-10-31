

import React from 'react';
import { StarIcon } from './Icons';

const SprintExplanation: React.FC = () => {
  return (
    <div className="bg-[#0A3130]/10 p-6 rounded-lg border border-[#3095A6]/50 mb-6">
      <h3 className="flex items-center text-xl font-bold text-[#0A3130] mb-3">
        <StarIcon className="h-6 w-6 mr-2 text-[#0A3130]" />
        Motivo – Aplicação de Sprints na fase de Realize
      </h3>
      <div className="space-y-4 text-gray-700 leading-relaxed">
        <p>
          Durante a fase de Realize, a execução do projeto entra em ritmo intenso, com entregas técnicas, testes, validações e preparação para o go-live. A aplicação do modelo ágil por meio de sprints permite:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>Que as entregas sejam incrementais, com valor visível desde as primeiras iterações.</li>
          <li>Que o time tenha ritmo, foco e alinhamento contínuo, mesmo em ambientes complexos.</li>
          <li>Que haja ajustes rápidos e colaborativos, reduzindo riscos de retrabalho.</li>
        </ul>
        <p className="font-semibold text-gray-800">
          As cerimônias a seguir garantem o ciclo ágil de execução, revisão e evolução do projeto.
        </p>
      </div>
    </div>
  );
};

export default SprintExplanation;