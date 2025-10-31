import React from 'react';
import { FileTextIcon } from './Icons';

const DemandEvaluationProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Canvas de Demanda – Pré-Projeto (1.2)
        </h2>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700">📝 Descrição</h3>
        <p className="text-gray-700 leading-relaxed">
          Ferramenta utilizada para registrar e estruturar uma necessidade antes da abertura formal de um projeto. Permite compreender o problema, os objetivos esperados, os impactos no negócio, as áreas envolvidas e possíveis restrições.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Serve como base para avaliação, priorização e aprovação de iniciativas, garantindo que todas as informações essenciais estejam claras e alinhadas antes de seguir para as próximas etapas do ciclo de vida do projeto.
        </p>
      </div>

      {/* Objective */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-700">🎯 Objetivo</h3>
        <p className="text-gray-700 leading-relaxed">
          Padronizar a captação de demandas, promovendo clareza, engajamento das áreas impactadas e apoio à tomada de decisão pelo Escritório de Projetos (PMO).
        </p>
      </div>
      
      {/* RACI Table */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-700">📊 RACI – Aplicação do Canvas de Demanda</h3>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-4 font-semibold text-gray-700">Função</th>
                        <th className="p-4 font-semibold text-gray-700">Papel no Canvas</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Solicitante</td>
                        <td className="p-4 text-gray-600">Responsável por preencher o canvas com a descrição da demanda.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">PMO</td>
                        <td className="p-4 text-gray-600">Aprovador e facilitador da análise e priorização. Garante que o canvas esteja completo e consistente.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Gestores</td>
                        <td className="p-4 text-gray-600">Consultados sobre impactos, prioridades e alinhamento estratégico.</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-gray-800">Áreas Impactadas</td>
                        <td className="p-4 text-gray-600">Informadas sobre a eventual entrada da demanda no pipeline de projetos.</td>
                    </tr>
                </tbody>
            </table>
        </div>
      </div>

      {/* Final Observation */}
      <div className="bg-amber-100/60 border-l-4 border-amber-500 text-amber-900 p-4 rounded-r-lg">
        <p>
          <span className="font-bold">Observação:</span> Esta etapa é realizada pelo solicitante com apoio do Escritório de Projetos (PMO), via plataforma Zeev.
        </p>
      </div>

      {/* Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-4 mt-8">
        <div>
           <a
            href="https://gruposipal.sharepoint.com/:p:/s/PMO/ES_6-AMwMIBEgo7nz6keJzoBpXVswHf6GRDW3CQch2yWIw?e=VqWTn3"
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
    </div>
  );
};

export default DemandEvaluationProcedure;