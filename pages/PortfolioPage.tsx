

import React, { useState, useMemo, useEffect } from 'react';
// FIX: Use namespace import for react-router-dom to address module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { PORTFOLIO_PROJECTS } from '../data/portfolioData';
import { PortfolioProject } from '../types';
import ProjectPortfolioCard from '../components/ProjectPortfolioCard';
import Modal from '../components/Modal';
import { 
    InformationCircleIcon, 
    ChartBarIcon, 
    TableCellsIcon, 
    UsersIcon, 
    ClipboardCheckIcon,
    PlusIcon,
    EyeIcon,
    EyeSlashIcon,
    TrashIcon
} from '../components/Icons';
import BackButton from '../components/BackButton';

type PortfolioTab = 'instructions' | 'overview' | 'backlog' | 'allocation' | 'adherence';

const TABS: { id: PortfolioTab; title: string; icon: React.FC<{className?: string}> }[] = [
    { id: 'instructions', title: 'Como funciona', icon: InformationCircleIcon },
    { id: 'overview', title: 'Visão Geral', icon: ChartBarIcon },
    { id: 'backlog', title: 'Backlog', icon: TableCellsIcon },
    { id: 'allocation', title: 'Alocação', icon: UsersIcon },
    { id: 'adherence', title: 'Aderência', icon: ClipboardCheckIcon },
];

const INITIAL_PROJECT_STATE: PortfolioProject = {
  id: '',
  name: '',
  manager: '',
  spi: 1.0,
  cpi: 1.0,
  lastUpdate: new Date().toISOString().split('T')[0],
  status: 'Não Iniciado',
  size: 'Pequeno',
  unit: '',
  phase: 'Não Iniciado',
  summary: '',
  physicalCurve: [],
  financialCurve: [],
  mainDeliveries: [{ id: `del-${Date.now()}`, text: '', completed: false }],
  risks: [{ id: `risk-${Date.now()}`, text: '', level: 'Baixo' }],
  documents: [{ id: `doc-${Date.now()}`, name: '', link: '' }],
  nextSteps: [''],
};


// --- Sub-components for each tab ---

const PlaceholderSection: React.FC<{ title: string }> = ({ title }) => (
    <div className="animate-fadeIn flex flex-col items-center justify-center h-full min-h-[300px] text-center text-gray-500">
        <h3 className="text-2xl font-bold text-gray-700 mb-2">{title}</h3>
        <p className="text-lg">Página em execução.</p>
    </div>
);

const InstructionsSection: React.FC<{ setActiveTab: (tab: PortfolioTab) => void }> = ({ setActiveTab }) => (
    <div className="space-y-6 animate-fadeIn">
        <h3 className="text-2xl font-bold text-gray-800">Como funciona o Portfólio de Projetos</h3>
        <p className="text-gray-700 leading-relaxed">Esta seção oferece uma visão completa e transparente de todas as iniciativas gerenciadas pelo PMO. Utilize as abas para navegar entre as diferentes visões do nosso portfólio.</p>
        
        <div className="p-5 bg-[#e0f2fe] border-l-4 border-[#3095A6] rounded-r-lg">
            <h4 className="font-bold text-[#0A3130] mb-2">Critérios de Categorização</h4>
            <p className="text-[#0A3130]">Os projetos são classificados por tamanho (Grande, Médio, Pequeno) com base em orçamento, duração e impacto estratégico.</p>
        </div>
        <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <h4 className="font-bold text-green-800 mb-2">Indicadores de Desempenho (SPI & CPI)</h4>
            <p className="text-green-700">Acompanhamos o desempenho de Prazo (SPI) e Custo (CPI). Índices acima de 1.0 são considerados saudáveis.</p>
        </div>
        
        <button 
            onClick={() => setActiveTab('overview')}
            className="mt-4 inline-flex items-center gap-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:brightness-110 transition-colors"
        >
            Ir para visão de projetos
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
        </button>
    </div>
);

const OverviewSection: React.FC<{ projects: PortfolioProject[]; onAddProject: () => void; onEdit: (project: PortfolioProject) => void; }> = ({ projects, onAddProject, onEdit }) => {
    const [filters, setFilters] = useState({ status: '', size: '', manager: '' });
    
    const managers = useMemo(() => [...new Set(projects.map(p => p.manager))].sort(), [projects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            return (filters.status ? p.status === filters.status : true) &&
                   (filters.size ? p.size === filters.size : true) &&
                   (filters.manager ? p.manager === filters.manager : true);
        });
    }, [filters, projects]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h3 className="text-2xl font-bold text-gray-800">Visão Geral dos Projetos</h3>
                <button
                    onClick={onAddProject}
                    className="flex items-center gap-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:brightness-110 transition-colors"
                >
                    <PlusIcon className="h-5 w-5" />
                    Adicionar Projeto
                </button>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 flex flex-wrap gap-4 items-center">
                <select name="status" onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md">
                    <option value="">Todos os Status</option>
                    {[...new Set(projects.map(p => p.status))].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select name="size" onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md">
                    <option value="">Todos os Tamanhos</option>
                    <option value="Grande">Grande</option>
                    <option value="Médio">Médio</option>
                    <option value="Pequeno">Pequeno</option>
                </select>
                <select name="manager" onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md">
                    <option value="">Todos os Gerentes</option>
                    {managers.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <ProjectPortfolioCard key={project.id} project={project} onEdit={() => onEdit(project)} />
                ))}
            </div>
             {filteredProjects.length === 0 && <p className="text-center text-gray-500 col-span-full py-10">Nenhum projeto encontrado com os filtros selecionados.</p>}
        </div>
    );
};

const BacklogSection: React.FC = () => <PlaceholderSection title="Backlog de Demandas" />;
const AllocationSection: React.FC = () => <PlaceholderSection title="Alocação de Recursos" />;
const AdherenceSection: React.FC = () => <PlaceholderSection title="Aderência à Metodologia" />;


// --- Main Portfolio Page Component ---

const PortfolioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PortfolioTab>('instructions');
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<PortfolioProject | null>(null);

  useEffect(() => {
    try {
        const localData = window.localStorage.getItem('sipal-pmo-projects');
        setProjects(localData ? JSON.parse(localData) : PORTFOLIO_PROJECTS);
    } catch (error) {
        console.error("Could not parse projects from localStorage", error);
        setProjects(PORTFOLIO_PROJECTS);
    }
  }, []);

  useEffect(() => {
    try {
        window.localStorage.setItem('sipal-pmo-projects', JSON.stringify(projects));
    } catch (error) {
        console.error("Could not save projects to localStorage", error);
    }
  }, [projects]);
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'M3TODOL@GIA_PMO') {
        setShowPasswordModal(false);
        handleOpenAddModal();
        setPasswordInput('');
        setPasswordError('');
        setShowPassword(false);
    } else {
        setPasswordError('Senha incorreta. Tente novamente.');
    }
  };
  
  const handleOpenAddModal = () => {
    setCurrentProject(JSON.parse(JSON.stringify(INITIAL_PROJECT_STATE)));
    setIsProjectModalOpen(true);
  };
  
  const handleOpenEditModal = (project: PortfolioProject) => {
    setCurrentProject(JSON.parse(JSON.stringify(project))); // Deep copy to avoid direct state mutation
    setIsProjectModalOpen(true);
  };
  
  const handleCloseProjectModal = () => {
      setIsProjectModalOpen(false);
      setCurrentProject(null);
  }

  const handleProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      if (!currentProject) return;
      const { name, value, type } = e.target;
      const isNumber = type === 'number';
      setCurrentProject({ ...currentProject, [name]: isNumber ? parseFloat(value) : value });
  };
  
  const handleDynamicListChange = (listName: 'mainDeliveries' | 'risks' | 'documents' | 'nextSteps', index: number, field: string, value: any) => {
      if (!currentProject) return;
      const list = [...(currentProject[listName] as any[])];
      if (listName === 'nextSteps') {
          list[index] = value;
      } else {
          list[index] = { ...list[index], [field]: value };
      }
      setCurrentProject({ ...currentProject, [listName]: list });
  };

  const addDynamicListItem = (listName: 'mainDeliveries' | 'risks' | 'documents' | 'nextSteps') => {
      if (!currentProject) return;
      let newItem: any;
      switch(listName) {
          case 'mainDeliveries': newItem = { id: `del-${Date.now()}`, text: '', completed: false }; break;
          case 'risks': newItem = { id: `risk-${Date.now()}`, text: '', level: 'Baixo' }; break;
          case 'documents': newItem = { id: `doc-${Date.now()}`, name: '', link: '' }; break;
          case 'nextSteps': newItem = ''; break;
      }
      setCurrentProject({ ...currentProject, [listName]: [...(currentProject[listName] as any[]), newItem] });
  };
  
  const removeDynamicListItem = (listName: 'mainDeliveries' | 'risks' | 'documents' | 'nextSteps', index: number) => {
       if (!currentProject) return;
       const list = [...(currentProject[listName] as any[])];
       list.splice(index, 1);
       setCurrentProject({ ...currentProject, [listName]: list });
  };

  const handleSaveProject = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentProject) return;
      
      const projectExists = projects.some(p => p.id === currentProject.id);

      if (projectExists) {
          setProjects(projects.map(p => p.id === currentProject.id ? currentProject : p));
      } else {
          const newProject = { ...currentProject, id: `proj-${Date.now()}`};
          setProjects([...projects, newProject]);
      }
      handleCloseProjectModal();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'instructions': return <InstructionsSection setActiveTab={setActiveTab} />;
      case 'overview': return <OverviewSection projects={projects} onAddProject={() => setShowPasswordModal(true)} onEdit={handleOpenEditModal} />;
      case 'backlog': return <BacklogSection />;
      case 'allocation': return <AllocationSection />;
      case 'adherence': return <AdherenceSection />;
      default: return null;
    }
  };

  return (
    <main className="flex-grow bg-gray-100">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <BackButton />
        <header className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3130] mb-3">
            Portfólio de Projetos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Acompanhe o status, o desempenho e a alocação de todas as iniciativas estratégicas da Sipal.
          </p>
        </header>
        
        <div className="sticky top-0 z-20 bg-gray-100/80 backdrop-blur-sm py-4 mb-8">
            <div className="flex justify-center flex-wrap gap-2 md:gap-4 border-b-2 border-gray-200 pb-4">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm md:px-4 md:py-2.5 md:text-base font-semibold rounded-full transition-all duration-200 ${
                            activeTab === tab.id
                            ? 'bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-200 hover:text-[#0A3130]'
                        }`}
                    >
                        <tab.icon className="h-5 w-5" />
                        <span>{tab.title}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-white/80 p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 min-h-[400px]">
            {renderContent()}
        </div>
      </div>
      
      {/* Password Modal */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">Acesso Restrito</h3>
            <p className="text-gray-600">Por favor, insira a senha para adicionar um novo projeto.</p>
            <div>
                <label htmlFor="senhaProjeto" className="block text-sm font-medium text-gray-700">Senha</label>
                <div className="relative mt-1">
                    <input
                        id="senhaProjeto"
                        type={showPassword ? 'text' : 'password'}
                        value={passwordInput}
                        onChange={e => {
                            setPasswordInput(e.target.value);
                            if (passwordError) setPasswordError('');
                        }}
                        placeholder="Senha"
                        className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3095A6] focus:border-[#3095A6] text-black"
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                        {showPassword ? (
                            <EyeSlashIcon className="h-6 w-6" />
                        ) : (
                            <EyeIcon className="h-6 w-6" />
                        )}
                    </button>
                </div>
                {passwordError && <p id="erroSenha" className="text-red-600 text-sm mt-2">{passwordError}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                <button 
                    type="submit" 
                    className="px-4 py-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white rounded-md hover:brightness-110 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                    disabled={!passwordInput.trim()}
                >
                    Confirmar
                </button>
            </div>
        </form>
      </Modal>

      {/* Add/Edit Project Modal */}
       <Modal isOpen={isProjectModalOpen} onClose={handleCloseProjectModal}>
            {currentProject && (
                <form onSubmit={handleSaveProject} className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-800">{currentProject.id ? 'Editar Projeto' : 'Adicionar Novo Projeto'}</h3>

                    {/* General Info */}
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold">Informações Gerais</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="lg:col-span-3">
                                <label>Nome do Projeto</label>
                                <input name="name" value={currentProject.name} onChange={handleProjectInputChange} required className="mt-1 w-full p-2 border rounded-md text-black" />
                            </div>
                            <input name="manager" value={currentProject.manager} onChange={handleProjectInputChange} placeholder="GP Responsável" required className="p-2 border rounded-md text-black" />
                            <select name="status" value={currentProject.status} onChange={handleProjectInputChange} className="p-2 border rounded-md text-black">
                                <option>Não Iniciado</option>
                                <option>Demanda</option>
                                <option>Prepare</option>
                                <option>Explore</option>
                                <option>Realize</option>
                                <option>Deploy</option>
                                <option>Run</option>
                                <option>Pós-projeto</option>
                                <option>Em andamento</option>
                                <option>Concluído</option>
                                <option>Atrasado</option>
                                <option>Em Risco</option>
                                <option>Suspenso</option>
                                <option>Atrasado (replanejado data de entrega)</option>
                                <option>Go Live realizado. Operação assistida</option>
                            </select>
                            <select name="size" value={currentProject.size} onChange={handleProjectInputChange} className="p-2 border rounded-md text-black">
                                <option>Pequeno</option>
                                <option>Médio</option>
                                <option>Grande</option>
                            </select>
                            <select name="phase" value={currentProject.phase} onChange={handleProjectInputChange} className="p-2 border rounded-md text-black">
                                <option>Não Iniciado</option><option>Demanda</option><option>Prepare</option><option>Explore</option><option>Realize</option><option>Deploy</option><option>Run</option><option>Pós-projeto</option>
                            </select>
                             <input name="unit" value={currentProject.unit} onChange={handleProjectInputChange} placeholder="Unidade/Área" className="p-2 border rounded-md text-black" />
                             <input type="date" name="lastUpdate" value={currentProject.lastUpdate} onChange={handleProjectInputChange} className="p-2 border rounded-md text-black" />
                             <input type="number" step="0.01" name="spi" value={currentProject.spi} onChange={handleProjectInputChange} placeholder="SPI" className="p-2 border rounded-md text-black" />
                             <input type="number" step="0.01" name="cpi" value={currentProject.cpi} onChange={handleProjectInputChange} placeholder="CPI" className="p-2 border rounded-md text-black" />
                        </div>
                    </fieldset>
                    
                    <fieldset className="border p-4 rounded-lg"><legend className="px-2 font-semibold">Resumo Executivo</legend><textarea name="summary" value={currentProject.summary} onChange={handleProjectInputChange} rows={3} className="w-full p-2 border rounded-md text-black" /></fieldset>

                    {/* Main Deliveries */}
                    <fieldset className="border p-4 rounded-lg space-y-2"><legend className="px-2 font-semibold">Principais Entregas</legend>
                        {currentProject.mainDeliveries.map((d, i) => (<div key={d.id} className="flex items-center gap-2"><input type="checkbox" checked={d.completed} onChange={e => handleDynamicListChange('mainDeliveries', i, 'completed', e.target.checked)} className="h-5 w-5 rounded" /><input value={d.text} onChange={e => handleDynamicListChange('mainDeliveries', i, 'text', e.target.value)} className="flex-1 p-2 border rounded-md text-black" placeholder={`Entrega ${i + 1}`} /><button type="button" onClick={() => removeDynamicListItem('mainDeliveries', i)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5"/></button></div>))}
                        <button type="button" onClick={() => addDynamicListItem('mainDeliveries')} className="text-sm font-semibold text-[#0A3130] hover:underline">+ Adicionar Entrega</button>
                    </fieldset>

                    {/* Risks */}
                    <fieldset className="border p-4 rounded-lg space-y-2"><legend className="px-2 font-semibold">Riscos e Escalonamentos</legend>
                        {currentProject.risks.map((r, i) => (<div key={r.id} className="flex items-center gap-2"><input value={r.text} onChange={e => handleDynamicListChange('risks', i, 'text', e.target.value)} className="flex-1 p-2 border rounded-md text-black" placeholder={`Risco ${i+1}`} /><select value={r.level} onChange={e => handleDynamicListChange('risks', i, 'level', e.target.value)} className="p-2 border rounded-md text-black"><option>Baixo</option><option>Médio</option><option>Alto</option></select><button type="button" onClick={() => removeDynamicListItem('risks', i)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5"/></button></div>))}
                        <button type="button" onClick={() => addDynamicListItem('risks')} className="text-sm font-semibold text-[#0A3130] hover:underline">+ Adicionar Risco</button>
                    </fieldset>
                    
                    {/* Next Steps */}
                    <fieldset className="border p-4 rounded-lg space-y-2"><legend className="px-2 font-semibold">Próximos Passos</legend>
                        {currentProject.nextSteps.map((s, i) => (<div key={i} className="flex items-center gap-2"><input value={s} onChange={e => handleDynamicListChange('nextSteps', i, '', e.target.value)} className="flex-1 p-2 border rounded-md text-black" placeholder={`Passo ${i+1}`} /><button type="button" onClick={() => removeDynamicListItem('nextSteps', i)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5"/></button></div>))}
                        <button type="button" onClick={() => addDynamicListItem('nextSteps')} className="text-sm font-semibold text-[#0A3130] hover:underline">+ Adicionar Passo</button>
                    </fieldset>
                    
                    {/* Documents */}
                    <fieldset className="border p-4 rounded-lg space-y-2"><legend className="px-2 font-semibold">Documentos</legend>
                        {currentProject.documents.map((d, i) => (<div key={d.id} className="flex items-center gap-2"><input value={d.name} onChange={e => handleDynamicListChange('documents', i, 'name', e.target.value)} className="flex-1 p-2 border rounded-md text-black" placeholder="Nome do Documento" /><input value={d.link} onChange={e => handleDynamicListChange('documents', i, 'link', e.target.value)} className="flex-1 p-2 border rounded-md text-black" placeholder="Link" /><button type="button" onClick={() => removeDynamicListItem('documents', i)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><TrashIcon className="h-5 w-5"/></button></div>))}
                        <button type="button" onClick={() => addDynamicListItem('documents')} className="text-sm font-semibold text-[#0A3130] hover:underline">+ Adicionar Documento</button>
                    </fieldset>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={handleCloseProjectModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white rounded-md hover:brightness-110">Salvar Projeto</button>
                    </div>
                </form>
            )}
      </Modal>

    </main>
  );
};

export default PortfolioPage;