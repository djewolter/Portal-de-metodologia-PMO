
import React from 'react';

const SprintReviewProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          SPRINT – Reunião de Revisão
        </h2>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Importância</h3>
        <p className="text-gray-700 leading-relaxed">
          Revisão das entregas realizadas na sprint, geralmente com a presença de stakeholders, para validação do que foi construído.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Aplicação na Fase de Realize</h3>
        <p className="text-gray-700 leading-relaxed">
          Ajuda a garantir que o que está sendo entregue atende aos critérios de aceitação e evita desvios antes do go-live.
        </p>
      </div>
    </div>
  );
};
export default SprintReviewProcedure;