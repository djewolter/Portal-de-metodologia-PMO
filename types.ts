

export interface BaseActivity {
  id: string;
  name: string;
  isPmoAction: boolean;
  description?: string;
  icon?: string;
}

export interface Activity extends BaseActivity {
  isMandatory: boolean;
  isOutputDocument?: boolean;
  isSprintActivity?: boolean;
}

export interface Phase {
  id: number;
  name: string;
  color: string;
  highlightColor: string;
  textColor: string;
  activities: Activity[];
  hasSprints?: boolean;
}

export interface ControlSupportProcess {
  id: string;
  name: string;
  objective: string;
  responsible: string;
  frequency: string;
}

export interface SearchableItem {
  id: string;
  title: string;
  description: string;
  path: string;
  type: 'Fase' | 'Atividade' | 'Processo de Controle';
}

export interface DeliveryTask {
  id: string;
  label: string;
}

export interface DeliveryCardData {
  id: string;
  title: string;
  description: string;
  tasks: DeliveryTask[];
}

export interface TemplateDocument {
  id: string;
  name: string;
  type: 'Template' | 'Apresentação' | 'Checklist' | 'Guia' | 'Relatório';
  phase: 'Demanda' | 'Prepare' | 'Explore' | 'Realize' | 'Deploy' | 'Run' | 'Pós-projeto' | 'Outros';
  description: string;
  link: string;
}

export interface PortfolioProject {
  id: string;
  name: string;
  manager: string;
  spi: number;
  cpi: number;
  lastUpdate: string;
  status: 'Em andamento' | 'Concluído' | 'Atrasado' | 'Em Risco' | 'Suspenso' | 'Não Iniciado' | 'Atrasado (replanejado data de entrega)' | 'Go Live realizado. Operação assistida';
  size: 'Grande' | 'Médio' | 'Pequeno';
  unit: string;
  phase: 'Demanda' | 'Prepare' | 'Explore' | 'Realize' | 'Deploy' | 'Run' | 'Pós-projeto' | 'Não Iniciado';
  summary: string;
  physicalCurve: { month: string; planned: number; actual: number }[];
  financialCurve: { month: string; planned: number; actual: number }[];
  mainDeliveries: { id: string; text: string; completed: boolean }[];
  risks: { id: string; text: string; level: 'Alto' | 'Médio' | 'Baixo' }[];
  documents: { id: string; name: string; link: string }[];
  nextSteps: string[];
}

export interface Demand {
  id: string;
  name: string;
  unit: string;
  responsible: string;
  status: 'Em análise' | 'Aprovado' | 'Recusado';
}

export interface ResourceAllocation {
    resourceName: string;
    profile: string;
    allocations: { [month: string]: number };
}


export interface ProjectAdherence {
  projectId: string;
  projectName: string;
  phases: {
    phaseName: 'Demanda' | 'Prepare' | 'Explore' | 'Realize' | 'Deploy' | 'Run' | 'Pós-projeto';
    status: 'Concluído' | 'Em Andamento' | 'Não Iniciado' | 'Com Pendência';
  }[];
}

export interface SCurveDataPoint {
  id: string; // "Data" field as string 'dd/mm/yyyy'
  planejado: number;
  realizado: number;
  spi: number;
  data: Date;
  mes: string;
}