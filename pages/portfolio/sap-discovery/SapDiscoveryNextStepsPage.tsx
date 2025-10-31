import React from 'react';
import { Section } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';

const SapDiscoveryNextStepsPage: React.FC = () => {
    const { proximosPassos } = sapDiscoveryData;
    return (
        <Section title="Próximos Passos (Kanban)">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['A Fazer', 'Em Andamento', 'Concluído'].map(status => (
                   <div key={status} className="bg-gray-100 rounded-lg p-4">
                       <h3 className="font-bold mb-4 text-black">{status}</h3>
                       <div className="space-y-3">
                            {proximosPassos.filter(p => p.status === status).map(p => (
                                <div key={p.id} className="bg-white p-3 rounded-md shadow-sm border">
                                    <p className="text-sm text-black">{p.descricao}</p>
                                    <div className="text-xs text-black/70 mt-2">
                                        <span>{p.responsavel}</span> | <span>{p.prazo}</span>
                                    </div>
                                </div>
                            ))}
                       </div>
                   </div>
                ))}
            </div>
        </Section>
    );
};

export default SapDiscoveryNextStepsPage;
