import React from 'react';
import { FileTextIcon } from './Icons';

const WbsProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Estrutura Analítica do Projeto (EAP) (3.2)
        </h2>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Organizar visualmente as entregas do projeto em componentes gerenciáveis, servindo de base para o cronograma, orçamentos e alocação de times.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Quebra hierárquica do projeto em entregas e pacotes de trabalho, facilitando a gestão de escopo, prazos, recursos e responsabilidades.
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
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por criar e manter a EAP.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para validar as entregas.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Fornecedor</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para detalhar pacotes de trabalho.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Equipe do Projeto</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformada sobre a estrutura de trabalho.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <h4 className="text-lg font-semibold text-[#0A3130]">📎 Documento Padrão</h4>
         <p className="text-gray-600">Utilize a estrutura padrão para a EAP.</p>
         <a
            href="https://gruposipal.sharepoint.com/sites/PMO/Documentao%20de%20Projetos/Forms/AllItems.aspx?id=%2Fsites%2FPMO%2FDocumentao%20de%20Projetos%2F%23%20PMO%20%2D%20Escrit%C3%B3rio%20de%20Projetos%2FMetodologia%20PMO%2FArtefatos%20por%20Fase%2FDocumentos%20Revisados%5Fjul25%2F3%2E%20Explore%2FPMO%2DEXP%2D002%20Estrutura%20Anal%C3%ADtica%20de%20Projetos%2Exmind&parent=%2Fsites%2FPMO%2FDocumentao%20de%20Projetos%2F%23%20PMO%20%2D%20Escrit%C3%B3rio%20de%20Projetos%2FMetodologia%20PMO%2FArtefatos%20por%20Fase%2FDocumentos%20Revisados%5Fjul25%2F3%2E%20Explore&p=true&ga=1"
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

export default WbsProcedure;