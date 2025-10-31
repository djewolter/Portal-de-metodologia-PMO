import React from 'react';
import { Section, StatusBadge, handleExportCSV } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';
import { DownloadIcon } from '../../../components/Icons';

const SapDiscoveryDeliveriesPage: React.FC = () => {
    const { entregas } = sapDiscoveryData;
    return (
        <Section title="Principais Entregas">
            <div className="flex justify-end mb-4">
                <button 
                    onClick={() => handleExportCSV(entregas, 'entregas_sap_discovery')} 
                    className="flex items-center gap-2 text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300 text-black">
                    <DownloadIcon className="h-4 w-4" /> Exportar CSV
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-black">
                    <thead className="bg-gray-100">
                        <tr className="border-b">
                            <th className="p-2 text-left font-semibold text-black">Entrega</th>
                            <th className="p-2 text-left font-semibold text-black">Status</th>
                            <th className="p-2 text-left font-semibold text-black">Responsável</th>
                            <th className="p-2 text-left font-semibold text-black">Data Prevista</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entregas.map(e => (
                            <tr key={e.id} className="border-b">
                                <td className="p-2">{e.entrega}</td>
                                <td className="p-2"><StatusBadge status={e.status} /></td>
                                <td className="p-2">{e.responsavel}</td>
                                <td className="p-2">{e.dataPrevista}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
};

export default SapDiscoveryDeliveriesPage;
