import React, { useState, useEffect, Suspense, lazy } from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { useParams, Routes, Route } from 'react-router-dom';
import { PORTFOLIO_PROJECTS } from '../../data/portfolioData';
import { PortfolioProject } from '../../types';
import Indicator from '../../components/Indicator';
import { CheckCircleIcon, FileTextIcon } from '../../components/Icons';
import BackButton from '../../components/BackButton';
import SCurveChart from '../../components/SCurveChart';

// Lazy load the new SAP Discovery layout and pages
const SapDiscoveryLayout = lazy(() => import('./sap-discovery/SapDiscoveryLayout.tsx'));
const SapDiscoveryHomePage = lazy(() => import('./sap-discovery/SapDiscoveryHomePage.tsx'));
const SapDiscoveryGovernancePage = lazy(() => import('./sap-discovery/SapDiscoveryGovernancePage.tsx'));
const SapDiscoveryDeliveriesPage = lazy(() => import('./sap-discovery/SapDiscoveryDeliveriesPage.tsx'));
const SapDiscoveryNextStepsPage = lazy(() => import('./sap-discovery/SapDiscoveryNextStepsPage.tsx'));
const SapDiscoveryWorkshopsPage = lazy(() => import('./sap-discovery/SapDiscoveryWorkshopsPage.tsx'));
const SapDiscoveryScopePage = lazy(() => import('./sap-discovery/SapDiscoveryScopePage.tsx'));
const SapDiscoveryRequirementsPage = lazy(() => import('./sap-discovery/SapDiscoveryRequirementsPage.tsx'));
const SapDiscoveryRisksPage = lazy(() => import('./sap-discovery/SapDiscoveryRisksPage.tsx'));
const SapDiscoveryDocumentsPage = lazy(() => import('./sap-discovery/SapDiscoveryDocumentsPage.tsx'));
const SapDiscoveryClosingPage = lazy(() => import('./sap-discovery/SapDiscoveryClosingPage.tsx'));


const LoadingFallback: React.FC = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#0A3130]"></div>
    </div>
);

const getRiskColor = (level: 'Alto' | 'Médio' | 'Baixo') => {
    switch (level) {
        case 'Alto': return 'bg-red-100';
        case 'Médio': return 'bg-yellow-100';
        case 'Baixo': return 'bg-green-100';
        default: return 'bg-gray-100';
    }
}

const GenericProjectDetailView: React.FC<{ project: PortfolioProject }> = ({ project }) => {
    const [sCurveData, setSCurveData] = useState<any | null>(null);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('sipal-pmo-financial-analysis-v1');
            if (savedData) {
                const parsed = JSON.parse(savedData);
                if (parsed.chartData && parsed.chartData.sCurve) setSCurveData(parsed.chartData.sCurve);
            }
        } catch (error) {
            console.error("Failed to load S-Curve data from localStorage", error);
        }
    }, []);

    return (
        <main className="flex-grow bg-gray-100 py-12">
            <div className="container mx-auto px-4">
                <BackButton fallback="/portfolio" />

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
                    <header className="border-b border-gray-200 pb-6 mb-8">
                        <h1 className="text-4xl font-extrabold text-black">{project.name}</h1>
                        <p className="mt-2 text-black/70">Gerente de Projeto: <span className="font-semibold text-black">{project.manager}</span></p>
                    </header>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-black mb-3">Resumo Executivo</h3>
                                <p className="text-black leading-relaxed bg-gray-50 p-4 rounded-md border">{project.summary}</p>
                            </div>
                            
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                               {sCurveData && <div className="w-full bg-white p-2 rounded-lg shadow-sm border" style={{ height: '300px' }}><SCurveChart data={sCurveData} isCompact={true} /></div>}
                            </div>

                             <div>
                                <h3 className="text-xl font-bold text-black mb-3">Próximos Passos</h3>
                                <ul className="list-disc list-inside space-y-2 text-black pl-2">{project.nextSteps.map((step, index) => <li key={index}>{step}</li>)}</ul>
                            </div>
                        </div>

                        <aside className="space-y-8">
                             <div>
                                <h3 className="text-xl font-bold text-black mb-3">Indicadores</h3>
                                <div className="bg-gray-50 p-4 rounded-md border flex items-center justify-around">
                                    <Indicator label="SPI" value={project.spi} />
                                    <Indicator label="CPI" value={project.cpi} />
                                </div>
                                <p className="text-xs text-black/70 mt-2">SPI: Prazo | CPI: Custo. (Verde ≥ 0.98; Amarelo ≥ 0.95)</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-black mb-3">Principais Entregas</h3>
                                <ul className="space-y-2">{project.mainDeliveries.map(d => (<li key={d.id} className={`flex items-center gap-2 text-sm p-2 rounded ${d.completed ? 'bg-green-50 text-black/70 line-through' : 'bg-blue-50 text-black'}`}>{d.completed && <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />}<span>{d.text}</span></li>))}</ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-black mb-3">Riscos e Escalonamentos</h3>
                                <ul className="space-y-2">{project.risks.map(r => (<li key={r.id} className={`flex items-start gap-2 text-sm p-2 rounded text-black ${getRiskColor(r.level)}`}><span className="font-bold w-14 flex-shrink-0">[{r.level}]</span><span>{r.text}</span></li>))}</ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-black mb-3">Documentos</h3>
                                <ul className="space-y-2">{project.documents.map(doc => (<li key={doc.id}><a href={doc.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 hover:underline"><FileTextIcon className="h-5 w-5" /><span>{doc.name}</span></a></li>))}</ul>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </main>
    );
};


const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const project = PORTFOLIO_PROJECTS.find(p => p.id === projectId);

    if (!project) {
        return (
            <main className="flex-grow bg-gray-100">
                <div className="container mx-auto px-6 py-16 text-center">
                    <h1 className="text-4xl font-bold text-red-600">Projeto não encontrado</h1>
                    <p className="text-black/70 mt-4">O projeto que você está procurando não existe ou foi movido.</p>
                    <div className="mt-8"><BackButton fallback="/portfolio" /></div>
                </div>
            </main>
        );
    }

    if (project.id === 'proj-002') {
        return (
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<SapDiscoveryLayout project={project} />}>
                        <Route index element={<SapDiscoveryHomePage project={project} />} />
                        <Route path="governanca" element={<SapDiscoveryGovernancePage />} />
                        <Route path="entregas" element={<SapDiscoveryDeliveriesPage />} />
                        <Route path="proximos-passos" element={<SapDiscoveryNextStepsPage />} />
                        <Route path="workshops" element={<SapDiscoveryWorkshopsPage />} />
                        <Route path="escopo" element={<SapDiscoveryScopePage />} />
                        <Route path="requisitos" element={<SapDiscoveryRequirementsPage />} />
                        <Route path="riscos" element={<SapDiscoveryRisksPage />} />
                        <Route path="documentos" element={<SapDiscoveryDocumentsPage />} />
                        <Route path="encerramento" element={<SapDiscoveryClosingPage />} />
                    </Route>
                </Routes>
            </Suspense>
        );
    }

    return <GenericProjectDetailView project={project} />;
};

export default ProjectDetailPage;