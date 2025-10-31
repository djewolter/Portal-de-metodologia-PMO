import React from 'react';
import { Section, PriorityBadge } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';

const SapDiscoveryScopePage: React.FC = () => {
    const { escopo } = sapDiscoveryData;
    const inScope = escopo.itensEscopo.filter(item => !item.foraDoEscopo);
    const outOfScope = escopo.itensEscopo.filter(item => item.foraDoEscopo);
    return (
        <Section title="Escopo e Priorização">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-bold text-green-700 mb-4">✅ Dentro do Escopo</h3>
                    <div className="space-y-3">
                        {inScope.map(item => (
                            <div key={item.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex justify-between items-start">
                                    <span className="font-semibold text-black">{item.titulo}</span>
                                    <PriorityBadge priority={item.prioridade as any} />
                                </div>
                                <p className="text-sm text-black/70 mt-1">{item.justificativa}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-red-700 mb-4">❌ Fora do Escopo</h3>
                    <div className="space-y-3">
                        {outOfScope.map(item => (
                            <div key={item.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex justify-between items-start">
                                    <span className="font-semibold text-black">{item.titulo}</span>
                                </div>
                                <p className="text-sm text-black/70 mt-1">{item.justificativa}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default SapDiscoveryScopePage;
