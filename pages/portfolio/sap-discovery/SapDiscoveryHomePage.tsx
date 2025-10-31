import React from 'react';
import { PortfolioProject } from '../../../types';
import { Section } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';
import Indicator from '../../../components/Indicator';

interface SapDiscoveryHomePageProps {
    project: PortfolioProject;
}

const SapDiscoveryHomePage: React.FC<SapDiscoveryHomePageProps> = ({ project }) => {
    return (
        <div className="space-y-8">
            <Section title="Resumo e Objetivos">
                <p className="text-black leading-relaxed bg-gray-50 p-4 rounded-md border">{project.summary}</p>
                <h3 className="text-xl font-bold text-black mt-6 mb-3">Objetivo do Discovery</h3>
                <p className="text-black leading-relaxed">{sapDiscoveryData.objetivoDiscovery} Saiba mais no <a href="https://gruposipal.sharepoint.com/:w:/s/PMO/EUoEXsbqcPVBvOKfXO8OLLIBSQeMd_F1GSZ5TKbLIw0I5Q?e=0eua2v" target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Business Case preliminar</a>.</p>
            </Section>
            
            <Section title="Indicadores Chave">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="bg-gray-50 p-4 rounded-lg border text-center"><p className="text-sm font-medium text-black">SPI/CPI</p><div className="flex justify-center gap-2 mt-2"><Indicator label="SPI" value={project.spi} /><Indicator label="CPI" value={project.cpi} /></div></div>
                   <div className="bg-gray-50 p-4 rounded-lg border text-center"><p className="text-sm font-medium text-black">Workshops</p><p className="text-2xl font-bold text-black">{sapDiscoveryData.kpis.workshops.realizados}/{sapDiscoveryData.kpis.workshops.planejados}</p></div>
                   <div className="bg-gray-50 p-4 rounded-lg border text-center"><p className="text-sm font-medium text-black">Requisitos</p><p className="text-2xl font-bold text-black">{sapDiscoveryData.kpis.requisitos.validadosPercent}% <span className="text-sm font-normal text-black/70">Validados</span></p></div>
                   <div className="bg-gray-50 p-4 rounded-lg border text-center"><p className="text-sm font-medium text-black">Riscos</p><p className="text-2xl font-bold text-black">{sapDiscoveryData.kpis.riscos.abertos} <span className="text-sm font-normal text-black/70">Abertos</span></p></div>
                </div>
            </Section>
        </div>
    );
};

export default SapDiscoveryHomePage;
