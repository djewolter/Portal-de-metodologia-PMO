import React from 'react';
import { FileTextIcon } from './Icons';

const ViabilityReportProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-900">
          Procedimento – Elaborar Relatório de Viabilidade (1.8)
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Consolidação das informações técnicas, financeiras e estratégicas para avaliar se o projeto proposto é viável sob os aspectos de retorno, prazo, risco e recursos.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Subsidiar a decisão executiva sobre a aprovação ou não da demanda como projeto formal.
        </p>
      </div>
      
      {/* RACI Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700">📊 RACI – Relatório de Viabilidade</h3>
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
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por consolidar e elaborar o relatório.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para fornecer e validar as informações.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Controladoria</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultada para validar os dados financeiros.</td>
                    </tr>
                     <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Diretoria</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provadora do relatório e da continuidade do projeto.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Áreas Técnicas</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformadas sobre a decisão final.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
      
      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <p className="text-gray-600">Utilize o modelo padrão para a elaboração do relatório de viabilidade.</p>
         <a
            href="#"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileTextIcon className="h-5 w-5" />
            Modelo de Relatório
          </a>
      </div>
    </div>
  );
};

export default ViabilityReportProcedure;