import React from 'react';
import { Section, DocIcon } from './components';
import { sapDiscoveryData } from '../../../data/sapDiscoveryData';

const SapDiscoveryDocumentsPage: React.FC = () => {
    const { documentos } = sapDiscoveryData;
    return (
        <Section title="Documentos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentos.map((doc) => (
                    <a 
                        key={doc.id} 
                        href={doc.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border hover:bg-gray-100 hover:border-[#3095A6] transition-colors"
                    >
                        <DocIcon type={doc.tipo} />
                        <div>
                            <p className="font-semibold text-black">{doc.nome}</p>
                            <p className="text-xs text-black/70">
                                Upload: {doc.dataUpload}
                                {doc.requiresAuth && <span className="ml-2 font-bold text-yellow-700">(Requer Autenticação)</span>}
                            </p>
                        </div>
                    </a>
                ))}
            </div>
        </Section>
    );
};

export default SapDiscoveryDocumentsPage;
