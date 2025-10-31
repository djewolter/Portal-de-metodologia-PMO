import React from 'react';
import { FileTextIcon } from './Icons';

const ScheduleProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Elaborar Cronograma (3.3)
        </h2>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Organizar e controlar o tempo do projeto, possibilitando acompanhamento da execução e gestão de prazos.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Montagem do cronograma com marcos, tarefas, durações, predecessores e responsáveis, a partir da EAP e dos recursos disponíveis.
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
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por criar e manter o cronograma.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Fornecedor</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para estimar durações e dependências.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Equipe do Projeto</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultada para detalhar as tarefas.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Diretoria / Sponsor</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador da linha de base do cronograma.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <h4 className="text-lg font-semibold text-[#0A3130]">📎 Documento Padrão</h4>
         <p className="text-gray-600">Utilize o modelo padrão para o cronograma do projeto.</p>
         <p className="text-sm text-red-600 font-semibold mt-1">Atenção: Este arquivo deve ser aberto no Project, se não possuir instalado em seu notebook abra um chamado.</p>
         <a
            href="https://gruposipal.sharepoint.com/sites/PMO/Documentao%20de%20Projetos/Forms/AllItems.aspx?id=%2Fsites%2FPMO%2FDocumentao%20de%20Projetos%2F%23%20PMO%20%2D%20Escrit%C3%B3rio%20de%20Projetos%2FMetodologia%20PMO%2FArtefatos%20por%20Fase%2FDocumentos%20Revisados%5Fjul25%2F3%2E%20Explore%2FPMO%2DEXP%2D003%20Template%20cronograma%2Empp&parent=%2Fsites%2FPMO%2FDocumentao%20de%20Projetos%2F%23%20PMO%20%2D%20Escrit%C3%B3rio%20de%20Projetos%2FMetodologia%20PMO%2FArtefatos%20por%20Fase%2FDocumentos%20Revisados%5Fjul25%2F3%2E%20Explore&p=true&ga=1"
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

export default ScheduleProcedure;