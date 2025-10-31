import React, { useState } from 'react';
import { Section, DocIcon } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';
import { ChevronRightIcon } from '../../../components/Icons';

const WorkshopItem: React.FC<{ workshop: typeof sapDiscoveryData.workshops[0] }> = ({ workshop }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-gray-200 rounded-lg">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
            >
                <span className="font-semibold text-black">{workshop.data} - {workshop.topicos.join(' / ')}</span>
                <ChevronRightIcon className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
            {isOpen && (
                <div className="p-4 border-t border-gray-200 bg-gray-50 text-sm text-black space-y-3">
                    <p><strong>Decisões:</strong> {workshop.decisoes.join(', ')}</p>
                    <p><strong>Pendências:</strong> {workshop.pendencias.join(', ')}</p>
                    <div className="flex gap-2">
                        {workshop.materiais.map(m => (
                            <a key={m.nome} href={m.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-700 hover:underline">
                                <DocIcon type={m.tipo} /> {m.nome}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const SapDiscoveryWorkshopsPage: React.FC = () => {
    const { workshops, kpis } = sapDiscoveryData;
    return (
        <Section title="Workshops">
            <div className="mb-4">
                <h4 className="font-bold text-black">Progresso</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${kpis.workshops.concluidosPercent}%` }}></div>
                </div>
                <p className="text-sm text-right mt-1 text-black">{kpis.workshops.concluidosPercent}% Concluídos</p>
            </div>
            <div className="space-y-3">
                {workshops.map(w => <WorkshopItem key={w.id} workshop={w} />)}
            </div>
        </Section>
    );
};

export default SapDiscoveryWorkshopsPage;
