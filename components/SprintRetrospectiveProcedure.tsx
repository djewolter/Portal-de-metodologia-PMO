
import React from 'react';

const SprintRetrospectiveProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          SPRINT – Realizar Reunião de Retrospectiva
        </h2>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Importância</h3>
        <p className="text-gray-700 leading-relaxed">
          Permite ao time refletir sobre o que funcionou bem, o que pode melhorar e como evoluir continuamente a forma de trabalhar.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Aplicação na Fase de Realize</h3>
        <p className="text-gray-700 leading-relaxed">
          É essencial para otimizar a colaboração, remover impedimentos e melhorar processos durante uma fase de execução intensa.
        </p>
      </div>
    </div>
  );
};
export default SprintRetrospectiveProcedure;