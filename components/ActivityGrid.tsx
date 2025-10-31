
import React from 'react';
import { Phase } from '../types';
import ActivityCard from './ActivityCard';
import SprintExplanation from './SprintExplanation';

interface ActivityGridProps {
  phase: Phase | null;
  onCardClick: (activityId: string) => void;
}

const ActivityGrid: React.FC<ActivityGridProps> = ({ phase, onCardClick }) => {
  if (!phase) {
    return (
      <div
        className="transition-all duration-700 ease-in-out overflow-hidden max-h-0 opacity-0 mt-0"
        aria-hidden="true"
      ></div>
    );
  }

  const sprintActivities = phase.activities.filter(a => a.isSprintActivity);
  const regularActivities = phase.activities.filter(a => !a.isSprintActivity);

  return (
    <div
      className={`transition-all duration-700 ease-in-out overflow-hidden ${
        phase ? 'max-h-[2000px] opacity-100 mt-12' : 'max-h-0 opacity-0 mt-0'
      }`}
      aria-hidden={!phase}
    >
      <div className="bg-white/50 p-6 md:p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {regularActivities.map(activity => (
            <ActivityCard 
              key={activity.id} 
              activity={activity} 
              onCardClick={onCardClick} 
            />
          ))}
        </div>
        
        {phase.hasSprints && sprintActivities.length > 0 && (
          <div className="mt-8">
            <SprintExplanation />
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sprintActivities.map(activity => (
                  <ActivityCard 
                      key={activity.id} 
                      activity={activity} 
                      onCardClick={onCardClick}
                  />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityGrid;
