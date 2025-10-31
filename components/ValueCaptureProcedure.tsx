
import React from 'react';

const ValueCaptureProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Realizar Captura de Valor (7.3)
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Foi realizada a análise de captura de valor com foco na mensuração dos benefícios concretos gerados pelo projeto, como ganhos operacionais, redução de retrabalho, melhoria da eficiência e atendimento a requisitos regulatórios. Essa avaliação permitirá à organização confirmar o retorno do investimento e consolidar o alinhamento do projeto com os objetivos estratégicos da companhia.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Mensurar os benefícios concretos gerados pelo projeto para confirmar o retorno do investimento (ROI) e o alinhamento estratégico.
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
                        <td className="p-4 font-medium text-gray-800">PMO / Controladoria</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por conduzir a análise.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Área de Negócio</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultada para quantificar os benefícios operacionais.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Diretoria</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador do relatório de captura de valor.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Equipe Financeira</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformada sobre os resultados financeiros.</td>
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

export default ValueCaptureProcedure;
