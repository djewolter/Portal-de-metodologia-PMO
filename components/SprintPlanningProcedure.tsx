
import React from 'react';

const SprintPlanningProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          SPRINT – Realizar Reunião de Planejamento
        </h2>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Importância</h3>
        <p className="text-gray-700 leading-relaxed">
          Define o que será entregue na próxima sprint, com base nas prioridades e na capacidade do time. É o momento de alinhar esforço, metas e compromissos de entrega.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Aplicação na Fase de Realize</h3>
        <p className="text-gray-700 leading-relaxed">
          Garante que as entregas planejadas (testes, ajustes, treinamentos, integrações) sejam organizadas e realistas dentro do ciclo da sprint.
        </p>
      </div>
    </div>
  );
};
export default SprintPlanningProcedure;