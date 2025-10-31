import { DeliveryCardData } from '../types';

export const deliveryData: DeliveryCardData[] = [
  {
    id: 'crm-impl',
    title: 'Implantação do Novo Módulo CRM',
    description: 'Concluir as etapas finais para a implantação do novo módulo de CRM, garantindo integração com os sistemas existentes.',
    tasks: [
      { id: 'crm-1', label: 'Validar script de migração de dados' },
      { id: 'crm-2', label: 'Executar testes de aceitação com usuários-chave' },
      { id: 'crm-3', label: 'Preparar ambiente de produção' },
      { id: 'crm-4', label: 'Agendar treinamento final com a equipe de vendas' },
      { id: 'crm-5', label: 'Realizar a virada (Go-Live)' },
    ],
  },
  {
    id: 'agro-onboarding',
    title: 'Onboarding do Projeto "Agro Conectado"',
    description: 'Iniciar as atividades de onboarding para o projeto de IoT no campo, definindo escopo e cronograma iniciais.',
    tasks: [
      { id: 'agro-1', label: 'Realizar reunião de Kick-off' },
      { id: 'agro-2', label: 'Elaborar o Termo de Abertura do Projeto (TAP)' },
      { id: 'agro-3', label: 'Mapear stakeholders e suas responsabilidades' },
      { id: 'agro-4', label: 'Definir o escopo preliminar e as entregas da Fase 1' },
    ],
  },
  {
    id: 'annual-report',
    title: 'Finalização do Relatório Anual de Projetos',
    description: 'Compilar e finalizar o relatório anual de desempenho dos projetos concluídos no último ciclo fiscal.',
    tasks: [
      { id: 'report-1', label: 'Coletar dados de performance (custo, prazo, escopo)' },
      { id: 'report-2', label: 'Redigir o resumo executivo' },
      { id: 'report-3', label: 'Criar os gráficos de indicadores (KPIs)' },
      { id: 'report-4', label: 'Revisar o documento com a diretoria' },
      { id: 'report-5', label: 'Publicar o relatório final na intranet' },
    ],
  },
];
