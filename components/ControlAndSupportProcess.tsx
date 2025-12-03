
import React from 'react';
import { CONTROL_SUPPORT_PROCESSES } from '../constants';
import { ArrowUpRightFromSquareIcon } from './Icons';

interface ControlAndSupportProcessProps {
  onProcessClick: (processId: string) => void;
  onMinutesInfoClick: () => void;
  onStatusReportInfoClick: () => void;
  onCashFlowInfoClick: () => void;
  onTestingGuideClick: () => void;
}

const ControlAndSupportProcess: React.FC<ControlAndSupportProcessProps> = ({ 
  onProcessClick, 
  onMinutesInfoClick, 
  onStatusReportInfoClick, 
  onCashFlowInfoClick,
  onTestingGuideClick 
}) => {

  const getActionText = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('solicitar')) {
        return 'Solicite aqui';
    }
    if (lowerName.includes('registrar') || lowerName.includes('registro')) {
        return 'Registre aqui';
    }
    if (lowerName.includes('gerir')) {
        return 'Gerencie aqui';
    }
    return 'Acesse aqui';
  };
  
  const processLinks: Record<string, string> = {
    'csp-1': 'https://forms.office.com/Pages/ResponsePage.aspx?id=0uwvvV2E_U-zAmudrMZWXTZMeiE-LXdBib-ZZD2iowBUQjU2TUYzOVhMVjJQTk9FVDRCTERWNVZIOS4u',
    'csp-2': 'https://forms.office.com/Pages/ResponsePage.aspx?id=0uwvvV2E_U-zAmudrMZWXTZMeiE-LXdBib-ZZD2iowBUQVBFN05GQklGWVNMUVZQUzJQNUhYVDFISS4u',
    'csp-3': 'https://forms.office.com/Pages/ResponsePage.aspx?id=0uwvvV2E_U-zAmudrMZWXTZMeiE-LXdBib-ZZD2iowBUNTZRMURBRzVOQzJNQUMzSEtKRVlUNkw0Ui4u',
    'csp-4': 'https://sipal.zeev.it/2.0/request?c=MwyuozcTzE82XQa9sJEJw%2BUwz382vkD8C6Kq%2BTqjYMNk1SXjboAj1ZqZmG%2FE11g9z2JTUozLg%2B%2FbWwLFwzpy8A%3D%3D',
    'csp-7': 'https://gruposipal.sharepoint.com/sites/PMO/Lists/Riscos/AllItems.aspx',
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
        Processo de Controle e Apoio ao Projeto
      </h2>
      <div className="bg-yellow-50/50 p-6 md:p-8 rounded-2xl shadow-inner border border-yellow-300">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {CONTROL_SUPPORT_PROCESSES.map((process) => {
            const actionText = getActionText(process.name);
            const externalLink = processLinks[process.id];
            
            const cardClasses = "bg-white rounded-lg shadow p-4 text-center text-sm font-semibold text-gray-700 hover:bg-yellow-100 hover:shadow-md transition-all duration-200 h-full flex flex-col items-center justify-between min-h-[110px]";

            const cardContent = (
                <>
                    <span className="flex-grow flex items-center">{process.name}</span>
                    <div className="w-full mt-3 pt-2 border-t border-yellow-300">
                      <span className="flex items-center justify-center gap-1 text-xs font-bold text-[#0A3130] hover:underline">
                        {actionText}
                        <ArrowUpRightFromSquareIcon className="h-3 w-3" />
                      </span>
                    </div>
                </>
            );

            if (process.id === 'csp-5') {
              return (
                <button
                  key={process.id}
                  onClick={onMinutesInfoClick}
                  className={cardClasses}
                  title={`Clique para ver detalhes de "${process.name}"`}
                >
                  {cardContent}
                </button>
              );
            }

            if (process.id === 'csp-6') {
              return (
                <button
                  key={process.id}
                  onClick={onStatusReportInfoClick}
                  className={cardClasses}
                  title={`Clique para ver detalhes de "${process.name}"`}
                >
                  {cardContent}
                </button>
              );
            }

            if (process.id === 'csp-8') {
              return (
                <button
                  key={process.id}
                  onClick={onCashFlowInfoClick}
                  className={cardClasses}
                  title={`Clique para ver detalhes de "${process.name}"`}
                >
                  {cardContent}
                </button>
              );
            }

            if (process.id === 'csp-9') {
              return (
                <button
                  key={process.id}
                  onClick={onTestingGuideClick}
                  className={cardClasses}
                  title={`Clique para ver detalhes de "${process.name}"`}
                >
                  {cardContent}
                </button>
              );
            }
            
            if (externalLink) {
              return (
                <a
                  key={process.id}
                  href={externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClasses}
                  title={`Clique para acessar "${process.name}"`}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <button
                key={process.id}
                onClick={() => onProcessClick(process.id)}
                className={cardClasses}
                title={`Clique para ver detalhes de "${process.name}"`}
              >
                {cardContent}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ControlAndSupportProcess;