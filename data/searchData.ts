import { PHASES, CONTROL_SUPPORT_PROCESSES } from '../constants';
import { Phase, Activity, ControlSupportProcess, SearchableItem } from '../types';

const searchableData: SearchableItem[] = [];

// Add phases and activities
PHASES.forEach((phase: Phase) => {
  searchableData.push({
    id: `phase-${phase.id}`,
    title: `Fase: ${phase.name}`,
    description: `Explore as atividades e entregas da fase de ${phase.name}.`,
    path: '/metodologia',
    type: 'Fase',
  });

  phase.activities.forEach((activity: Activity) => {
    searchableData.push({
      id: activity.id,
      title: activity.name,
      description: activity.description || `Atividade da fase ${phase.name}.`,
      path: '/metodologia',
      type: 'Atividade',
    });
  });
});

// Add control and support processes
CONTROL_SUPPORT_PROCESSES.forEach((process: ControlSupportProcess) => {
  searchableData.push({
    id: process.id,
    title: process.name,
    description: process.objective,
    path: '/metodologia',
    type: 'Processo de Controle',
  });
});

export default searchableData;
