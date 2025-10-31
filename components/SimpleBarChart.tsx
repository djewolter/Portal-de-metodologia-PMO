
import React from 'react';

interface ChartData {
  month: string;
  planned: number;
  actual: number;
}

interface SimpleBarChartProps {
  data: ChartData[];
  title: string;
  unit?: string;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, title, unit = '' }) => {
  const maxValue = Math.max(...data.flatMap(d => [d.planned, d.actual]));

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">{title}</h4>
      <div className="flex justify-around items-end h-48 space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="flex items-end h-full gap-1 w-full justify-center">
              <div
                className="w-1/2 bg-gray-300 rounded-t-sm"
                style={{ height: `${(item.planned / maxValue) * 100}%` }}
                title={`Planejado: ${unit}${item.planned.toLocaleString('pt-BR')}`}
              ></div>
              <div
                className="w-1/2 bg-[#3095A6] rounded-t-sm"
                style={{ height: `${(item.actual / maxValue) * 100}%` }}
                title={`Realizado: ${unit}${item.actual.toLocaleString('pt-BR')}`}
              ></div>
            </div>
            <span className="text-xs font-medium text-gray-600 mt-2">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
          <span>Planejado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3095A6] rounded-sm"></div>
          <span>Realizado</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleBarChart;