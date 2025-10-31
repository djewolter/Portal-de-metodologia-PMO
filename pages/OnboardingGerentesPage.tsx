import React, { useState } from 'react';
import {
  PresentationChartLineIcon,
  ServerStackIcon,
  WrenchScrewdriverIcon,
  RocketIcon,
  ArrowLeftIcon,
  ArrowUpRightFromSquareIcon,
  ChevronRightIcon,
} from '../components/Icons';
import BackButton from '../components/BackButton';

type SectionId = 'pmo' | 'structure' | 'tools-ti' | 'tools-gp';

const sections = [
  { id: 'pmo', title: 'Sobre o PMO', icon: PresentationChartLineIcon },
  { id: 'structure', title: 'Estrutura da TI', icon: ServerStackIcon },
  { id: 'tools-ti', title: 'Ferramentas TI', icon: WrenchScrewdriverIcon },
  { id: 'tools-gp', title: 'Ferramentas Gerente de Projetos', icon: RocketIcon },
];

const OnboardingGerentesPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionId>('pmo');

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'pmo': return <PmoSection />;
      case 'structure': return <TiStructureSection />;
      case 'tools-ti': return <TiToolsSection />;
      case 'tools-gp': return <GpToolsSection />;
      default: return null;
    }
  };

  return (
    <main className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <BackButton />
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3130] mb-3">
            Onboarding para Gerentes de Projeto
          </h1>
          <p className="text-lg text-gray-600">
            Seja bem-vindo(a)! Este guia rápido irá orientá-lo(a) em nossos processos e ferramentas.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Side Navigation */}
          <aside className="md:w-1/4 lg:w-1/5 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <nav className="sticky top-24">
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id as SectionId)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-semibold transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-100 hover:text-[#0A3130]'
                      }`}
                    >
                      <section.icon className="h-6 w-6 flex-shrink-0" />
                      <span>{section.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Content */}
          <section className="flex-1 min-w-0">
             <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '200ms' }}>
                {renderSectionContent()}
             </div>
          </section>
        </div>
      </div>
    </main>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-3xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6">
        {children}
    </h2>
);

const PmoSection: React.FC = () => (
    <div className="space-y-6">
        <SectionTitle>Apresentação do Escritório de Projetos (PMO)</SectionTitle>
        <p className="text-gray-700 leading-relaxed">
            O Escritório de Projetos tem como missão padronizar, organizar e apoiar a execução de projetos estratégicos, garantindo que os objetivos do negócio sejam alcançados com qualidade, prazo e escopo definidos.
        </p>
        <div>
            <h3 className="text-xl font-semibold text-[#0A3130] mb-3">Nosso Propósito</h3>
            <p className="text-gray-700 leading-relaxed bg-[#e0f2fe] p-4 rounded-lg border-l-4 border-[#3095A6]">
                O propósito do PMO é atuar com integridade, excelência e transparência, apoiando o alinhamento estratégico da companhia, garantindo a execução eficiente dos projetos, promovendo a integração entre áreas e contribuindo para resultados sustentáveis que fortaleçam a reputação e a confiança de todas as partes envolvidas.
            </p>
        </div>
        <div>
            <h3 className="text-xl font-semibold text-[#0A3130] mb-3">Objetivos Principais</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Estabelecer uma governança de projetos clara.</li>
                <li>Acompanhar indicadores de desempenho e entregas.</li>
                <li>Atuar como facilitador entre áreas demandantes e áreas técnicas.</li>
                <li>Conduzir processos de priorização e avaliação de viabilidade de projetos.</li>
            </ul>
        </div>
    </div>
);

const TiStructureSection: React.FC = () => (
    <div className="space-y-6">
        <SectionTitle>Estrutura da TI</SectionTitle>
        <p className="text-gray-700 leading-relaxed">
            A área de Tecnologia da Informação é composta por três gerências com papéis bem definidos:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center flex flex-col items-center">
                <img src="https://avatar.iran.liara.run/public/boy?username=FabioLovato" alt="Foto de Fábio Lovato" className="w-24 h-24 rounded-full mb-4 object-cover" />
                <h3 className="text-lg font-bold text-gray-800">Gerência de Infraestrutura</h3>
                <p className="text-sm text-gray-500 mb-2">Responsável: <span className="font-semibold text-[#0A3130]">Fábio Lovato</span></p>
                <p className="text-gray-600 text-sm"><strong>Foco:</strong> redes, servidores, segurança da informação, conectividade, equipamentos.</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center flex flex-col items-center">
                <img src="https://avatar.iran.liara.run/public/boy?username=MatheusPrado" alt="Foto de Matheus Prado" className="w-24 h-24 rounded-full mb-4 object-cover" />
                <h3 className="text-lg font-bold text-gray-800">Gerência de Sustentação</h3>
                <p className="text-sm text-gray-500 mb-2">Responsável: <span className="font-semibold text-[#0A3130]">Matheus Prado</span></p>
                <p className="text-gray-600 text-sm"><strong>Foco:</strong> sistemas legados, suporte técnico, manutenção corretiva/preventiva, atendimento aos usuários.</p>
            </div>
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center flex flex-col items-center">
                <img src="https://avatar.iran.liara.run/public/boy?username=WilianVaz" alt="Foto de Wilian Vaz" className="w-24 h-24 rounded-full mb-4 object-cover" />
                <h3 className="text-lg font-bold text-gray-800">Gerência de Projetos e Inovação</h3>
                <p className="text-sm text-gray-500 mb-2">Responsável: <span className="font-semibold text-[#0A3130]">Wilian Vaz</span></p>
                <p className="text-gray-600 text-sm"><strong>Foco:</strong> novos projetos, integrações, automações, soluções inovadoras e melhorias tecnológicas.</p>
            </div>
        </div>
    </div>
);

const TiToolsSection: React.FC = () => {
    const [activeToolsView, setActiveToolsView] = useState<'main' | 'requisicao' | 'incidentes'>('main');

    const handleBack = () => {
        setActiveToolsView('main');
    };
    
    const requisicaoItems = [
        'Banco de dados', 'Impressora', 'Pasta de rede', 'SAE - Solicitação de acesso e equipamentos (Novos colaboradores)',
        'Novo acesso de usuário', 'Reset de senha', 'E-mail', 'Novos Equipamentos', 'Empréstimo de Equipamentos',
        'Instalação de Software', 'Acesso Sites', 'Acesso VPN', 'Software', 'Manutenção preventiva', 'Mudança de Layout'
    ];

    const incidentesItems = [
        'Falha de acesso a sistema', 'Desktop', 'Notebooks', 'Rede', 'Internet', 'Sistemas',
        'Periféricos', 'Impressora', 'Telecomunicação', 'Servidores', 'Celulares', 'Segurança da Informação'
    ];

    const DetailView: React.FC<{ title: string; items: string[]; onBack: () => void; headerColor: string }> = ({ title, items, onBack, headerColor }) => (
        <div className="animate-fadeIn">
            <button onClick={onBack} className="flex items-center gap-2 mb-6 text-sm font-semibold text-[#0A3130] hover:text-[#3095A6] transition-colors">
                <ArrowLeftIcon className="h-4 w-4" />
                Voltar para Ferramentas
            </button>
            <h3 className={`text-2xl font-bold ${headerColor} mb-6`}>{title}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {items.map(item => (
                <div key={item} className="bg-gray-100 p-4 rounded-lg text-center font-medium text-gray-800 cursor-pointer hover:bg-gray-200 hover:shadow-sm transition-all">
                    {item}
                </div>
                ))}
            </div>
        </div>
    );
    
    if (activeToolsView === 'requisicao') {
        return <DetailView title="Tipos de Requisição" items={requisicaoItems} onBack={handleBack} headerColor="text-[#0A3130]" />;
    }
    
    if (activeToolsView === 'incidentes') {
        return <DetailView title="Tipos de Incidentes" items={incidentesItems} onBack={handleBack} headerColor="text-red-800" />;
    }
    
    return (
        <div className="space-y-6">
            <SectionTitle>Ferramentas de TI e Plataformas Utilizadas</SectionTitle>
            <p className="text-gray-700 leading-relaxed">
                A principal plataforma utilizada para gestão de demandas e projetos é o Jira, que é dividido em três frentes principais:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                    onClick={() => setActiveToolsView('requisicao')}
                    className="bg-[#e0f2fe] p-5 rounded-lg border-2 border-[#3095A6]/50 cursor-pointer hover:bg-[#e0f2fe]/80 hover:shadow-md transition-all transform hover:-translate-y-1"
                >
                    <h3 className="font-bold text-[#0A3130] text-lg">Requisição</h3>
                    <p className="text-[#0A3130] mt-1">Abertura de solicitações, acessos, permissões e demandas administrativas.</p>
                </div>
                <div 
                    onClick={() => setActiveToolsView('incidentes')}
                    className="bg-red-50 p-5 rounded-lg border-2 border-red-200 cursor-pointer hover:bg-red-100 hover:shadow-md transition-all transform hover:-translate-y-1"
                >
                    <h3 className="font-bold text-red-800 text-lg">Incidentes</h3>
                    <p className="text-red-700 mt-1">Registro e acompanhamento de falhas, erros técnicos e indisponibilidades.</p>
                </div>
                <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
                    <h3 className="font-bold text-green-800 text-lg">Melhorias</h3>
                    <p className="text-green-700 mt-1">Solicitação de novas funcionalidades, automações ou otimizações de sistemas e processos.</p>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold text-[#0A3130] mb-3">Benefícios</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Centralização das demandas</li>
                    <li>Rastreabilidade e priorização</li>
                    <li>Medição de SLA e produtividade</li>
                </ul>
            </div>
        </div>
    );
};

const SharePointToolsCard: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const subItems = [
    { 
      name: 'Gestão de Risco', 
      link: 'https://gruposipal.sharepoint.com/sites/PMO/Lists/Riscos/AllItems.aspx',
      description: 'A gestão de riscos é realizada e controlada dentro do SharePoint, onde todos os gerentes de projetos têm acesso. Caso não tenha, favor enviar e-mail para PMO@sipal.com.br solicitando acesso.'
    },
    { 
      name: 'Gestão Financeira', 
      link: 'https://gruposipal.sharepoint.com/sites/PMO',
      description: 'Controle orçamentário, fluxo de caixa e relatórios financeiros dos projetos.'
    },
    { 
      name: 'Gestão de Projetos', 
      link: 'https://gruposipal.sharepoint.com/sites/PMO',
      description: 'Documentação centralizada, colaboração em artefatos e histórico do projeto.'
    }
  ];

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg transition-shadow hover:shadow-md">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsExpanded(!isExpanded)}
      >
        <div>
          <h3 className="font-bold text-lg text-[#0A3130]">SharePoint</h3>
          <p className="text-gray-600 mt-1 text-sm">Nossa plataforma para armazenamento e colaboração de todos os documentos do projeto, garantindo o versionamento e a segurança da informação.</p>
        </div>
        <ChevronRightIcon className={`h-6 w-6 text-gray-500 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} />
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 mt-4 pt-4 border-t border-gray-200' : 'max-h-0'}`}>
        <div className="space-y-3 animate-fadeIn">
          {subItems.map(item => (
            <a 
              key={item.name} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:border-[#3095A6] transition-all"
            >
              <div className="flex items-start justify-between">
                <span className="font-semibold text-gray-700">{item.name}</span>
                <ArrowUpRightFromSquareIcon className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
              </div>
              {item.description && <p className="text-xs text-gray-500 mt-1 pr-4">{item.description}</p>}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};


const GpToolsSection: React.FC = () => (
    <div className="space-y-6">
        <SectionTitle>Ferramentas do Gerente de Projetos</SectionTitle>
        <p className="text-gray-700 leading-relaxed">
            Como Gerente de Projetos na Sipal, você terá à sua disposição um conjunto de ferramentas para planejar, executar e monitorar seus projetos com eficiência.
        </p>
        <div className="space-y-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg text-[#0A3130]">Portal de Metodologia de Projetos</h3>
                <p className="text-gray-600 mt-1">O ponto central para acessar a metodologia, templates, documentos e aceleradores de IA. É a sua principal fonte de consulta.</p>
            </div>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg text-[#0A3130]">Microsoft Project</h3>
                <p className="text-gray-600 mt-1">Utilizado para elaboração e controle de cronogramas. Os templates de cronograma estão disponíveis na seção de Templates.</p>
            </div>
            <SharePointToolsCard />
             <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg text-[#0A3130]">Zeev</h3>
                <p className="text-gray-600 mt-1">Plataforma de workflow utilizada para formalizar processos de controle e apoio, como solicitação de demandas e aprovações.</p>
            </div>
        </div>
    </div>
);


export default OnboardingGerentesPage;