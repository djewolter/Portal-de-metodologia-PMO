import React, { useState, useMemo } from 'react';
import { Section, ImpactProbChip, StatusBadge, handleExportCSV } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';
import { DownloadIcon } from '../../../components/Icons';

const SapDiscoveryRisksPage: React.FC = () => {
    const [filters, setFilters] = useState({ impacto: 'Todos', probabilidade: 'Todos', status: 'Todos' });
    const { riscos, premissas, escalonamentos } = sapDiscoveryData;

    const filteredRisks = useMemo(() => riscos.filter(r => 
        (filters.impacto === 'Todos' || r.impacto === filters.impacto) &&
        (filters.probabilidade === 'Todos' || r.probabilidade === filters.probabilidade) &&
        (filters.status === 'Todos' || r.status === filters.status)
    ), [filters, riscos]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Section title="Riscos, Premissas e Escalonamentos">
            <h3 className="text-xl font-bold mb-4 text-black">Riscos</h3>
            <div className="flex flex-wrap gap-4 mb-4 bg-gray-50 p-3 rounded-md border">
                <select name="impacto" onChange={handleFilterChange} className="p-1 border rounded-md text-sm text-black"><option value="Todos">Impacto: Todos</option><option>Alto</option><option>Médio</option><option>Baixo</option></select>
                <select name="probabilidade" onChange={handleFilterChange} className="p-1 border rounded-md text-sm text-black"><option value="Todos">Prob: Todos</option><option>Alta</option><option>Média</option><option>Baixa</option></select>
                <select name="status" onChange={handleFilterChange} className="p-1 border rounded-md text-sm text-black"><option value="Todos">Status: Todos</option><option>Aberto</option><option>Fechado</option></select>
                <button onClick={() => handleExportCSV(filteredRisks, 'riscos_sap_discovery')} className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 ml-auto text-black"><DownloadIcon className="h-4 w-4" /> Exportar CSV</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-black">
                    <thead className="bg-gray-100">
                        <tr className="border-b">
                            <th className="p-2 text-left font-semibold text-black">ID</th>
                            <th className="p-2 text-left font-semibold text-black">Risco</th>
                            <th className="p-2 text-left font-semibold text-black">Impacto</th>
                            <th className="p-2 text-left font-semibold text-black">Prob.</th>
                            <th className="p-2 text-left font-semibold text-black">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRisks.map(r => (
                            <tr key={r.id} className="border-b">
                                <td className="p-2">{r.id}</td>
                                <td className="p-2">{r.risco}</td>
                                <td className="p-2"><ImpactProbChip level={r.impacto as any}/></td>
                                <td className="p-2"><ImpactProbChip level={r.probabilidade as any}/></td>
                                <td className="p-2"><StatusBadge status={r.status}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h3 className="text-xl font-bold mt-6 mb-4 text-black">Premissas</h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-black">
                {premissas.map(p => <li key={p.id}>{p.descricao}</li>)}
            </ul>

            <h3 className="text-xl font-bold mt-6 mb-4 text-black">Escalonamentos Críticos</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-sm text-black">{escalonamentos[0].descricao}</p>
            </div>
        </Section>
    );
};

export default SapDiscoveryRisksPage;
