

import React, { useState, useMemo } from 'react';
import { TEMPLATE_DOCUMENTS } from '../data/templateData';
import DocumentCard from '../components/DocumentCard';
import { SearchIcon } from '../components/Icons';
import BackButton from '../components/BackButton';

const PHASES_ORDER = ['Demanda', 'Prepare', 'Explore', 'Realize', 'Deploy', 'Run', 'Pós-projeto', 'Outros'];

const TemplatesPage: React.FC = () => {
  const [activePhase, setActivePhase] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredDocuments = useMemo(() => {
    return TEMPLATE_DOCUMENTS
      .filter(doc => {
        const matchesPhase = activePhase === 'Todos' || doc.phase === activePhase;
        const matchesSearch = searchTerm.trim() === '' ||
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.type.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesPhase && matchesSearch;
      });
  }, [activePhase, searchTerm]);

  return (
    <main className="flex-grow bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <BackButton />
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3130] mb-3">
            Templates e Documentação
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Acesse os modelos, guias e documentos de apoio por fase da metodologia de projetos.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="sticky top-0 z-10 bg-gray-50/90 backdrop-blur-sm py-4 mb-8 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <div className="max-w-7xl mx-auto">
              {/* Search Bar */}
              <div className="relative mb-6 max-w-2xl mx-auto">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nome, fase ou tipo..."
                  className="w-full pl-12 pr-4 py-3 text-base text-gray-700 bg-white border-2 border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3095A6]"
                  aria-label="Buscar documentos"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon className="h-6 w-6" />
                </div>
              </div>

              {/* Phase Tabs */}
              <div className="flex justify-center flex-wrap gap-2">
                <button
                  onClick={() => setActivePhase('Todos')}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                    activePhase === 'Todos' ? 'bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Todos
                </button>
                {PHASES_ORDER.map(phase => (
                  <button
                    key={phase}
                    onClick={() => setActivePhase(phase)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                      activePhase === phase ? 'bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white shadow' : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {phase}
                  </button>
                ))}
              </div>
            </div>
        </div>

        {/* Documents Grid */}
        <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDocuments.map(doc => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-700">Nenhum documento encontrado</h3>
              <p className="text-gray-500 mt-2">Tente ajustar seus filtros ou o termo de busca.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TemplatesPage;