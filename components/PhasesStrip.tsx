
import React from 'react';
import { Phase } from '../types';
import { ChevronRightIcon } from './Icons';

interface PhasesStripProps {
  phases: Phase[];
  activePhaseId: number | null;
  onPhaseClick: (id: number) => void;
}

const PhasesStrip: React.FC<PhasesStripProps> = ({ phases, activePhaseId, onPhaseClick }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center overflow-x-auto pb-4 scrollbar-thin">
        {phases.map((phase, index) => {
          const isActive = phase.id === activePhaseId;
          const buttonClasses = `
            flex-shrink-0 flex items-center justify-center px-6 py-3 min-w-[150px]
            rounded-lg shadow-md font-bold transition-all duration-300 transform 
            hover:-translate-y-1 hover:shadow-xl focus:outline-none
            ${phase.color} ${phase.textColor}
            ${isActive ? `ring-4 ring-offset-2 ${phase.highlightColor}` : 'ring-0'}
          `;

          return (
            <React.Fragment key={phase.id}>
              <button
                className={buttonClasses}
                onClick={() => onPhaseClick(phase.id)}
                aria-pressed={isActive}
              >
                {phase.name}
              </button>
              {index < phases.length - 1 && (
                <div className="flex-shrink-0 px-2">
                  <ChevronRightIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default PhasesStrip;
