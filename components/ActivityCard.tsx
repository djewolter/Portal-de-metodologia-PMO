import React from 'react';
import { Activity } from '../types';
import {
    StarIcon,
    CalendarDaysIcon,
    RotateCcwIcon,
    ClipboardListIcon,
    ClockIcon,
} from './Icons';

interface ActivityCardProps {
  activity: Activity;
  onCardClick: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onCardClick }) => {
  const isOutputDoc = activity.isOutputDocument;
  const isSprint = activity.isSprintActivity;

  const ICONS: { [key: string]: React.FC<any> } = {
    '4.7': CalendarDaysIcon,
    '4.8': RotateCcwIcon,
    '4.9': ClipboardListIcon,
    '4.10': ClockIcon,
  };
  const IconComponent = isSprint ? ICONS[activity.id] : null;

  const isClickable = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '1.10', '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '5.1', '5.2', '5.3', '6.1', '6.2', '6.3', '7.1', '7.2', '7.3'].includes(activity.id);

  if (isSprint) {
    const nameParts = activity.name.split(' - ');
    const sprintLabel = nameParts[0];
    const sprintName = nameParts.slice(1).join(' - ');
    
    return (
        <div 
          className="flex items-center p-4 text-left bg-[#0A3130]/10 border border-[#3095A6]/50 rounded-lg shadow-sm h-full transition-all transform hover:-translate-y-1 cursor-pointer hover:bg-[#0A3130]/20 hover:ring-2 hover:ring-[#3095A6] focus:outline-none focus:ring-2 focus:ring-[#3095A6]"
          title="Clique para ver o procedimento"
          onClick={() => onCardClick(activity.id)}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onCardClick(activity.id)}
          tabIndex={0}
          role="button"
        >
          {IconComponent && <IconComponent className="h-8 w-8 text-[#0A3130] mr-4 flex-shrink-0" />}
          <div>
            <p className="font-bold text-[#0A3130] text-xs uppercase">{sprintLabel}</p>
            <p className="font-semibold text-gray-800 text-sm leading-tight">{sprintName}</p>
          </div>
        </div>
    );
  }

  const cardClasses = `
    relative flex flex-col items-center justify-center p-3 text-center
    border rounded-lg shadow-sm transition-all duration-300 transform hover:-translate-y-1
    min-h-[120px] group
    ${
      isOutputDoc
        ? 'bg-[#0A3130]/5 border-2 border-[#3095A6] shadow-lg'
        : activity.isPmoAction
        ? 'bg-gray-200 border-gray-300'
        : 'bg-white border-gray-200'
    }
    ${
      isClickable
        ? 'cursor-pointer hover:ring-2 hover:ring-[#3095A6] focus:outline-none focus:ring-2 focus:ring-[#3095A6]'
        : ''
    }
  `;

  return (
    <div 
      className={cardClasses} 
      title={isClickable ? "Clique para ver o procedimento" : activity.description}
      onClick={isClickable ? () => onCardClick(activity.id) : undefined}
      onKeyDown={isClickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onCardClick(activity.id) : undefined}
      tabIndex={isClickable ? 0 : -1}
      role={isClickable ? 'button' : undefined}
    >
      {/* Mandatory indicator */}
      {activity.isMandatory && (
        <span
          className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white"
          title="Atividade Obrigatória"
        ></span>
      )}
      
      {/* Output Document Highlight */}
      {isOutputDoc && (
        <>
            <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white text-xs font-bold py-1 px-2 rounded-t-lg">
                Documento de Saída
            </div>
            <StarIcon className="w-8 h-8 text-amber-400 mt-6 mb-1" />
        </>
      )}

      {!isOutputDoc && (
        <span className="text-sm font-bold text-gray-500 mt-4">{activity.id}</span>
      )}

      <p className={`mt-1 font-semibold text-sm md:text-base ${isOutputDoc ? 'text-[#0A3130]' : 'text-gray-800'}`}>
        {activity.name}
      </p>
    </div>
  );
};

export default ActivityCard;