import React, { useState, useEffect, useRef } from 'react';
import BackButton from '../components/BackButton';
import { SCurveDataPoint } from '../types';

// --- TYPE DEFINITIONS ---
interface Deliverable {
  projeto: string;
  nome: string;
  spi_sipal: string;
  spi_farol: string;
  perc_planejado: string;
  perc_concluido: string;
  inicio: string;
  termino: string;
}

interface ProcessedDeliverable extends Deliverable {
  // Parsed values
  spiFarolNum: number;
  percPlanejadoNum: number;
  percConcluidoNum: number;
  dataInicio: Date | null;
  dataTermino: Date | null;
  // Calculated fields
  status_prazo: 'Em Linha' | 'Fora de Linha';
  etapa: 'Não iniciado' | 'Em andamento' | 'Concluído';
  farol: 'verde' | 'amarelo' | 'vermelho';
  highlight: string;
  spi_calculado: number;
}

type GroupedData = Record<string, ProcessedDeliverable[]>;

// --- HELPER FUNCTIONS ---

const parseDate = (dateStr: string): Date | null => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().split(' ');
  const datePart = parts.length > 1 ? parts[1] : parts[0];
  const [day, month, year] = datePart.split('/');
  if (!day || !month || !year || isNaN(parseInt(day)) || isNaN(parseInt(month)) || isNaN(parseInt(year))) {
    return null;
  }
  const fullYear = parseInt(year) < 100 ? 2000 + parseInt(year) : parseInt(year);
  return new Date(fullYear, parseInt(month) - 1, parseInt(day));
};

const parsePercentage = (percStr: string): number => {
    if (!percStr || typeof percStr !== 'string') return 0;
    const num = parseFloat(percStr.replace(',', '.'));
    return isNaN(num) ? 0 : num;
}

const parseSPI = (spiStr: string): number => {
    if (!spiStr || typeof spiStr !== 'string') return 0;
    const num = parseFloat(spiStr.replace(',', '.'));
    return isNaN(num) ? 0 : num;
}

const gerarComentario = (spi: number, real: number, planejado: number): string => {
    if (spi < 0.95) {
      return "SPI abaixo do ideal. Atraso potencial detectado.";
    } else if (real < planejado) {
      return "Execução abaixo do planejado. Monitorar progresso.";
    } else if (real >= planejado && spi >= 1) {
      return "Entregável em linha com o cronograma.";
    } else {
      return "Monitorar.";
    }
};

const parseSCurvePercentage = (percStr: string): number => {
    if (!percStr || typeof percStr !== 'string') return 0;
    const num = parseFloat(percStr.replace('%', '').replace(',', '.'));
    return isNaN(num) ? 0 : num;
};

const parseSCurveDate = (dateStr: string): Date | null => {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return null;
    const fullYear = parseInt(year) < 100 ? 2000 + parseInt(year) : parseInt(year);
    const date = new Date(fullYear, parseInt(month) - 1, parseInt(day));
    date.setUTCHours(0, 0, 0, 0);
    return date;
};

// --- UI COMPONENTS ---

const Semaphore: React.FC<{ color: 'verde' | 'amarelo' | 'vermelho' }> = ({ color }) => {
    const colorClasses = {
        verde: 'bg-green-500',
        amarelo: 'bg-yellow-400',
        vermelho: 'bg-red-500',
    };
    return <div className={`w-4 h-4 rounded-full ${colorClasses[color]}`} title={`Farol ${color}`}></div>;
};

const StatusTag: React.FC<{ text: string }> = ({ text }) => {
    const colorClasses: { [key: string]: string } = {
        'Não iniciado': 'bg-gray-200 text-gray-700',
        'Em andamento': 'bg-blue-200 text-blue-800',
        'Concluído': 'bg-green-200 text-green-800',
        'Em Linha': 'bg-green-200 text-green-800',
        'Fora de Linha': 'bg-red-200 text-red-800',
    };
    const tagColor = colorClasses[text] || 'bg-gray-200 text-gray-700';
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${tagColor}`}>{text}</span>;
}

const SingleProgressBar: React.FC<{ value: number; label: string; color: string; }> = ({ value, label, color }) => (
    <div className="w-full">
        <div className="flex justify-between items-center mb-1 text-xs">
            <span className="font-medium text-gray-600">{label}</span>
            <span className="font-bold text-gray-800">{value.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className={`${color} h-2 rounded-full transition-all duration-500`} 
                style={{ width: `${value}%` }}
                title={`${label}: ${value.toFixed(2)}%`}
            ></div>
        </div>
    </div>
);

const SCurveChartComponent: React.FC<{ data: SCurveDataPoint[] }> = ({ data }) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (!chartRef.current || !data) return;

        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
        
        const labels = data.map(d => d.mes);
        const planejadoData = data.map(d => d.planejado);
        const realizadoData = data.map(d => d.realizado);

        const lastRealizadoIndex = data.map((item, idx) => ({ item, idx })).filter(d => d.item.realizado > 0).pop()?.idx ?? -1;
        const realizadoDataForChart = realizadoData.map((val, idx) => (idx > lastRealizadoIndex && val === 0) ? null : val);

        const chartData = {
            labels,
            datasets: [
                {
                    label: 'Planejado',
                    data: planejadoData,
                    borderColor: 'rgba(98, 192, 211, 1)',
                    backgroundColor: 'rgba(98, 192, 211, 0.2)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    pointRadius: 0
                },
                {
                    label: 'Realizado',
                    data: realizadoDataForChart,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: false,
                    pointRadius: (context: any) => context.dataIndex === lastRealizadoIndex ? 6 : 0,
                    pointBackgroundColor: 'rgba(255, 159, 64, 1)'
                }
            ]
        };
        
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { min: 0, max: 120, ticks: { stepSize: 20, callback: (value: any) => `${value}%` } },
                x: { title: { display: true, text: 'Mês' } }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: { callbacks: { label: (context: any) => `${context.dataset.label}: ${context.raw.toFixed(2)}%` } },
                datalabels: {
                    display: (context: any) => context.dataIndex === lastRealizadoIndex,
                    align: 'top',
                    offset: 8,
                    formatter: (value: number) => `${value.toFixed(2)}%`,
                    font: { weight: 'bold', size: 12 },
                    color: 'rgba(255, 159, 64, 1)'
                }
            }
        };

        const ctx = chartRef.current.getContext('2d');
        if (ctx) {
            chartInstanceRef.current = new (window as any).Chart(ctx, { type: 'line', data: chartData, options });
        }
        
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
                chartInstanceRef.current = null;
            }
        };
    }, [data]);

    return (
        <div style={{ position: 'relative', height: '400px' }}>
            <canvas ref={chartRef}></canvas>
            {/* TODO: Implementar previsão de metas */}
            {/* TODO: Adicionar alerta visual para SPI < 0.95 */}
        </div>
    );
};


const DeliveriesStatusPage: React.FC = () => {
    const [pastedData, setPastedData] = useState('');
    const [processedData, setProcessedData] = useState<GroupedData>({});
    const [error, setError] = useState<string | null>(null);

    const [sCurvePastedData, setSCurvePastedData] = useState('');
    const [sCurveData, setSCurveData] = useState<SCurveDataPoint[]>([]);
    const [sCurveError, setSCurveError] = useState<string | null>(null);

    const LOCAL_STORAGE_KEY = 'sipal-pmo-deliveries-scurve-v1';

    useEffect(() => {
        try {
            const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (savedData) {
                const parsed: any = JSON.parse(savedData);
                // FIX: Add type guard to ensure parsed data from localStorage is an array before calling .map() to prevent runtime errors with corrupted data.
                if (Array.isArray(parsed)) {
                    const dataWithDates = parsed.map((item: any) => ({
                        ...item,
                        data: new Date(item.data)
                    }));
                    setSCurveData(dataWithDates);
                }
            }
        } catch (e) {
            console.error("Failed to load S-Curve data from localStorage", e);
        }
    }, []);

    const persistSCurveData = (data: SCurveDataPoint[]) => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error("Failed to save S-Curve data to localStorage", e);
        }
    };


    const processData = (text: string) => {
        if (!text.trim()) {
            setProcessedData({});
            setError(null);
            return;
        }

        const lines = text.trim().split(/\r?\n/);
        const headerLine = lines.shift();
        if (!headerLine) {
            setError('Dados vazios.');
            return;
        }

        const separator = headerLine.includes('\t') ? '\t' : ';';
        const headers = headerLine.split(separator).map(h => h.trim());
        const expectedHeaders = ['Projeto', 'Nome', 'SPI SIPAL', 'SPI Farol', '% Trab. Planej.', '% Trab. Concluído', 'Início', 'Término'];
        
        const hasAllHeaders = expectedHeaders.every(eh => headers.includes(eh));
        if (!hasAllHeaders) {
            setError(`Cabeçalho inválido. Verifique se as colunas são: ${expectedHeaders.join(', ')}.`);
            return;
        }
        
        try {
            const data: ProcessedDeliverable[] = lines.map(line => {
                const values = line.split(separator);
                const row: any = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] ? values[index].trim() : '';
                });

                const deliverable: Deliverable = {
                    projeto: row['Projeto'] || 'Projeto Não Especificado',
                    nome: row['Nome'] || '',
                    spi_sipal: row['SPI SIPAL'] || '0',
                    spi_farol: row['SPI Farol'] || '0',
                    perc_planejado: row['% Trab. Planej.'] || '0',
                    perc_concluido: row['% Trab. Concluído'] || '0',
                    inicio: row['Início'] || '',
                    termino: row['Término'] || '',
                };

                // Normalize and calculate
                const percConcluidoNum = parsePercentage(deliverable.perc_concluido);
                const percPlanejadoNum = parsePercentage(deliverable.perc_planejado);
                const spiFarolNum = parseSPI(deliverable.spi_farol);
                const dataTermino = parseDate(deliverable.termino);
                
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const status_prazo = dataTermino && today > dataTermino && percConcluidoNum < 100 ? 'Fora de Linha' : 'Em Linha';
                const etapa = percConcluidoNum === 0 ? 'Não iniciado' : (percConcluidoNum >= 100 ? 'Concluído' : 'Em andamento');
                const farol = spiFarolNum >= 0.98 ? 'verde' : spiFarolNum >= 0.95 ? 'amarelo' : 'vermelho';
                const highlight = gerarComentario(spiFarolNum, percConcluidoNum, percPlanejadoNum);
                const spi_calculado = percPlanejadoNum > 0 ? (percConcluidoNum / percPlanejadoNum) : 1;

                return {
                    ...deliverable,
                    percConcluidoNum,
                    percPlanejadoNum,
                    spiFarolNum,
                    dataInicio: parseDate(deliverable.inicio),
                    dataTermino,
                    status_prazo,
                    etapa,
                    farol,
                    highlight,
                    spi_calculado,
                };
            });
            
            // Group data by project
            const grouped = data.reduce<GroupedData>((acc, item) => {
                const key = item.projeto;
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(item);
                return acc;
            }, {});
            
            setProcessedData(grouped);
            setError(null);
        } catch (e: any) {
             setError(`Ocorreu um erro ao processar os dados: ${e.message}`);
             setProcessedData({});
        }
    };

    const processSCurveData = (text: string) => {
        if (!text.trim()) {
            setSCurveData([]);
            setSCurveError(null);
            return;
        }

        const lines = text.trim().split(/\r?\n/);
        const headerLine = lines.shift()?.toLowerCase();
        
        if (!headerLine || !headerLine.includes('planejado') || !headerLine.includes('realizado') || !headerLine.includes('data') || !headerLine.includes('mês') || !headerLine.includes('spi')) {
            setSCurveError('Cabeçalho inválido. Use o formato: Planejado | Realizado | SPI | Data | mês');
            return;
        }

        const separator = headerLine.includes('\t') ? '\t' : '|';
        const headers = headerLine.split(separator).map(h => h.trim());
        const dataIndex = headers.indexOf('data');
        const planejadoIndex = headers.indexOf('planejado');
        const realizadoIndex = headers.indexOf('realizado');
        const spiIndex = headers.indexOf('spi');
        const mesIndex = headers.indexOf('mês');

        try {
            const dataPoints = lines.map(line => {
                if (!line.trim()) return null;

                const values = line.split(separator);
                if (values.length < headers.length) return null;

                const dataStr = values[dataIndex]?.trim();
                const data = parseSCurveDate(dataStr);

                if (!data) {
                    return null;
                }

                return {
                    id: dataStr,
                    data,
                    mes: values[mesIndex]?.trim() || '',
                    planejado: parseSCurvePercentage(values[planejadoIndex]),
                    realizado: parseSCurvePercentage(values[realizadoIndex]),
                    spi: parseFloat((values[spiIndex] || '0').replace(',', '.'))
                };
            }).filter((p): p is SCurveDataPoint => p !== null);

            if (lines.filter(l => l.trim()).length > 0 && dataPoints.length === 0) {
                 setSCurveError("Nenhuma linha de dados válida foi encontrada. Verifique se as datas estão no formato dd/mm/aaaa e se o separador é o mesmo do cabeçalho.");
                 setSCurveData([]);
                 return;
            }

            setSCurveData(dataPoints);
            persistSCurveData(dataPoints);
            setSCurveError(null);
        } catch (e: any) {
            setSCurveError(`Erro ao processar dados da Curva S: ${e.message}`);
            setSCurveData([]);
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const text = event.clipboardData.getData('text');
        setPastedData(text);
        processData(text);
    };

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = event.target.value;
        setPastedData(text);
        processData(text);
    };
    
    const handleSCurvePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const text = event.clipboardData.getData('text');
        setSCurvePastedData(text);
        processSCurveData(text);
    };

    const handleSCurveChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = event.target.value;
        setSCurvePastedData(text);
        processSCurveData(text);
    };
    
    const handleRealizadoChange = (id: string, newValue: string) => {
        const updatedValue = parseSCurvePercentage(newValue);
        if (isNaN(updatedValue)) return;
        
        const updatedData = sCurveData.map(item => item.id === id ? { ...item, realizado: updatedValue } : item);
        setSCurveData(updatedData);
        persistSCurveData(updatedData);
    };
    
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return (
        <main className="flex-grow bg-gray-100">
            <div className="container mx-auto px-4 py-12 md:py-16">
                <BackButton />
                <header className="text-center mb-8 animate-fadeIn">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3130] mb-3">
                        Andamento de Entregas
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Cole os dados da sua planilha para gerar automaticamente uma tabela de status com indicadores visuais.
                    </p>
                </header>

                <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <textarea
                        value={pastedData}
                        onPaste={handlePaste}
                        onChange={handleChange}
                        className="w-full h-40 p-4 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3095A6] focus:border-transparent text-sm"
                        placeholder="Cole aqui os dados copiados da planilha no formato padrão da aba Base MS Project."
                    />
                    {error && <p className="mt-4 text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
                </div>

                {Object.keys(processedData).length > 0 && (
                    <div className="mt-8 max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-gray-200 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tabela de Entregáveis por Projeto</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[1024px]">
                                <thead className="bg-gray-100 text-gray-600 uppercase">
                                    <tr>
                                        <th className="p-3">Entregável</th>
                                        <th className="p-3 text-center">Farol</th>
                                        <th className="p-3 text-center">SPI</th>
                                        <th className="p-3 w-48">Progresso</th>
                                        <th className="p-3 text-center">Prazo</th>
                                        <th className="p-3 text-center">Etapa</th>
                                        <th className="p-3">Comentário Automático</th>
                                        <th className="p-3">Término</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(processedData).map(([projectName, deliverables]) => (
                                        <React.Fragment key={projectName}>
                                            <tr className="bg-[#0A3130]/10">
                                                <td colSpan={8} className="p-3 font-bold text-[#0A3130] text-base">{projectName}</td>
                                            </tr>
                                            {deliverables.map((item, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50">
                                                    <td className="p-3 font-medium text-gray-800">{item.nome}</td>
                                                    <td className="p-3"><div className="flex justify-center"><Semaphore color={item.farol} /></div></td>
                                                    <td className="p-3 text-center font-semibold text-gray-700">{item.spi_calculado.toFixed(2)}</td>
                                                    <td className="p-3">
                                                        <div className="flex flex-col gap-2">
                                                            <SingleProgressBar value={item.percPlanejadoNum} label="Planejado" color="bg-gray-400" />
                                                            <SingleProgressBar value={item.percConcluidoNum} label="Realizado" color="bg-blue-500" />
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-center"><StatusTag text={item.status_prazo} /></td>
                                                    <td className="p-3 text-center"><StatusTag text={item.etapa} /></td>
                                                    <td className="p-3 text-gray-600">{item.highlight}</td>
                                                    <td className="p-3 text-gray-600">{item.dataTermino ? item.dataTermino.toLocaleDateString('pt-BR') : 'N/A'}</td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {/* S-CURVE SECTION */}
                <div className="mt-12 max-w-7xl mx-auto space-y-8">
                    <header className="text-center">
                      <h2 className="text-3xl font-extrabold text-[#0A3130] mb-3">Curva S de Andamento</h2>
                      <p className="text-lg text-gray-600">Cole os dados da Curva S para visualizar o progresso.</p>
                    </header>
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                        <textarea
                            value={sCurvePastedData}
                            onChange={handleSCurveChange}
                            onPaste={handleSCurvePaste}
                            className="w-full h-40 p-4 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3095A6] focus:border-transparent text-sm"
                            placeholder="Cole aqui os dados da Curva S no formato: Planejado | Realizado | SPI | Data | mês"
                        />
                        {sCurveError && <p className="mt-4 text-center text-red-600 bg-red-50 p-3 rounded-md">{sCurveError}</p>}
                    </div>

                    {sCurveData.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-8 animate-fadeIn">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Dados da Curva S</h3>
                                <div className="overflow-x-auto max-h-96 border rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-100 sticky top-0">
                                            <tr>
                                                <th className="p-2 text-left font-semibold text-gray-600">Data</th>
                                                <th className="p-2 text-left font-semibold text-gray-600">Mês</th>
                                                <th className="p-2 text-left font-semibold text-gray-600">Planejado</th>
                                                <th className="p-2 text-left font-semibold text-gray-600">Realizado</th>
                                                <th className="p-2 text-left font-semibold text-gray-600">SPI</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {sCurveData.map(item => {
                                                const isEditable = item.data >= today;
                                                return (
                                                    <tr key={item.id} className="hover:bg-gray-50">
                                                        <td className="p-2 text-gray-700">{item.data.toLocaleDateString('pt-BR')}</td>
                                                        <td className="p-2 text-gray-700">{item.mes}</td>
                                                        <td className="p-2 text-gray-700">{item.planejado.toFixed(2)}%</td>
                                                        <td className="p-2">
                                                            <input 
                                                                type="text" 
                                                                value={`${item.realizado}%`}
                                                                onChange={e => handleRealizadoChange(item.id, e.target.value)}
                                                                disabled={!isEditable}
                                                                className={`w-24 p-1 border rounded-md text-sm ${!isEditable ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white border-gray-300 focus:ring-1 focus:ring-[#3095A6]'}`}
                                                            />
                                                        </td>
                                                        <td className="p-2 text-gray-700">{item.spi.toFixed(2)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Gráfico da Curva S</h3>
                                <SCurveChartComponent data={sCurveData} />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
};

export default DeliveriesStatusPage;