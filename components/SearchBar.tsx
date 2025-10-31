import React, { useState } from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Busque por fases, atividades, processos..."
                    className="w-full pl-5 pr-28 py-3 text-base text-gray-700 bg-white border-2 border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-[#3095A6] focus:border-transparent transition-all"
                    aria-label="Campo de busca"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#0A3130] to-[#3095A6] hover:brightness-110 text-white font-bold px-5 py-2 rounded-full shadow-sm transition-transform transform hover:scale-105"
                    aria-label="Buscar"
                >
                    <SearchIcon className="h-5 w-5" />
                    <span>Buscar</span>
                </button>
            </div>
        </form>
    );
};

export default SearchBar;