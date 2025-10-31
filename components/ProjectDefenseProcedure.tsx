import React from 'react';
import { FileTextIcon } from './Icons';

const ProjectDefenseProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Apresentação de Defesa do Projeto (1.10)
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Apresentação estruturada da demanda aos comitês ou instâncias decisoras, incluindo problema, solução, benefícios, custos, riscos e cronograma.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Convencer os decisores sobre a importância, viabilidade e retorno da iniciativa, buscando sua aprovação formal como projeto.
        </p>
      </div>
      
      {/* RACI Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700">📊 RACI – Defesa do Projeto</h3>
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
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600"><strong>(R)</strong>esponsável por preparar e realizar a apresentação.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultado para apoiar na estruturação da defesa.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Diretoria</td>
                        <td className="p-4 text-gray-600"><strong>(A)</strong>provadora final da proposta de projeto.</td>
                    </tr>
                     <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Stakeholders</td>
                        <td className="p-4 text-gray-600"><strong>(I)</strong>nformados sobre a proposta e a decisão.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Áreas Técnicas</td>
                        <td className="p-4 text-gray-600"><strong>(C)</strong>onsultadas para esclarecer pontos técnicos durante a defesa.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <p className="text-gray-600">Utilize o modelo padrão para a apresentação de defesa do projeto.</p>
         <a
            href="https://gruposipal.sharepoint.com/:p:/s/PMO/EYDBFY2hIwpCrBaO2n7XkLIBtFx1ZrUt-ir7Y0A-VC1cKQ?e=5cqTba"
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

export default ProjectDefenseProcedure;