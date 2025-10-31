
import React from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
  const activeLinkClass = 'text-white bg-white/25';
  const inactiveLinkClass = 'text-gray-200 hover:bg-white/15 hover:text-white';

  return (
    <header className="bg-gradient-to-b from-[#0A3130] to-[#3095A6] shadow-md">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center text-white text-xl font-bold">
            Escritório de Projetos
          </NavLink>
          <div className="flex space-x-4">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/metodologia"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeLinkClass : inactiveLinkClass}`
              }
            >
              Metodologia
            </NavLink>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;