

import React from 'react';
import { TemplateDocument } from '../types';
import { ArrowUpRightFromSquareIcon, DocumentIcon } from './Icons';

interface DocumentCardProps {
  document: TemplateDocument;
}

const getPdfLink = (originalLink: string): string => {
    // Adicionado para evitar erro com links inválidos como '#'
    if (!originalLink || !originalLink.startsWith('http')) {
        return originalLink;
    }
    
    try {
        const url = new URL(originalLink);
        if (url.hostname.endsWith('sharepoint.com')) {
            // Usar action=print aproveita o mecanismo de renderização de PDF de alta fidelidade do Office Online.
            // Isso abrirá uma visualização de impressão da qual o usuário pode salvar como PDF.
            // É o método mais confiável para gerar um PDF de alta qualidade a partir de documentos do Office.
            url.searchParams.set('action', 'print');
            // Remove o redirecionamento móvel, pois pode interferir na visualização de impressão
            url.searchParams.delete('mobileredirect');
            return url.toString();
        }
    } catch (error) {
        console.error("Não foi possível criar o link do PDF, retornando o link original.", error);
    }
    // Retorna o link original se a transformação falhar ou se não for um URL do SharePoint
    return originalLink;
};

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const finalLink = getPdfLink(document.link);
  const isLinkDisabled = !finalLink || finalLink === '#';

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl animate-fadeIn">
      <div>
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 bg-[#e0f2fe] p-3 rounded-lg">
            <DocumentIcon className="h-6 w-6 text-[#0A3130]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">{document.name}</h3>
            <span className="text-xs font-semibold uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{document.type}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-6 min-h-[40px]">{document.description}</p>
      </div>
      <a
        href={isLinkDisabled ? undefined : finalLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto w-full inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:brightness-110 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3095A6] ${isLinkDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={(e) => { if (isLinkDisabled) e.preventDefault(); }}
        aria-disabled={isLinkDisabled}
      >
        <ArrowUpRightFromSquareIcon className="h-5 w-5" />
        Visualize o Template aqui
      </a>
    </div>
  );
};

export default DocumentCard;