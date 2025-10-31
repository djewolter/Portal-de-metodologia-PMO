

import React from 'react';
import { FileTextIcon, StarIcon } from './Icons';

const DeployCutoverPlanProcedure: React.FC = () => {
  return (
    <div className="space-y-10 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
            <FileTextIcon className="h-8 w-8 text-[#0A3130]" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
                Executar Plano de Cutover (5.2)
            </h2>
        </div>
      </div>

      {/* Reason - Highlighted as key output */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-r-lg shadow-sm">
        <h3 className="flex items-center text-xl font-bold text-yellow-900 mb-2">
            <StarIcon className="h-6 w-6 mr-2 text-yellow-500" />
            Motivo – Documento de saída da fase de Deploy
        </h3>
        <p className="text-yellow-800 leading-relaxed">
            Documento que comprova a execução da virada para o ambiente produtivo, com base em roteiro técnico validado e responsável por garantir a continuidade da operação.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Certificar que a transição foi realizada com sucesso, dentro do cronograma, e sem falhas críticas, marcando a conclusão formal da fase de Deploy.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Execução do plano detalhado de transição para o ambiente produtivo, com cronograma técnico, janelas de parada, responsáveis e validações pós-go live.
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
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">TI / Fornecedor</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por executar o plano técnico de virada.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para coordenar as atividades e a comunicação.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para validar a operação pós-virada.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">Diretoria / Sponsor</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador da conclusão bem-sucedida do cutover.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
      
      {/* Action Block */}
      <div className="bg-[#e0f2fe] p-6 rounded-lg border border-[#3095A6]/50 text-center space-y-4 mt-8 transition-shadow hover:shadow-md">
         <h4 className="text-lg font-semibold text-[#0A3130]">📎 Documentos Padrão</h4>
         <p className="text-[#0A3130]">Plano de Cutover executado + registros técnicos + checklist de validação final.</p>
         <a
            href="https://gruposipal.sharepoint.com/:x:/s/PMO/ERb2AnjGnDhGinNDYWKuwKkBWwmhECpt8ulQ8c3iWorqQA?wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1753809663288&web=1"
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

export default DeployCutoverPlanProcedure;