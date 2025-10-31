import React from 'react';
import { Section } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';

const SapDiscoveryGovernancePage: React.FC = () => {
    const { governanca } = sapDiscoveryData;
    return (
        <Section title="Governança">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
               <div className="bg-gray-100 p-4 rounded-lg"><h4 className="font-bold text-black">Patrocinador</h4><p className="text-black">{governanca.patrocinador.nome}</p></div>
               <div className="bg-gray-100 p-4 rounded-lg"><h4 className="font-bold text-black">GP Sipal</h4><p className="text-black">{governanca.gpSipal.nome}</p></div>
               <div className="bg-gray-100 p-4 rounded-lg"><h4 className="font-bold text-black">GP Consultoria</h4><p className="text-black">{governanca.gpConsultoria.nome}</p></div>
            </div>
             <h4 className="text-xl font-semibold mb-3 text-black">Equipe Discovery</h4>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-black">
                    <thead className="bg-gray-100">
                        <tr className="border-b">
                            <th className="p-2 text-left font-semibold text-black">Nome</th>
                            <th className="p-2 text-left font-semibold text-black">Função</th>
                            <th className="p-2 text-left font-semibold text-black">Área</th>
                        </tr>
                    </thead>
                    <tbody>
                        {governanca.equipeDiscovery.map((m, i) => (
                            <tr key={i} className="border-b"><td className="p-2">{m.nome}</td><td className="p-2">{m.funcao}</td><td className="p-2">{m.area}</td></tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </Section>
    );
};

export default SapDiscoveryGovernancePage;
