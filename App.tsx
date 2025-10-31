import React from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { HomePage } from './pages/HomePage';
import ProjectMethodologyPage from './pages/ProjectMethodologyPage';
import TemplatesPage from './pages/TemplatesPage';
import TrainingPage from './pages/TrainingPage';
import OnboardingPage from './pages/OnboardingPage';
import OnboardingGerentesPage from './pages/OnboardingGerentesPage';
import UpcomingDeliveriesPage from './pages/UpcomingDeliveriesPage';
import PortfolioPage from './pages/PortfolioPage';
import ProjectDetailPage from './pages/portfolio/ProjectDetailPage';
import ProjectManagerAcceleratorPage from './pages/ProjectManagerAcceleratorPage';
import DeliveriesStatusPage from './pages/DeliveriesStatusPage';
import FinancialAnalysisPage from './pages/FinancialAnalysisPage';
import ContractFinancialManagementPage from './pages/ContractFinancialManagementPage';
import PortalTimelinePage from './pages/PortalTimelinePage';

const AppLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <Outlet />
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/metodologia" element={<ProjectMethodologyPage />} />
          <Route path="/proximas-entregas" element={<UpcomingDeliveriesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:projectId/*" element={<ProjectDetailPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/treinamentos" element={<TrainingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/onboarding-gerentes" element={<OnboardingGerentesPage />} />
          <Route path="/acelerador-gerente" element={<ProjectManagerAcceleratorPage />} />
          <Route path="/entregas" element={<DeliveriesStatusPage />} />
          <Route path="/andamento-financeiro" element={<FinancialAnalysisPage />} />
          <Route path="/gestao-financeira-contrato" element={<ContractFinancialManagementPage />} />
          <Route path="/cronograma-portal" element={<PortalTimelinePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;