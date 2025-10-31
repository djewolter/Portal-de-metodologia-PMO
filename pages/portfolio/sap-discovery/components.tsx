import React from 'react';
import { PresentationChartLineIcon, FileTextIcon } from '../../../components/Icons';

export const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <div className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 ${className}`}>
    <h2 className="text-3xl font-bold text-black mb-6">{title}</h2>
    {children}
  </div>
);

export const PriorityBadge: React.FC<{ priority: 'Must' | 'Should' | 'Could' }> = ({ priority }) => {
  const colors = { Must: 'bg-red-100 text-black border-red-200', Should: 'bg-yellow-100 text-black border-yellow-200', Could: 'bg-blue-100 text-black border-blue-200' };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${colors[priority]}`}>{priority}</span>;
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: { [key: string]: string } = { 'Concluído': 'bg-green-100 text-black', 'Em Andamento': 'bg-blue-100 text-black', 'Pendente': 'bg-gray-100 text-black', 'Aberto': 'bg-yellow-100 text-black', 'A Fazer': 'bg-gray-100 text-black', 'Validado': 'bg-green-100 text-black', 'Rascunho': 'bg-gray-100 text-black' };
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || 'bg-gray-100'}`}>{status}</span>;
}

export const ImpactProbChip: React.FC<{ level: 'Alto' | 'Médio' | 'Baixo' | 'Alta' | 'Média' }> = ({ level }) => {
    const colors = { 'Alto': 'bg-red-200 text-black', 'Média': 'bg-yellow-200 text-black', 'Médio': 'bg-yellow-200 text-black', 'Baixo': 'bg-green-200 text-black', 'Alta': 'bg-red-200 text-black' };
    return <span className={`px-2 py-0.5 text-xs font-bold text-black rounded-full ${colors[level]}`}>{level}</span>;
};

export const DocIcon: React.FC<{ type: string }> = ({ type }) => {
    const common = "h-5 w-5 text-black";
    if (type === 'ppt') return <PresentationChartLineIcon className={common} />;
    if (type === 'doc') return <FileTextIcon className={common} />;
    return <FileTextIcon className={common} />;
};

export const handleExportCSV = (data: any[], fileName: string) => {
    if (typeof (window as any).XLSX === 'undefined') {
        alert("A funcionalidade de exportação não está disponível.");
        return;
    }
    const worksheet = (window as any).XLSX.utils.json_to_sheet(data);
    const workbook = (window as any).XLSX.utils.book_new();
    (window as any).XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    (window as any).XLSX.writeFile(workbook, `${fileName}.csv`);
};
