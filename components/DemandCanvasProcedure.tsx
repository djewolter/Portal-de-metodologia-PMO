import React from 'react';

const DemandCanvasProcedure: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white shadow-md rounded-xl p-6 md:p-8 mb-6 animate-fadeIn">
        <div className="space-y-8 text-gray-800">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-blue-900">
              📝 Canvas de Demanda – Pré-Projeto (1.0)
            </h3>
          </div>

          {/* Functional Description */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-700">Descrição funcional</h4>
            <p className="text-gray-700 leading-relaxed">
              Ferramenta utilizada para registrar e estruturar uma necessidade antes da abertura formal de um projeto.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-gray-700 leading-relaxed">
              <li>Permite compreender o problema, os objetivos esperados, os impactos no negócio, as áreas envolvidas e possíveis restrições.</li>
              <li>Serve como base para avaliação, priorização e aprovação de iniciativas.</li>
              <li>Garante que todas as informações essenciais estejam claras e alinhadas antes de seguir para o ciclo de vida do projeto.</li>
            </ul>
          </div>

          {/* Objective */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-700">🎯 Objetivo</h4>
            <p className="text-gray-700 leading-relaxed">
              Padronizar a captação de demandas, promovendo clareza, engajamento das áreas impactadas e apoio à tomada de decisão pelo Escritório de Projetos (PMO).
            </p>
          </div>
          
          {/* RACI Table */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-gray-700">👥 RACI – Aplicação do Canvas de Demanda</h4>
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

          {/* Observation */}
          <div className="bg-amber-100/60 border-l-4 border-amber-500 text-amber-900 p-4 rounded-r-lg">
            <h4 className="font-bold mb-1">💡 Observação</h4>
            <p>
              Esta etapa é realizada pelo solicitante com apoio do Escritório de Projetos (PMO), via plataforma Zeev.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandCanvasProcedure;
