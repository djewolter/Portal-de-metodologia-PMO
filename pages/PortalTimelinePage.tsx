import React from 'react';
import BackButton from '../components/BackButton';
import { CheckCircleIcon, RocketIcon, ClipboardCheckIcon } from '../components/Icons';

const Section: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 animate-fadeIn">
    <h2 className="text-2xl md:text-3xl font-bold text-[#0A3130] mb-6 flex items-center gap-3">
      {icon}
      {title}
    </h2>
    {children}
  </div>
);

const ListItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-3">
    <CheckCircleIcon className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
    <span className="text-gray-700">{children}</span>
  </li>
);

const SprintDetailCard: React.FC<{ sprint: string; title: string; items: string[] }> = ({ sprint, title, items }) => (
    <div className="bg-gray-50/80 p-5 rounded-lg border border-gray-200">
        <h4 className="font-bold text-lg text-[#0A3130]">{sprint} – {title}</h4>
        <ul className="mt-3 list-disc list-inside space-y-2 text-gray-600">
            {items.map((item, index) => <li key={index}>{item}</li>)}
        </ul>
    </div>
);


const PortalTimelinePage: React.FC = () => {
  const completedItems = [
    'Página inicial e estrutura metodológica',
    'Metodologia por fase (Prepare, Explore, Realize, Deploy, Run)',
    'Documentação obrigatória por tipo e porte de projeto',
    'Modelos base (templates por fase)',
    'Repositório de documentos',
    'Relatório Financeiro Automatizado',
    'Status Report do Projeto Automatizado',
    'Gerador de Ata Automatizado',
    'Analisador de Contrato por IA',
  ];

  const futureSprints = [
    { sprint: 'Sprint 1', period: 'Agosto', delivery: 'Portfólio de Projetos com API no Project' },
    { sprint: 'Sprint 2', period: 'Setembro', delivery: 'Acelerador do Gerente de Projetos' },
    { sprint: 'Sprint 3', period: 'Outubro', delivery: 'Quality Gate Automatizado' },
    { sprint: 'Sprint 4', period: 'Novembro', delivery: 'CAB – Comitê de Aprovação de Mudanças' },
  ];

  return (
    <main className="flex-grow bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <BackButton />
        <header className="text-center animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3130] mb-3">
            Cronograma do Portal de Metodologia
          </h1>
          <p className="text-lg text-gray-600">
            Acompanhe a evolução do nosso portal, desde as entregas já realizadas até o planejamento futuro.
          </p>
        </header>

        <Section title="Entregas Já Realizadas (Sprint 0)" icon={<ClipboardCheckIcon className="h-8 w-8 text-[#498733]" />}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            {completedItems.map((item, index) => (
              <ListItem key={index}>{item}</ListItem>
            ))}
          </ul>
        </Section>
        
        <Section title="Planejamento de Entregas Futuras – Sprints" icon={<RocketIcon className="h-8 w-8 text-[#3095A6]" />}>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Sprint</th>
                  <th className="p-4 font-semibold text-gray-700">Período</th>
                  <th className="p-4 font-semibold text-gray-700">Entrega Principal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {futureSprints.map((sprint, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{sprint.sprint}</td>
                    <td className="p-4 text-gray-600">{sprint.period}</td>
                    <td className="p-4 text-gray-600">{sprint.delivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        
        <Section title="Detalhamento das Entregas Futuras">
             <div className="space-y-6">
                <SprintDetailCard 
                    sprint="Sprint 1"
                    title="Portfólio de Projetos"
                    items={[
                        'Integração com API do MS Project',
                        'Visualização de status por projeto',
                        'Filtro por fase, porte e área solicitante',
                    ]}
                />
                <SprintDetailCard 
                    sprint="Sprint 2"
                    title="Acelerador do Gerente de Projetos"
                    items={[
                        'Checklist por fase com prompts aplicáveis',
                        'Geração automatizada de artefatos',
                        'Orientações práticas para cada entrega',
                    ]}
                />
                 <SprintDetailCard 
                    sprint="Sprint 3"
                    title="Quality Gate Automatizado"
                    items={[
                        'Validação automatizada de entregas por fase',
                        'Alerta de pendências e atrasos',
                        'Integração com portal de governança',
                    ]}
                />
                 <SprintDetailCard 
                    sprint="Sprint 4"
                    title="CAB (Comitê de Aprovação de Mudanças)"
                    items={[
                        'Fluxo de submissão e critérios de avaliação',
                        'Templates e painel de decisões',
                        'Histórico e trilha de mudanças aprovadas',
                    ]}
                />
             </div>
        </Section>

      </div>
    </main>
  );
};

export default PortalTimelinePage;