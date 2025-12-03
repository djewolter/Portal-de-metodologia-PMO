
import React, { useState } from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { Link } from 'react-router-dom';
import { PHASES, CONTROL_SUPPORT_PROCESSES } from '../constants';
import PhasesStrip from '../components/PhasesStrip';
import ActivityGrid from '../components/ActivityGrid';
import ControlAndSupportProcess from '../components/ControlAndSupportProcess';
import Legend from '../components/Legend';
import Modal from '../components/Modal';
import DemandEvaluationProcedure from '../components/DemandEvaluationProcedure';
import DemandFormProcedure from '../components/DemandFormProcedure';
import RfiProcedure from '../components/RfiProcedure';
import RfpProcedure from '../components/RfpProcedure';
import DasProcedure from '../components/DasProcedure';
import ProposalPresentationProcedure from '../components/ProposalPresentationProcedure';
import BenefitsMappingProcedure from '../components/BenefitsMappingProcedure';
import RoiCalculationProcedure from '../components/RoiCalculationProcedure';
import ProjectDefenseProcedure from '../components/ProjectDefenseProcedure';
import BusinessCaseProcedure from '../components/BusinessCaseProcedure';
import TechnicalRequirementsProcedure from '../components/TechnicalRequirementsProcedure';
import CashFlowProcedure from '../components/CashFlowProcedure';
import FunctionalRequirementsProcedure from '../components/FunctionalRequirementsProcedure';
import ContractValidationProcedure from '../components/ContractValidationProcedure';
import KickOffProcedure from '../components/KickOffProcedure';
import ProjectDefensePrepareProcedure from '../components/ProjectDefensePrepareProcedure';
import TapProcedure from '../components/TapProcedure';
import ScopeDocumentProcedure from '../components/ScopeDocumentProcedure';
import WbsProcedure from '../components/WbsProcedure';
import ScheduleProcedure from '../components/ScheduleProcedure';
import TrainingPlanProcedure from '../components/TrainingPlanProcedure';
import StakeholderMappingProcedure from '../components/StakeholderMappingProcedure';
import TestPlanProcedure from '../components/TestPlanProcedure';
import CommunicationPlanProcedure from '../components/CommunicationPlanProcedure';
import ProjectPlanValidationProcedure from '../components/ProjectPlanValidationProcedure';
import OrganizationalImpactsProcedure from '../components/OrganizationalImpactsProcedure';
import UnitTestsProcedure from '../components/UnitTestsProcedure';
import IntegrationReadinessProcedure from '../components/IntegrationReadinessProcedure';
import IntegrationTestsProcedure from '../components/IntegrationTestsProcedure';
import CutoverPlanProcedure from '../components/CutoverPlanProcedure';
import GoLiveReadinessProcedure from '../components/GoLiveReadinessProcedure';
import SprintPlanningProcedure from '../components/SprintPlanningProcedure';
import SprintRetrospectiveProcedure from '../components/SprintRetrospectiveProcedure';
import SprintReviewProcedure from '../components/SprintReviewProcedure';
import DailyStandupProcedure from '../components/DailyStandupProcedure';
import GoNoGoMeetingProcedure from '../components/GoNoGoMeetingProcedure';
import DeployCutoverPlanProcedure from '../components/DeployCutoverPlanProcedure';
import ChangePlanProcedure from '../components/ChangePlanProcedure';
import SupportOperationProcedure from '../components/SupportOperationProcedure';
import LessonsLearnedProcedure from '../components/LessonsLearnedProcedure';
import ClosingTermProcedure from '../components/ClosingTermProcedure';
import SatisfactionSurveyProcedure from '../components/SatisfactionSurveyProcedure';
import PerformanceEvaluationProcedure from '../components/PerformanceEvaluationProcedure';
import ValueCaptureProcedure from '../components/ValueCaptureProcedure';
import ControlProcessProcedure from '../components/ControlProcessProcedure';
import SupplierRegistrationForm from '../components/SupplierRegistrationForm';
import BackButton from '../components/BackButton';
import { ArrowUpRightFromSquareIcon } from '../components/Icons';

const ProjectMethodologyPage: React.FC = () => {
  const [activePhaseId, setActivePhaseId] = useState<number | null>(1);
  const [modalActivityId, setModalActivityId] = useState<string | null>(null);
  const [modalProcessId, setModalProcessId] = useState<string | null>(null);
  const [isSupplierFormOpen, setIsSupplierFormOpen] = useState(false);
  const [isMinutesInfoModalOpen, setIsMinutesInfoModalOpen] = useState(false);
  const [isStatusReportInfoModalOpen, setIsStatusReportInfoModalOpen] = useState(false);
  const [isCashFlowInfoModalOpen, setIsCashFlowInfoModalOpen] = useState(false);
  const [isTestingGuideModalOpen, setIsTestingGuideModalOpen] = useState(false);


  const handlePhaseClick = (id: number) => {
    setActivePhaseId(prevId => (prevId === id ? null : id));
  };

  const handleCardClick = (activityId: string) => {
    if (['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '5.1', '5.2', '5.3', '6.1', '6.2', '6.3', '7.1', '7.2', '7.3'].includes(activityId)) {
      setModalActivityId(activityId);
    }
  };

  const handleProcessClick = (processId: string) => {
    setModalProcessId(processId);
  };

  const handleMinutesInfoClick = () => {
    setIsMinutesInfoModalOpen(true);
  };

  const handleStatusReportInfoClick = () => {
    setIsStatusReportInfoModalOpen(true);
  };

  const handleCashFlowInfoClick = () => {
    setIsCashFlowInfoModalOpen(true);
  };

  const handleTestingGuideClick = () => {
    setIsTestingGuideModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalActivityId(null);
    setModalProcessId(null);
  };

  const handleOpenSupplierForm = () => {
    setModalProcessId(null); // Fecha o modal atual
    setIsSupplierFormOpen(true); // Abre o novo modal de formulário
  };

  const activePhase = PHASES.find(p => p.id === activePhaseId) || null;
  const selectedProcess = modalProcessId
    ? CONTROL_SUPPORT_PROCESSES.find(p => p.id === modalProcessId)
    : null;

  return (
    <main className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <BackButton />
        <div
          className="text-center mb-12 animate-fadeIn"
          style={{ animationDelay: '100ms' }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3130] mb-4">
            Metodologia do Escritório de Projetos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nosso Escritório de Projetos adota uma abordagem híbrida que combina o
            melhor da metodologia SAP Activate com as práticas do pmoBook,
            garantindo eficiência, governança e foco em resultados desde a
            concepção até a entrega do projeto.
          </p>
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <PhasesStrip
            phases={PHASES}
            activePhaseId={activePhaseId}
            onPhaseClick={handlePhaseClick}
          />
        </div>

        <div
          className="max-w-7xl mx-auto animate-fadeIn"
          style={{ animationDelay: '300ms' }}
        >
          <ActivityGrid phase={activePhase} onCardClick={handleCardClick} />
        </div>

        <div
          className="max-w-7xl mx-auto mt-16 animate-fadeIn"
          style={{ animationDelay: '400ms' }}
        >
          <ControlAndSupportProcess 
            onProcessClick={handleProcessClick}
            onMinutesInfoClick={handleMinutesInfoClick}
            onStatusReportInfoClick={handleStatusReportInfoClick}
            onCashFlowInfoClick={handleCashFlowInfoClick}
            onTestingGuideClick={handleTestingGuideClick}
          />
        </div>

        <div
          className="max-w-7xl mx-auto mt-12 animate-fadeIn"
          style={{ animationDelay: '500ms' }}
        >
          <Legend />
        </div>
      </div>

      <Modal isOpen={!!modalActivityId || !!modalProcessId} onClose={handleCloseModal}>
        {modalActivityId === '1.1' && <DemandFormProcedure />}
        {modalActivityId === '1.2' && <DemandEvaluationProcedure />}
        {modalActivityId === '1.3' && <RfiProcedure />}
        {modalActivityId === '1.4' && <RfpProcedure />}
        {modalActivityId === '1.5' && <DasProcedure />}
        {modalActivityId === '1.6' && <ProposalPresentationProcedure />}
        {modalActivityId === '1.7' && <BenefitsMappingProcedure />}
        {modalActivityId === '1.8' && <RoiCalculationProcedure />}
        {modalActivityId === '1.9' && <BusinessCaseProcedure />}
        {modalActivityId === '1.10' && <ProjectDefenseProcedure />}
        {modalActivityId === '2.1' && <TechnicalRequirementsProcedure />}
        {modalActivityId === '2.2' && <CashFlowProcedure />}
        {modalActivityId === '2.3' && <FunctionalRequirementsProcedure />}
        {modalActivityId === '2.4' && <ContractValidationProcedure />}
        {modalActivityId === '2.5' && <KickOffProcedure />}
        {modalActivityId === '2.6' && <TapProcedure />}
        {modalActivityId === '2.7' && <ProjectDefensePrepareProcedure />}
        {modalActivityId === '3.1' && <ScopeDocumentProcedure />}
        {modalActivityId === '3.2' && <WbsProcedure />}
        {modalActivityId === '3.3' && <ScheduleProcedure />}
        {modalActivityId === '3.4' && <TrainingPlanProcedure />}
        {modalActivityId === '3.5' && <StakeholderMappingProcedure />}
        {modalActivityId === '3.6' && <TestPlanProcedure />}
        {modalActivityId === '3.7' && <CommunicationPlanProcedure />}
        {modalActivityId === '3.8' && <ProjectPlanValidationProcedure />}
        {modalActivityId === '4.1' && <OrganizationalImpactsProcedure />}
        {modalActivityId === '4.2' && <UnitTestsProcedure />}
        {modalActivityId === '4.3' && <IntegrationReadinessProcedure />}
        {modalActivityId === '4.4' && <IntegrationTestsProcedure />}
        {modalActivityId === '4.5' && <CutoverPlanProcedure />}
        {modalActivityId === '4.6' && <GoLiveReadinessProcedure />}
        {modalActivityId === '4.7' && <SprintPlanningProcedure />}
        {modalActivityId === '4.8' && <SprintRetrospectiveProcedure />}
        {modalActivityId === '4.9' && <SprintReviewProcedure />}
        {modalActivityId === '4.10' && <DailyStandupProcedure />}
        {modalActivityId === '5.1' && <GoNoGoMeetingProcedure />}
        {modalActivityId === '5.2' && <DeployCutoverPlanProcedure />}
        {modalActivityId === '5.3' && <ChangePlanProcedure />}
        {modalActivityId === '6.1' && <SupportOperationProcedure />}
        {modalActivityId === '6.2' && <LessonsLearnedProcedure />}
        {modalActivityId === '6.3' && <ClosingTermProcedure />}
        {modalActivityId === '7.1' && <SatisfactionSurveyProcedure />}
        {modalActivityId === '7.2' && <PerformanceEvaluationProcedure />}
        {modalActivityId === '7.3' && <ValueCaptureProcedure />}
        {selectedProcess && <ControlProcessProcedure process={selectedProcess} onOpenSupplierForm={handleOpenSupplierForm} />}
      </Modal>

      <Modal isOpen={isMinutesInfoModalOpen} onClose={() => setIsMinutesInfoModalOpen(false)}>
        <div className="text-center p-4">
            <h2 className="text-2xl font-bold text-[#0A3130] mb-4">Registrar Atas de Reunião</h2>
            <p className="text-gray-700 mb-6 text-lg">
                A Ata de reunião deve ser armazenada no SharePoint do projeto.
            </p>
            <Link 
                to="/acelerador-gerente" 
                className="inline-flex items-center gap-2 text-lg font-semibold text-[#0A3130] hover:text-[#3095A6] hover:underline transition-colors"
                onClick={() => setIsMinutesInfoModalOpen(false)}
            >
                Para gerar a ata de forma automática com apoio da IA clique aqui
                <ArrowUpRightFromSquareIcon className="h-5 w-5" />
            </Link>
        </div>
      </Modal>

      <Modal isOpen={isStatusReportInfoModalOpen} onClose={() => setIsStatusReportInfoModalOpen(false)}>
        <div className="text-center p-4">
            <h2 className="text-2xl font-bold text-[#0A3130] mb-4">Registro Status do Projeto</h2>
            <p className="text-gray-700 mb-6 text-lg">
                O Status Report deve ser adicionado no SharePoint do projeto.
            </p>
            <a 
                href="https://gruposipal.sharepoint.com/:p:/s/PMO/EQndtQk-2n1Fk-OC6A_ekxEBlf2PiYv4SBUXH50xtWfxTQ?e=oXfObl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg font-semibold text-[#0A3130] hover:text-[#3095A6] hover:underline transition-colors"
                onClick={() => setIsStatusReportInfoModalOpen(false)}
            >
                Acesse o template do Status Report aqui
                <ArrowUpRightFromSquareIcon className="h-5 w-5" />
            </a>
        </div>
      </Modal>

      <Modal isOpen={isCashFlowInfoModalOpen} onClose={() => setIsCashFlowInfoModalOpen(false)}>
        <div className="text-center p-4">
            <h2 className="text-2xl font-bold text-[#0A3130] mb-4">Gerir Fluxo de Caixa</h2>
            <p className="text-gray-700 mb-2 text-lg">
                Os dados do fluxo de caixa são armazenados dentro do SharePoint do PMO.
            </p>
            <p className="text-gray-700 mb-6 text-lg">
                Para ter acesso, contate o time do PMO.
            </p>
            <a 
                href="mailto:PMO@sipal.com"
                className="inline-flex items-center gap-2 text-lg font-semibold text-[#0A3130] hover:text-[#3095A6] hover:underline transition-colors"
            >
                PMO@sipal.com
            </a>
        </div>
      </Modal>

      <Modal isOpen={isTestingGuideModalOpen} onClose={() => setIsTestingGuideModalOpen(false)}>
        <div className="text-center p-4">
            <h2 className="text-2xl font-bold text-[#0A3130] mb-4">Guia de Testes</h2>
            <p className="text-gray-700 mb-6 text-lg">
                Acesse o guia completo de testes para garantir a qualidade da entrega do seu projeto.
            </p>
            <a 
                href="https://gruposipal.sharepoint.com/:w:/s/PMO/IQAaL0fQnDWaSaYU1ornSUCaAdywQjfOiUBWXCzBNhP1APU?e=vDvQyt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg font-semibold text-[#0A3130] hover:text-[#3095A6] hover:underline transition-colors"
                onClick={() => setIsTestingGuideModalOpen(false)}
            >
                Acessar Guia de Testes
                <ArrowUpRightFromSquareIcon className="h-5 w-5" />
            </a>
        </div>
      </Modal>

      <SupplierRegistrationForm 
        isOpen={isSupplierFormOpen}
        onClose={() => setIsSupplierFormOpen(false)}
      />
    </main>
  );
};

export default ProjectMethodologyPage;