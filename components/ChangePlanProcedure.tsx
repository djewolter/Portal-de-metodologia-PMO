

import React from 'react';
import { FileTextIcon } from './Icons';

const ChangePlanProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Realizar Plano de Mudanças (5.3)
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Execução das ações organizacionais e operacionais necessárias para sustentar a entrada da nova solução: comunicação, suporte, treinamento adicional, plano de contingência.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Assegurar que os usuários estejam prontos para operar a nova solução, com apoio necessário e sem impacto negativo na operação.
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
                        <td className="p-4 font-medium text-gray-800">Change Management / RH</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável pela execução das ações de mudança.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para monitorar e apoiar a execução.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador da conclusão das ações.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Equipe de Suporte</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformado para preparar o suporte pós-virada.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <h4 className="text-lg font-semibold text-[#0A3130]">📎 Documento Padrão</h4>
         <p className="text-gray-600">
           Realizar o plano de mudanças é seguir o que foi escrito e planejado no documento de Impactos Organizacionais.
         </p>
         <a
            href="https://gruposipal.sharepoint.com/:x:/s/PMO/Efi9XIBuSF9JtJg_d7i3bDkBQDaXZ5hdBgc9HtK7Ck9tZw?wdOrigin=TEAMS-MAGLEV.p2p_ns.rwc&wdExp=TEAMS-TREATMENT&wdhostclicktime=1753888386123&web=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3095A6]"
            aria-label="Acessar Matriz de Impactos Organizacionais"
          >
            <FileTextIcon className="h-5 w-5" />
            Acessar Matriz de Impactos Organizacionais
          </a>
      </div>
    </div>
  );
};

export default ChangePlanProcedure;