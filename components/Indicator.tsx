
import React from 'react';

interface IndicatorProps {
  label: 'SPI' | 'CPI';
  value: number;
}

const Indicator: React.FC<IndicatorProps> = ({ label, value }) => {
  const getColorClasses = (val: number) => {
    if (val >= 0.98) {
      return 'bg-green-100 text-black border-green-300';
    }
    if (val >= 0.95) {
      return 'bg-yellow-100 text-black border-yellow-300';
    }
    return 'bg-red-100 text-black border-red-300';
  };

  const getTitle = (indicatorLabel: 'SPI' | 'CPI') => {
    const baseTitle = indicatorLabel === 'SPI' 
        ? 'Índice de Desempenho de Prazo (Schedule Performance Index)' 
        : 'Índice de Desempenho de Custo (Cost Performance Index)';
    return `${baseTitle}. Verde: >= 0.98, Amarelo: >= 0.95, Vermelho: < 0.95`;
  }

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getColorClasses(value)}`}
      title={getTitle(label)}
    >
      <span className="font-bold text-sm">{label}</span>
      <span className="font-semibold text-sm">{value.toFixed(2)}</span>
    </div>
  );
};

export default Indicator;
