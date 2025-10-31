import React from 'react';
import { FileTextIcon, StarIcon } from './Icons';

const TapProcedure: React.FC = () => {
  return (
    <div className="space-y-10 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3">
            <FileTextIcon className="h-8 w-8 text-[#0A3130]" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
                TAP – Documento de Saída da Fase de Prepare
            </h2>
        </div>
      </div>

      {/* Reason - Highlighted as key output */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-r-lg shadow-sm">
        <h3 className="flex items-center text-xl font-bold text-yellow-900 mb-2">
            <StarIcon className="h-6 w-6 mr-2 text-yellow-500" />
            Motivo – Documento de saída da fase de Prepare
        </h3>
        <p className="text-yellow-800 leading-relaxed">
            Formaliza o início oficial do projeto com base nos alinhamentos realizados, sendo o principal entregável para dar início à execução do projeto.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Autorizar a execução do projeto com base em escopo, prazo, orçamento e responsabilidades aprovados.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          O Termo de Abertura do Projeto (TAP) é o documento que formaliza o início oficial do projeto, consolidando os principais acordos definidos na fase de Prepare.
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
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por elaborar o documento.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para validar as informações.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">Diretoria / Sponsor</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador do Termo de Abertura.</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                        <td className="p-4 font-medium text-gray-800">Equipe do Projeto</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformada sobre o início oficial e as diretrizes.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>
      
      {/* Action Block */}
      <div className="bg-[#e0f2fe] p-6 rounded-lg border border-[#3095A6]/50 text-center space-y-4 mt-8 transition-shadow hover:shadow-md">
         <h4 className="text-lg font-semibold text-[#0A3130]">📎 Documento Padrão</h4>
         <p className="text-[#0A3130]">Utilize o template padrão para a elaboração do Termo de Abertura do Projeto.</p>
         <a
            href="https://gruposipal.sharepoint.com/:w:/r/sites/PMO/_layouts/15/Doc.aspx?sourcedoc=%7B12E018AC-C06D-48BA-B454-1CE434960962%7D&file=PMO-PRE-007%20Termo%20de%20Abertura%20do%20Projeto.docx&action=default&mobileredirect=true"
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

export default TapProcedure;