import React from 'react';
import { Section } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';
import { CheckCircleIcon } from '../../../components/Icons';

const SapDiscoveryClosingPage: React.FC = () => {
    const { criteriosEncerramento } = sapDiscoveryData;
    const completedCount = criteriosEncerramento.filter(c => c.completo).length;
    const totalCount = criteriosEncerramento.length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    return (
        <Section title="Marco de Encerramento do Discovery">
           <h4 className="text-lg font-semibold text-black mb-2">Progresso para Encerramento</h4>
           <div className="w-full bg-gray-200 rounded-full h-4 mb-1">
               <div className="bg-green-500 h-4 rounded-full" style={{width: `${progress}%`}}></div>
           </div>
           <p className="text-sm text-right font-bold text-black mb-6">{progress}%</p>

           <h4 className="text-lg font-semibold text-black mb-3">Checklist de Critérios</h4>
           <ul className="space-y-3">
               {criteriosEncerramento.map(c => (
                   <li key={c.id} className={`flex items-center gap-3 text-sm p-3 rounded-md ${c.completo ? 'bg-green-50 text-black/70' : 'bg-gray-50 text-black'}`}>
                       {c.completo 
                           ? <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" /> 
                           : <div className="h-5 w-5 border-2 border-gray-400 rounded-full flex-shrink-0" />
                       }
                       <span className={c.completo ? 'line-through' : ''}>{c.texto}</span>
                   </li>
               ))}
           </ul>
        </Section>
    );
};

export default SapDiscoveryClosingPage;
