import React, { useRef, useEffect, useState } from 'react';

// Safely register plugins
if (typeof window !== 'undefined' && (window as any).Chart) {
    const Chart = (window as any).Chart;
    const ChartDataLabels = (window as any).ChartDataLabels;
    const Annotation = (window as any).chartjsPluginAnnotation;
    if (ChartDataLabels) Chart.register(ChartDataLabels);
    if (Annotation) Chart.register(Annotation);
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

interface SCurveChartProps {
    data: any;
    isCompact?: boolean;
    showPinnedValues?: boolean;
}

const SCurveChart: React.FC<SCurveChartProps> = ({ data, isCompact = false, showPinnedValues = true }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);
    const [stickyLabels, setStickyLabels] = useState<any[]>([]);

    useEffect(() => {
        if (!isCompact) {
            setStickyLabels([]);
        }
    }, [data, isCompact]);
  
    useEffect(() => {
        if (!chartRef.current || !data) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const handleChartClick = (_: any, elements: any[]) => {
            if (isCompact || elements.length === 0) return;

            const { index: monthIndex } = elements[0];
            const xLabel = data.labels[monthIndex];

            const isMonthPinned = stickyLabels.some(l => l.x === monthIndex);

            setStickyLabels(currentLabels => {
                if (isMonthPinned) {
                    return currentLabels.filter(l => l.x !== monthIndex);
                } else {
                    const otherLabels = currentLabels.filter(l => l.x !== monthIndex);
                    const newLabelsForMonth = data.datasets
                        .map((dataset: any, datasetIndex: number) => {
                            const value = dataset.data[monthIndex];
                            if (value === null || value === undefined) return null;
                            
                            return {
                                pointId: `${datasetIndex}-${monthIndex}`,
                                xLabel,
                                value,
                                seriesLabel: dataset.label,
                                x: monthIndex,
                            };
                        })
                        .filter(Boolean);
                    return [...otherLabels, ...newLabelsForMonth];
                }
            });
        };

        const annotations = (showPinnedValues && !isCompact) ? stickyLabels.map(label => ({
            type: 'label',
            xValue: label.x,
            yValue: label.value,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            content: [`${label.seriesLabel}`, `${label.xLabel}: ${formatCurrency(label.value)}`],
            borderRadius: 6, font: { size: 11, weight: 'bold' }, padding: 6, yAdjust: -20,
        })) : [];

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            onClick: handleChartClick,
            plugins: {
                legend: { display: !isCompact, labels: { boxWidth: 20, padding: 20 } },
                tooltip: { 
                    enabled: !isCompact,
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: (context: any) => `${context.dataset.label}: ${formatCurrency(context.raw)}`
                    }
                },
                datalabels: { display: false },
                annotation: { annotations }
            },
            scales: {
                y: { 
                    display: !isCompact,
                    ticks: { callback: (value: any) => formatCurrency(value) }
                },
                x: {
                    display: !isCompact,
                }
            }
        };

        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
            chartInstanceRef.current = new (window as any).Chart(ctx, { type: 'line', data, options });
        }
    
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data, stickyLabels, isCompact, showPinnedValues]);

    return <canvas ref={chartRef}></canvas>;
};

export default SCurveChart;