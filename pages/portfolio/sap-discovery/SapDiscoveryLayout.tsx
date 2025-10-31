import React from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { Outlet, NavLink } from 'react-router-dom';
import { PortfolioProject } from '../../../types';
import BackButton from '../../../components/BackButton';

interface SapDiscoveryLayoutProps {
    project: PortfolioProject;
}

const sections = [
    { id: '', title: 'Resumo e Indicadores' },
    { id: 'governanca', title: 'Governança' },
    { id: 'entregas', title: 'Principais Entregas' },
    { id: 'proximos-passos', title: 'Próximos Passos' },
    { id: 'workshops', title: 'Workshops' },
    { id: 'escopo', title: 'Escopo e Priorização' },
    { id: 'requisitos', title: 'Requisitos' },
    { id: 'riscos', title: 'Riscos e Premissas' },
    { id: 'documentos', title: 'Documentos' },
    { id: 'encerramento', title: 'Marco de Encerramento' },
];

const SapDiscoveryLayout: React.FC<SapDiscoveryLayoutProps> = ({ project }) => {
    return (
        <main className="flex-grow bg-gray-100 py-12 font-sans">
            <div className="container mx-auto max-w-7xl px-4">
                <BackButton fallback="/portfolio" />

                <header className="mb-8">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-extrabold text-black">{project.name}</h1>
                        <span className="px-3 py-1 text-sm font-bold text-white rounded-full bg-[#0A3130]">Discovery</span>
                    </div>
                    <p className="mt-2 text-black/70">Gerente de Projeto: <span className="font-semibold text-black">{project.manager}</span></p>
                </header>
                
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    <aside className="md:w-1/4 lg:w-1/5">
                        <nav className="sticky top-24">
                            <h3 className="text-lg font-semibold text-black mb-3 px-3">Navegação</h3>
                            <ul className="space-y-1">
                                {sections.map(sec => (
                                    <li key={sec.id}>
                                        <NavLink 
                                            to={`/portfolio/${project.id}/${sec.id}`}
                                            end={sec.id === ''}
                                            className={({ isActive }) => 
                                                `block px-3 py-2 rounded-md text-sm font-medium transition-all ${
                                                    isActive 
                                                        ? 'bg-[#0A3130] text-white' 
                                                        : 'text-black/70 hover:bg-gray-200 hover:text-black'
                                                }`
                                            }
                                        >
                                            {sec.title}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </aside>
                    
                    <div className="flex-1 min-w-0 space-y-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SapDiscoveryLayout;