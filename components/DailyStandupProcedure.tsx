
import React from 'react';

const DailyStandupProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          SPRINT – Realizar Reuniões Diárias
        </h2>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Importância</h3>
        <p className="text-gray-700 leading-relaxed">
          Curtas reuniões diárias (daily) para alinhar o andamento, identificar impedimentos e manter o time sincronizado.
        </p>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Aplicação na Fase de Realize</h3>
        <p className="text-gray-700 leading-relaxed">
          Fundamental para resolver rapidamente problemas operacionais, manter foco nas prioridades e garantir ritmo estável de entrega.
        </p>
      </div>
    </div>
  );
};
export default DailyStandupProcedure;