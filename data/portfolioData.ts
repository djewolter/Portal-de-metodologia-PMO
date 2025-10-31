import { PortfolioProject, Demand, ResourceAllocation, ProjectAdherence } from '../types';

export const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-001',
    name: 'Implantação SAP S/4HANA',
    manager: 'Matheus Kageyama',
    spi: 0.98,
    cpi: 1.02,
    lastUpdate: '2024-07-28',
    status: 'Em andamento',
    size: 'Grande',
    unit: 'TI Corporativo',
    phase: 'Realize',
    summary: 'Projeto estratégico para modernizar o ERP da companhia, visando maior eficiência operacional e integração entre áreas.',
    physicalCurve: [
      { month: 'Jan', planned: 10, actual: 8 },
      { month: 'Fev', planned: 20, actual: 18 },
      { month: 'Mar', planned: 35, actual: 35 },
      { month: 'Abr', planned: 50, actual: 52 },
    ],
    financialCurve: [
        { month: 'Jan', planned: 150000, actual: 145000 },
        { month: 'Fev', planned: 300000, actual: 290000 },
        { month: 'Mar', planned: 450000, actual: 460000 },
        { month: 'Abr', planned: 600000, actual: 590000 },
    ],
    mainDeliveries: [
        { id: 'd1', text: 'Módulo FI/CO configurado', completed: true },
        { id: 'd2', text: 'Módulo SD configurado', completed: true },
        { id: 'd3', text: 'Primeiro ciclo de testes integrados', completed: false },
    ],
    risks: [
        { id: 'r1', text: 'Atraso na migração de dados mestres', level: 'Alto' },
        { id: 'r2', text: 'Baixa adesão dos usuários aos treinamentos', level: 'Médio' },
    ],
    documents: [
        { id: 'doc1', name: 'Termo de Abertura (TAP)', link: '#' },
        { id: 'doc2', name: 'Plano de Projeto', link: '#' },
    ],
    nextSteps: ['Iniciar segundo ciclo de testes', 'Planejar o Go-Live'],
  },
  {
    id: 'proj-002',
    name: 'SAP | Concessionárias',
    manager: 'Leonardo Menezes',
    spi: 1.0,
    cpi: 1.0,
    lastUpdate: '2024-07-31',
    status: 'Em andamento',
    size: 'Grande',
    unit: 'Concessionárias',
    phase: 'Demanda',
    summary: 'Projeto de Discovery para validar a aderência dos processos de negócio das concessionárias ao SAP S/4HANA, identificar GAPs, definir o escopo do projeto de implementação e elaborar o Business Case para aprovação.',
    physicalCurve: [],
    financialCurve: [],
    mainDeliveries: [
        { id: 'd1-sap-c', text: 'Workshops de mapeamento de processo concluídos', completed: true },
        { id: 'd2-sap-c', text: '80% dos requisitos funcionais validados', completed: true },
        { id: 'd3-sap-c', text: 'Escopo (Dentro/Fora) aprovado pelo patrocinador', completed: false },
        { id: 'd4-sap-c', text: 'Business Case preliminar elaborado', completed: false },
    ],
    risks: [
        { id: 'r1-sap-c', text: 'Indisponibilidade de key users para workshops', level: 'Alto' },
        { id: 'r2-sap-c', text: 'Atraso na liberação do ambiente de testes', level: 'Alto' },
    ],
    documents: [
        { id: 'doc1-sap-c', name: 'Business Case (SharePoint)', link: 'https://gruposipal.sharepoint.com/:w:/s/PMO/EUoEXsbqcPVBvOKfXO8OLLIBSQeMd_F1GSZ5TKbLIw0I5Q?e=0eua2v' },
    ],
    nextSteps: [
        'Realizar workshop de processos financeiros.',
        'Apresentar versão preliminar do escopo para o patrocinador.',
    ],
  },
];

export const DEMANDS_BACKLOG: Demand[] = [
  { id: 'dem-01', name: 'Automação do processo de compras', unit: 'Administrativo', responsible: 'Fernanda Lima', status: 'Aprovado' },
  { id: 'dem-02', name: 'Novo portal do colaborador', unit: 'Recursos Humanos', responsible: 'Jorge Martins', status: 'Em análise' },
  { id: 'dem-03', name: 'Sistema de gestão de manutenção industrial', unit: 'Sipal Indústria', responsible: 'Ricardo Souza', status: 'Recusado' },
];

export const RESOURCE_ALLOCATION_DATA: ResourceAllocation[] = [
    {
        resourceName: 'Ana Silva',
        profile: 'Gerente de Projetos Sênior',
        allocations: { 'Jul/24': 100, 'Ago/24': 100, 'Set/24': 80, 'Out/24': 80 },
    },
    {
        resourceName: 'Carlos Pereira',
        profile: 'Gerente de Projetos Pleno',
        allocations: { 'Jul/24': 80, 'Ago/24': 100, 'Set/24': 100, 'Out/24': 100 },
    },
    {
        resourceName: 'Mariana Costa',
        profile: 'Analista Funcional',
        allocations: { 'Jul/24': 50, 'Ago/24': 110, 'Set/24': 90, 'Out/24': 70 },
    },
    {
        resourceName: 'Lucas Mendes',
        profile: 'Desenvolvedor ABAP',
        allocations: { 'Jul/24': 100, 'Ago/24': 100, 'Set/24': 100, 'Out/24': 100 },
    },
    {
        resourceName: 'Pedro Almeida',
        profile: 'Arquiteto de Soluções',
        allocations: { 'Jul/24': 40, 'Ago/24': 60, 'Set/24': 80, 'Out/24': 80 },
    },
    {
        resourceName: 'Sofia Ribeiro',
        profile: 'Analista de Negócios',
        allocations: { 'Jul/24': 0, 'Ago/24': 20, 'Set/24': 50, 'Out/24': 60 },
    },
];

export const ADHERENCE_DATA: ProjectAdherence[] = [
    {
        projectId: 'proj-001',
        projectName: 'Implantação SAP S/4HANA',
        phases: [
            { phaseName: 'Demanda', status: 'Concluído' },
            { phaseName: 'Prepare', status: 'Concluído' },
            { phaseName: 'Explore', status: 'Concluído' },
            { phaseName: 'Realize', status: 'Em Andamento' },
            { phaseName: 'Deploy', status: 'Não Iniciado' },
            { phaseName: 'Run', status: 'Não Iniciado' },
            { phaseName: 'Pós-projeto', status: 'Não Iniciado' },
        ]
    },
];
