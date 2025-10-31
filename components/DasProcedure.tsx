import React from 'react';
import { FileTextIcon } from './Icons';

const DasProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Mapear Arquitetura (DAS) (1.5)
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Levantamento técnico da arquitetura da solução proposta pelos fornecedores (DAS – Desenho da Arquitetura da Solução), incluindo integrações, infraestrutura, segurança e aderência ao ambiente da empresa.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Assegurar que a proposta técnica seja compatível com a arquitetura corporativa, segura, escalável e integrada aos sistemas existentes.
        </p>
      </div>
      
      {/* RACI Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700">📊 RACI – Mapeamento da Arquitetura</h3>
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
                        <td className="p-4 font-medium text-gray-800">Arquitetura de TI</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por avaliar e validar o DAS.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Fornecedor</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para fornecer as informações do DAS.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformado sobre a compatibilidade da solução.</td>
                    </tr>
                     <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para alinhar requisitos funcionais.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Segurança da Informação</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador dos aspectos de segurança da arquitetura.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <p className="text-gray-600">Utilize o modelo de DAS para documentar a arquitetura da solução.</p>
         <a
            href="https://gruposipal.sharepoint.com/:w:/s/PMO/Ebbwg2zmg_ZPsoPBo253r7YBqh6MRaMvKQk4pKJUvBTAXg?e=FBjVBa"
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

export default DasProcedure;