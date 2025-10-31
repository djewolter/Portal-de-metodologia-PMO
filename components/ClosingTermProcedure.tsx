

import React from 'react';
import { StarIcon, FileTextIcon } from './Icons';

const ClosingTermProcedure: React.FC = () => {
  return (
    <div className="space-y-10 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
            <StarIcon className="h-8 w-8 text-amber-500" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
                Elaborar Termo de Encerramento (6.3)
            </h2>
        </div>
      </div>

      {/* Reason - Highlighted as key output */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-r-lg shadow-sm">
        <h3 className="flex items-center text-xl font-bold text-yellow-900 mb-2">
            <StarIcon className="h-6 w-6 mr-2 text-yellow-500" />
            Motivo – Documento de saída da fase de Run
        </h3>
        <p className="text-yellow-800 leading-relaxed">
            O Termo de Encerramento formaliza a conclusão do projeto, o atendimento dos objetivos pactuados e a aceitação das entregas. Serve como referência oficial para o arquivamento e encerramento administrativo do ciclo de implantação.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Formalizar a conclusão do projeto, validar os resultados, e servir como referência para o encerramento administrativo e arquivamento do projeto.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Elaboração do documento que formaliza a conclusão do projeto. Ele contempla a validação dos resultados, o cumprimento do escopo contratado e as recomendações finais para sustentação pós-projeto.
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
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por elaborar e consolidar o termo.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador do aceite das entregas.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">Diretoria / Sponsor</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador do encerramento formal do projeto.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">Equipe do Projeto</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformada sobre a conclusão e o encerramento.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
      
      {/* Action Block */}
      <div className="bg-[#e0f2fe] p-6 rounded-lg border border-[#3095A6]/50 text-center space-y-4 mt-8 transition-shadow hover:shadow-md">
         <h4 className="text-lg font-semibold text-[#0A3130]">📎 Documento Padrão</h4>
         <p className="text-[#0A3130]">Utilize o template padrão para a elaboração do Termo de Encerramento.</p>
         <a
            href="https://gruposipal.sharepoint.com/:w:/s/PMO/Ea1yt76qqiFIvRsV2AhOEPwBE2TrC7_m9amb9T-HYV0bUQ?wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1753888811645&web=1"
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

export default ClosingTermProcedure;