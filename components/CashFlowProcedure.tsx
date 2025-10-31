import React from 'react';
import { FileTextIcon } from './Icons';

const CashFlowProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Realizar Fluxo de Caixa do Projeto (2.2)
        </h2>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Fornecer base econômica para avaliação de viabilidade e acompanhamento do desempenho financeiro do projeto ao longo do tempo.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Projeção detalhada das entradas e saídas financeiras relacionadas ao projeto, incluindo investimentos, custos operacionais e retorno estimado.
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
                        <td className="p-4 font-medium text-gray-800">Controladoria</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por elaborar e validar o fluxo de caixa.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para fornecer dados do projeto.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Área Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultada para fornecer estimativas de receita/custo.</td>
                    </tr>
                     <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Diretoria</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provadora do fluxo de caixa e da viabilidade financeira.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <h4 className="text-lg font-semibold text-[#0A3130]">📎 Documento Padrão</h4>
         <p className="text-gray-600">Utilize o modelo padrão para a elaboração do Fluxo de Caixa do Projeto.</p>
         <a
            href="https://gruposipal.sharepoint.com/:x:/r/sites/PMO/_layouts/15/Doc.aspx?sourcedoc=%7B55088360-B795-48EA-8053-E37698999613%7D&file=PMO-PRE-003%20Fluxo%20de%20Caixa.xlsx&action=default&mobileredirect=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3095A6]"
            aria-label="Abrir modelo de documento padrão"
          >
            <FileTextIcon className="h-5 w-5" />
            Modelo de Documento
          </a>
      </div>
    </div>
  );
};

export default CashFlowProcedure;