
import React from 'react';

const SupportOperationProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Apoiar Operação (6.1)
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Durante o período pós-implantação, são disponibilizados recursos dedicados para apoio à operação, assegurando a estabilização dos processos, o suporte aos usuários e o tratamento célere de incidentes. Essa atuação é essencial para mitigar riscos operacionais e garantir a continuidade das atividades críticas sem interrupções.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Assegurar a estabilização dos processos, o suporte aos usuários e o tratamento de incidentes para mitigar riscos operacionais e garantir a continuidade das atividades.
        </p>
      </div>
      
      {/* RACI Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700">📊 Análise RACI</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 font-semibold text-gray-700">Função</th>
                        <th className="p-4 font-semibold text-gray-700">Papel no Processo</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Equipe de Suporte</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por prestar o suporte.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Fornecedor</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para suporte especializado (Nível 2/3).</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para monitorar a estabilização.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformado sobre o progresso e incidentes.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <h4 className="text-lg font-semibold text-[#0A3130]">📎 Documento Padrão</h4>
         <p className="text-gray-600">Este artefato está em fase de revisão e será disponibilizado em breve.</p>
         <button
            disabled
            className="inline-flex items-center gap-2 bg-gray-300 text-gray-500 font-semibold py-2 px-4 rounded-lg shadow-sm cursor-not-allowed"
            aria-label="Documento em desenvolvimento"
          >
            Documento sendo desenvolvido
          </button>
      </div>
    </div>
  );
};

export default SupportOperationProcedure;
