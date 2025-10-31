

import React from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { Link } from 'react-router-dom';
import { SearchableItem } from '../types';
import { BookOpenIcon, ClipboardListIcon, FileTextIcon } from './Icons';

interface SearchResultsProps {
    results: SearchableItem[];
    hasSearched: boolean;
}

const ResultIcon: React.FC<{ type: SearchableItem['type'] }> = ({ type }) => {
    const commonClasses = "h-7 w-7 text-white p-1 rounded-md mr-4 flex-shrink-0";
    switch (type) {
        case 'Fase':
            return <BookOpenIcon className={`${commonClasses} bg-purple-500`} />;
        case 'Atividade':
            return <FileTextIcon className={`${commonClasses} bg-[#3095A6]`} />;
        case 'Processo de Controle':
            return <ClipboardListIcon className={`${commonClasses} bg-green-500`} />;
        default:
            return null;
    }
};


const SearchResults: React.FC<SearchResultsProps> = ({ results, hasSearched }) => {
    if (!hasSearched) {
        return null;
    }

    if (results.length === 0) {
        return (
            <div className="mt-8 text-center text-gray-600 bg-gray-100 p-8 rounded-lg">
                <p className="font-semibold text-lg">Nenhum resultado encontrado.</p>
                <p>Tente buscar por outros termos.</p>
            </div>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Resultados da Busca</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
                {results.map((item) => (
                    <Link
                        key={item.id}
                        to={item.path}
                        className="block p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-start">
                            <ResultIcon type={item.type} />
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg text-[#0A3130]">{item.title}</h3>
                                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">{item.type}</span>
                                </div>
                                <p className="text-gray-600 mt-1">{item.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;