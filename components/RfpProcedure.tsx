import React from 'react';
import { FileTextIcon } from './Icons';

const RfpProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Solicitar Propostas (RFP) (1.4)
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Consiste no envio de um RFP (Request for Proposal) para fornecedores selecionados, com escopo claro e estruturado, buscando obter propostas técnicas e comerciais formais.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Comparar fornecedores com base em critérios padronizados de entrega, preço, prazo e aderência técnica, para apoiar o processo de seleção e contratação.
        </p>
      </div>
      
      {/* RACI Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700">📊 RACI – Aplicação do RFP</h3>
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
                        <td className="p-4 font-medium text-gray-800">Compras</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por conduzir o processo de cotação.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para apoiar na elaboração do escopo.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Fornecedores</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por elaborar e enviar a proposta.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provador da proposta técnica e comercial.</td>
                    </tr>
                     <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Jurídico</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformado para análise contratual futura.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <p className="text-gray-600">Use o modelo padrão para garantir que todos os aspectos sejam cobertos.</p>
         <a
            href="https://gruposipal.sharepoint.com/:x:/s/PMO/EYCpP_sUyLxCpf9EfiFFzsUBdkg1OOVw5qulw0qw6gLGVg?e=0vLxUn"
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

export default RfpProcedure;