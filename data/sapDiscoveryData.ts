export const sapDiscoveryData = {
  header: { statusGeral: 'Verde', atualizadoEmISO: '2024-07-31T10:00:00Z' },
  kpis: {
    workshops: { realizados: 8, planejados: 10, concluidosPercent: 80 },
    requisitos: { capturados: 45, validadosPercent: 80 },
    riscos: { abertos: 2, fechados: 3, total: 5 },
  },
  objetivoDiscovery: 'Validar a aderência dos processos de negócio das concessionárias Sipal ao SAP S/4HANA, identificar GAPs, definir o escopo do projeto de implementação e elaborar o Business Case para aprovação.',
  governanca: {
    patrocinador: { nome: 'Carlos Alberto de Nóbrega', cargo: 'Diretor de Operações' },
    gpSipal: { nome: 'Juliana Savi', contato: 'juliana.savi@sipal.com.br' },
    gpConsultoria: { nome: 'Roberto Justos', empresa: 'SAP Experts Inc.', contato: 'roberto.j@sap-experts.com' },
    equipeDiscovery: [
      { nome: 'Ana Paula Padrão', funcao: 'Key User', area: 'Vendas' },
      { nome: 'Pedro Bial', funcao: 'Key User', area: 'Pós-Venda' },
      { nome: 'Marcos Mion', funcao: 'Analista de Processos', area: 'Controladoria' },
      { nome: 'Tadeu Schmidt', funcao: 'Arquiteto de Soluções', area: 'TI' },
    ],
  },
  workshops: [
    { id: 1, data: '2024-07-22', topicos: ['Visão Geral', 'Vendas de Veículos Novos'], decisoes: ['Utilizar fluxo padrão SAP.'], pendencias: ['Mapear campos customizados.'], materiais: [{ nome: 'Apresentacao_Vendas.pptx', tipo: 'ppt', link: '#' }] },
    { id: 2, data: '2024-07-25', topicos: ['Pós-Venda (Serviços)'], decisoes: ['Ordem de Serviço será objeto central.'], pendencias: ['Definir pacotes de serviço.'], materiais: [{ nome: 'Ata_PosVenda.docx', tipo: 'doc', link: '#' }] },
  ],
  requisitos: [
    { id: 'REQ-001', titulo: 'Criação de Pedido de Venda', descricao: 'O sistema deve permitir a criação de um pedido de venda.', tipo: 'Funcional', origem: 'Workshop Vendas', prioridade: 'Must', status: 'Validado' },
    { id: 'REQ-002', titulo: 'Consulta de Histórico do Cliente', descricao: 'Usuários devem poder consultar o histórico completo de um cliente.', tipo: 'Funcional', origem: 'Workshop Vendas', prioridade: 'Should', status: 'Validado' },
    { id: 'REQ-003', titulo: 'Tempo de Resposta do Sistema', descricao: 'As principais transações devem responder em menos de 3s.', tipo: 'Não Funcional', origem: 'Entrevista TI', prioridade: 'Must', status: 'Rascunho' },
  ],
  escopo: {
    itensEscopo: [
      { id: 1, titulo: 'Módulo de Vendas (SD)', prioridade: 'Must', foraDoEscopo: false, justificativa: 'Core do negócio.' },
      { id: 2, titulo: 'Módulo Financeiro (FI)', prioridade: 'Must', foraDoEscopo: false, justificativa: 'Essencial para controle.' },
      { id: 3, titulo: 'Módulo de RH (HCM)', prioridade: 'Could', foraDoEscopo: true, justificativa: 'Será abordado em fase futura.' },
    ],
  },
  riscos: [
      { id: 'RISK-01', risco: 'Indisponibilidade de key users', fato: 'Férias e alta demanda', causa: 'Falta de planejamento', impacto: 'Médio', probabilidade: 'Alta', estrategia: 'Mitigação', responsavel: 'Juliana Savi', status: 'Aberto' },
      { id: 'RISK-02', risco: 'Atraso na liberação do ambiente', fato: 'Dependência da infra', causa: 'Processo burocrático', impacto: 'Alto', probabilidade: 'Média', estrategia: 'Aceitação', responsavel: 'Tadeu Schmidt', status: 'Aberto' },
  ],
  escalonamentos: [
      { id: 'ESC-01', descricao: 'Aprovação do orçamento adicional para licenças de teste está pendente com a diretoria.', responsavel: 'Carlos Alberto de Nóbrega', data: '2024-07-30' }
  ],
  premissas: [
      { id: 1, descricao: 'A equipe de TI interna dará suporte na extração de dados dos sistemas legados.', fonte: 'Reunião de Kick-off', criticidade: 'Alta' },
  ],
  proximosPassos: [
      { id: 1, descricao: 'Realizar workshop de processos financeiros.', responsavel: 'Juliana S.', prazo: '2024-08-05', status: 'Em Andamento', dependencias: [] },
      { id: 2, descricao: 'Apresentar escopo para patrocinador.', responsavel: 'Juliana S.', prazo: '2024-08-19', status: 'A Fazer', dependencias: ['PEND-01'] },
      { id: 3, descricao: 'Definir pacotes de serviço padrão.', responsavel: 'Pedro B.', prazo: '2024-08-05', status: 'Concluído', dependencias: [] },
  ],
  entregas: [
      { id: 'ent-1', entrega: 'AS-IS de Vendas', status: 'Concluído', responsavel: 'Ana Paula', dataPrevista: '2024-07-25' },
      { id: 'ent-2', entrega: 'AS-IS de Pós-Venda', status: 'Concluído', responsavel: 'Pedro Bial', dataPrevista: '2024-07-28' },
      { id: 'ent-3', entrega: 'Matriz de Requisitos', status: 'Em Andamento', responsavel: 'Marcos Mion', dataPrevista: '2024-08-10' },
      { id: 'ent-4', entrega: 'Business Case Preliminar', status: 'Pendente', responsavel: 'Juliana Savi', dataPrevista: '2024-08-25' },
  ],
  documentos: [
      { id: 1, nome: 'Apresentação Kick-off', tipo: 'ppt', dataUpload: '2024-07-15', link: '#', requiresAuth: false },
      { id: 2, nome: 'Plano do Discovery', tipo: 'doc', dataUpload: '2024-07-16', link: '#', requiresAuth: true },
  ],
  criteriosEncerramento: [
      { id: 'crit-1', texto: 'Workshops de mapeamento concluídos.', completo: true },
      { id: 'crit-2', texto: '80% dos requisitos validados.', completo: true },
      { id: 'crit-3', texto: 'Escopo aprovado pelo patrocinador.', completo: false },
      { id: 'crit-4', texto: 'Business Case preliminar elaborado.', completo: false },
  ],
};
