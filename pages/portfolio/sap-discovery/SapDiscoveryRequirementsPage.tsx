import React, { useState, useMemo } from 'react';
import { Section, PriorityBadge, StatusBadge, handleExportCSV } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';
import { DownloadIcon } from '../../../components/Icons';

const SapDiscoveryRequirementsPage: React.FC = () => {
    const [filters, setFilters] = useState({ tipo: 'Todos', prioridade: 'Todos', status: 'Todos' });
    const { requisitos } = sapDiscoveryData;

    const filteredReqs = useMemo(() => requisitos.filter(r => 
        (filters.tipo === 'Todos' || r.tipo === filters.tipo) &&
        (filters.prioridade === 'Todos' || r.prioridade === filters.prioridade) &&
        (filters.status === 'Todos' || r.status === filters.status)
    ), [filters, requisitos]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Section title="Requisitos">
            <div className="flex flex-wrap gap-4 mb-4 bg-gray-50 p-3 rounded-md border">
                <select name="tipo" onChange={handleFilterChange} className="p-1 border rounded-md text-sm text-black"><option>Todos</option><option>Funcional</option><option>Não Funcional</option></select>
                <select name="prioridade" onChange={handleFilterChange} className="p-1 border rounded-md text-sm text-black"><option>Todos</option><option>Must</option><option>Should</option><option>Could</option></select>
                <select name="status" onChange={handleFilterChange} className="p-1 border rounded-md text-sm text-black"><option>Todos</option><option>Validado</option><option>Rascunho</option></select>
                <button onClick={() => handleExportCSV(filteredReqs, 'requisitos_sap_discovery')} className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 ml-auto text-black"><DownloadIcon className="h-4 w-4" /> Exportar CSV</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-black">
                    <thead className="bg-gray-100">
                        <tr className="border-b">
                            <th className="p-2 text-left font-semibold text-black">ID</th>
                            <th className="p-2 text-left font-semibold text-black">Título</th>
                            <th className="p-2 text-left font-semibold text-black">Prioridade</th>
                            <th className="p-2 text-left font-semibold text-black">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReqs.map(r => (
                            <tr key={r.id} className="border-b">
                                <td className="p-2">{r.id}</td>
                                <td className="p-2">{r.titulo}</td>
                                <td className="p-2"><PriorityBadge priority={r.prioridade as any}/></td>
                                <td className="p-2"><StatusBadge status={r.status}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
};

export default SapDiscoveryRequirementsPage;
