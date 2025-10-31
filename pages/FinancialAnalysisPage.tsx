










import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { UploadIcon, ChartBarIcon, SparklesIcon, RefreshCwIcon, XCircleIcon } from '../components/Icons';
import BackButton from '../components/BackButton';
import SCurveChart from '../components/SCurveChart';
import { GoogleGenAI } from '@google/genai';
import MultiSelectDropdown from '../components/MultiSelectDropdown';


// Safely register Chart.js plugins if they exist on the window
if (typeof window !== 'undefined' && (window as any).Chart) {
    const Chart = (window as any).Chart;
    const ChartDataLabels = (window as any).ChartDataLabels;
    const Annotation = (window as any).chartjsPluginAnnotation;

    // Chart.js handles duplicate registrations, so it's safe to call register directly.
    if (ChartDataLabels) {
        Chart.register(ChartDataLabels);
    }
    if (Annotation) {
        Chart.register(Annotation);
    }
}


const LOCAL_STORAGE_KEY = 'sipal-pmo-financial-analysis-v1';

// Helper to parse year values safely
const parseYear = (value: any): number => {
    if (typeof value === 'number') return Math.floor(value);
    if (typeof value === 'string') {
        const cleaned = value.replace(/[^0-9]/g, '');
        const num = parseInt(cleaned, 10);
        return isNaN(num) ? 0 : num;
    }
    return 0;
}

// Helper to safely parse numbers, handling Brazilian currency format
const parseNumber = (value: any): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const cleanedValue = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    const number = parseFloat(cleanedValue);
    return isNaN(number) ? 0 : number;
  }
  return 0;
};

// Helper to format numbers into Brazilian currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// AI Report formatter component
const AiAnalysisReport: React.FC<{ text: string }> = ({ text }) => {
    const formattedContent = useMemo(() => {
        return text.split('\n').map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;

            const headingMatch = trimmedLine.match(/^(\d+)\.\s?(\*\*|)(.*?)\2/);
            if (headingMatch) {
                return (
                    <div key={index} className="mt-4 first:mt-0">
                        <h4 className="text-lg font-bold text-gray-800 mb-2">{headingMatch[1]}. {headingMatch[3]}</h4>
                    </div>
                );
            }
            
            const listItemMatch = trimmedLine.match(/^[-*]\s(.*)/);
            if (listItemMatch) {
                return (
                    <li key={index} className="ml-5 list-disc text-gray-700 leading-relaxed">
                        {listItemMatch[1]}
                    </li>
                );
            }

            return (
                <p key={index} className="text-gray-700 leading-relaxed mb-3">
                    {trimmedLine}
                </p>
            );
        }).filter(Boolean);
    }, [text]);

    return <div>{formattedContent}</div>;
};


// Chart Components
const DecompositionChart: React.FC<{ data: any }> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current && data) {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const maxValue = data.datasets?.[0]?.data?.reduce((max: number, val: number) => Math.max(max, val), 0) || 0;

        chartInstanceRef.current = new (window as any).Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    top: 30 // Extra space for labels on top
                }
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context: any) => `Total: ${formatCurrency(context.raw)}`
                }
              },
              datalabels: {
                anchor: 'end',
                align: 'end', // Position label on top of the bar
                offset: 4, // Small distance from the bar top
                formatter: (value: number) => formatCurrency(value),
                color: '#1F2937', // Darker font for contrast
                font: {
                    weight: 'bold',
                    size: 11, // Larger font size
                },
                clamp: true, // Prevents label from going outside chart area
              }
            },
            scales: {
              y: {
                display: false,
                max: maxValue * 1.25, // Add 25% padding to avoid clipping tall bar labels
              },
              x: {
                grid: {
                  display: false
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 30,
                    autoSkip: false, // Ensure all category labels are visible
                }
              }
            }
          },
        });
      }
    }
     return () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

const ProjectDecompositionChart: React.FC<{ data: any }> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (chartRef.current && data) {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstanceRef.current = new (window as any).Chart(ctx, {
          type: 'bar',
          data: data,
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context: any) => `Total: ${formatCurrency(context.raw)}`
                }
              },
              datalabels: {
                anchor: 'end',
                align: 'end',
                formatter: (value: number) => formatCurrency(value),
                color: '#333',
                font: {
                    weight: 'bold',
                    size: 10
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: {
                    callback: (value: any) => formatCurrency(value),
                    font: { size: 10 }
                }
              },
              y: {
                grid: { display: false },
                ticks: {
                  font: { size: 10 }
                }
              }
            }
          },
        });
      }
    }
     return () => {
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
            chartInstanceRef.current = null;
        }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};


const FinancialAnalysisPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [allData, setAllData] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<{ anos: string[], projetos: string[], programas: string[], categorias: string[] } | null>(null);
  const [filters, setFilters] = useState({ ano: [] as string[], projeto: [] as string[], programa: [] as string[], categoria: [] as string[] });
  const [chartData, setChartData] = useState<{ sCurve: any; decomposition: any; realizedByProject: any; realizedByContract: any; realizedByCategory: any; } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>("Faça o upload de uma planilha .xlsx para começar.");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPinnedValues, setShowPinnedValues] = useState(true);
  const hasGeneratedOnce = useRef(false);


  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);

        if (parsed.fileName) {
          setFile({ name: parsed.fileName } as File);
        }
        setAllData(parsed.allData || []);
        setFilterOptions(parsed.filterOptions || null);
        
        const loadedFilters = parsed.filters || { ano: [], projeto: [], programa: [], categoria: [] };

        // If no years are selected in the saved filters, apply the default for 2023-2025
        if (!loadedFilters.ano || loadedFilters.ano.length === 0) {
            const filterOptionsFromStorage = parsed.filterOptions || { anos: [] };
            const defaultYears = ['2023', '2024', '2025'].filter(y => filterOptionsFromStorage.anos.includes(y));
            loadedFilters.ano = defaultYears;
        }
        
        setFilters(loadedFilters);

        setChartData(parsed.chartData || null);
        setAiAnalysis(parsed.aiAnalysis || null);
        
        if (parsed.chartData) {
            hasGeneratedOnce.current = true;
            setMessage(null);
        } else if (parsed.fileName) {
            setMessage(`Planilha "${parsed.fileName}" carregada. Gere o dashboard para ver os gráficos.`);
        }
      } catch (e) {
        console.error("Erro ao carregar dados salvos:", e);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);
  
  const handleFilterChange = (filterType: keyof typeof filters, value: string | string[]) => {
    setFilters(prev => ({ ...prev, [filterType]: Array.isArray(value) ? value : [value] }));
  };

  const handleMultiSelectFilterChange = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const currentSelection = prev[filterType];
      const newSelection = currentSelection.includes(value)
        ? currentSelection.filter(item => item !== value)
        : [...currentSelection, value];
      return { ...prev, [filterType]: newSelection };
    });
  };
  
  const removeFilter = (filterType: keyof typeof filters, value: string) => {
    setFilters(prev => ({
        ...prev,
        [filterType]: prev[filterType].filter(item => item !== value),
    }));
  };

  const getActiveFilters = () => {
      const active = [];
      for (const key in filters) {
          const filterKey = key as keyof typeof filters;
          filters[filterKey].forEach(value => {
              active.push({ type: filterKey, value });
          });
      }
      return active;
  };


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.xlsx')) {
        setMessage('Erro: Apenas arquivos .xlsx são permitidos.');
        return;
    }

    setFile(selectedFile);
    setIsLoading(true);
    setMessage('Processando planilha...');
    setChartData(null);
    setFilterOptions(null);
    setAllData([]);
    setAiAnalysis(null);
    setError(null);
    hasGeneratedOnce.current = false;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = event.target?.result;
            const workbook = (window as any).XLSX.read(data, { type: 'binary' });
            
            let jsonData: any[] = [];
            workbook.SheetNames.forEach((sheetName: string) => {
                const worksheet = workbook.Sheets[sheetName];
                const sheetJson = (window as any).XLSX.utils.sheet_to_json(worksheet);
                jsonData = jsonData.concat(sheetJson);
            });

            const firstRow = jsonData[0] || {};
            const requiredColumns = ['Programa', 'Ano', 'Janeiro', 'Status', 'Projeto Vinculado', 'Categoria'];
            const hasRequiredColumns = requiredColumns.every(col => col in firstRow);

            if(!hasRequiredColumns) {
                setMessage("Erro: A planilha não contém as colunas necessárias (Programa, Ano, Status, meses, etc.).");
                setIsLoading(false);
                return;
            }

            setAllData(jsonData);

            const anos = [...new Set(jsonData.map((row: any) => String(row['Ano'] ?? '')))].filter(Boolean).sort();
            const projetos = [...new Set(jsonData.map((row: any) => String(row['Projeto Vinculado'] ?? '')))].filter(Boolean).sort();
            const programas = [...new Set(jsonData.map((row: any) => String(row['Programa'] ?? '')))].filter(Boolean).sort();
            const categorias = [...new Set(jsonData.map((row: any) => String(row['Categoria'] ?? '')))].filter(Boolean).sort();
            
            const defaultYears = ['2023', '2024', '2025'].filter(y => anos.includes(y));

            setFilterOptions({ anos, projetos, programas, categorias });
            setFilters({ ano: defaultYears, projeto: [], programa: [], categoria: [] });
            setMessage(`Arquivo "${selectedFile.name}" carregado (todas as abas lidas). Selecione os filtros e gere o dashboard.`);
        } catch (e) {
            console.error("Erro ao processar o arquivo:", e);
            setMessage("Ocorreu um erro ao ler o arquivo. Verifique o formato.");
        } finally {
            setIsLoading(false);
        }
    };
    reader.readAsBinaryString(selectedFile);
  };
  
  const handleGenerateDashboard = useCallback(async () => {
    if (allData.length === 0) {
      setMessage("Nenhum dado para analisar. Por favor, carregue uma planilha.");
      return;
    }
    setIsLoading(true);
    setMessage("Gerando dashboard e análise de IA...");
    setChartData(null);
    setAiAnalysis(null);
    setError(null);

    setTimeout(async () => {
        try {
            let filteredData = allData;
            if (filters.ano.length > 0) filteredData = filteredData.filter(row => filters.ano.includes(parseYear(row['Ano']).toString()));
            if (filters.projeto.length > 0) filteredData = filteredData.filter(row => filters.projeto.includes(row['Projeto Vinculado']));
            if (filters.programa.length > 0) filteredData = filteredData.filter(row => filters.programa.includes(row['Programa']));
            if (filters.categoria.length > 0) filteredData = filteredData.filter(row => filters.categoria.includes(row['Categoria']));
            
            if (filteredData.length === 0) {
                throw new Error("Nenhum dado encontrado para os filtros selecionados.");
            }
            
            const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            const anosUnicos = [...new Set(filteredData.map(r => parseYear(r['Ano'])))].filter(y => y > 0).sort();

            if (anosUnicos.length === 0) {
                throw new Error("Nenhum dado com ano válido encontrado para os filtros selecionados.");
            }

            const startYear = anosUnicos[0];
            
            let lastDataYear: number = 0;
            let lastDataMonthIndex: number = -1;

            filteredData.forEach(row => {
                // FIX: Add explicit type annotation to 'year' to prevent type inference issues.
                const year: number = parseYear(row['Ano']);
                if ((year as number) > 0) { // FIX: Add explicit cast to satisfy TS compiler for arithmetic operation
                    for (let i = meses.length - 1; i >= 0; i--) {
                        if (parseNumber(row[meses[i]]) !== 0) {
                            if (year > lastDataYear) {
                                lastDataYear = year;
                                lastDataMonthIndex = i;
                            } else if (year === lastDataYear && i > lastDataMonthIndex) {
                                lastDataMonthIndex = i;
                            }
                            break; 
                        }
                    }
                }
            });

            if (lastDataYear === 0) {
                lastDataYear = anosUnicos[anosUnicos.length - 1];
                lastDataMonthIndex = 11;
            }

            let lastRealizadoYear: number = 0;
            let lastRealizadoMonthIndex: number = -1;
            filteredData.forEach(row => {
                // FIX: Add explicit type annotation to 'year' to prevent type inference issues when used in comparisons.
                const year: number = parseYear(row['Ano']);
                const status = (row['Status'] || '').toString().trim().toLowerCase();
                if ((year as number) > 0 && status === 'realizado') {
                     for (let i = meses.length - 1; i >= 0; i--) {
                        if (Math.abs(parseNumber(row[meses[i]])) > 0) {
                            if (year > lastRealizadoYear) {
                                lastRealizadoYear = year;
                                lastRealizadoMonthIndex = i;
                            } else if (year === lastRealizadoYear && i > lastRealizadoMonthIndex) {
                                lastRealizadoMonthIndex = i;
                            }
                            break;
                        }
                    }
                }
            });
            
            const firstMonthOfStartYear = 0;
            const lastRealizadoTotalIndex = lastRealizadoYear > 0 ? (lastRealizadoYear - startYear) * 12 + (lastRealizadoMonthIndex - firstMonthOfStartYear) : -1;

            const labels: string[] = [];
            const allMonthlyData: { mesPrevisto: number, mesMudancas: number, mesCompromissado: number, mesRealizado: number }[] = [];

            for (let year = startYear; year <= lastDataYear; year++) {
                const startMonthIndex = (year === startYear) ? firstMonthOfStartYear : 0;
                const endMonthIndex = (year === lastDataYear) ? lastDataMonthIndex : 11;
                for (let monthIdx = startMonthIndex; monthIdx <= endMonthIndex; monthIdx++) {
                    const mes = meses[monthIdx];
                    labels.push(`${mes.substring(0,3)}/${year.toString().slice(2)}`);
                    
                    let mesPrevisto = 0, mesMudancas = 0, mesCompromissado = 0, mesRealizado = 0;
                    filteredData.filter(r => parseYear(r['Ano']) === year).forEach(row => {
                        const valor = parseNumber(row[mes]);
                        const status = (row['Status'] || '').toString().trim().toLowerCase();
                        if (status === 'previsto') mesPrevisto += valor;
                        else if (status === 'mudanças aprovadas' || status === 'mudança aprovada') mesMudancas += valor;
                        else if (status === 'compromissado') mesCompromissado += Math.abs(valor);
                        else if (status === 'realizado') mesRealizado += Math.abs(valor);
                    });
                    allMonthlyData.push({ mesPrevisto, mesMudancas, mesCompromissado, mesRealizado });
                }
            }
            
            const sCurveSeries: { [key: string]: (number | null)[] } = {
                'Previsto': [], 'Previsto + Mudanças Aprovadas': [], 'Compromissado': [], 'Realizado': [],
            };

            // FIX: Explicitly type accumulator variables as numbers to ensure correct type checking.
            let cumPrevisto: number = 0, cumMudancas: number = 0, cumCompromissado: number = 0, cumRealizado: number = 0;
            
            allMonthlyData.forEach(({ mesPrevisto, mesMudancas, mesCompromissado, mesRealizado }, index) => {
                cumRealizado += mesRealizado;
                cumPrevisto += mesPrevisto;
                cumMudancas += mesMudancas;
                cumCompromissado += (index <= lastRealizadoTotalIndex) ? 0 : mesCompromissado;

                sCurveSeries['Previsto'].push(cumPrevisto);
                sCurveSeries['Realizado'].push(cumRealizado);
                sCurveSeries['Compromissado'].push(cumRealizado + cumCompromissado);
                sCurveSeries['Previsto + Mudanças Aprovadas'].push(cumPrevisto + cumMudancas);
            });
            
            if (lastRealizadoTotalIndex > -1 && lastRealizadoTotalIndex < sCurveSeries['Realizado'].length - 1) {
                for (let i = lastRealizadoTotalIndex + 1; i < sCurveSeries['Realizado'].length; i++) {
                    sCurveSeries['Realizado'][i] = null;
                }
            }
            
            const statusOrder = ['Previsto', 'Mudança Aprovada', 'Realizado', 'Em Processamento', 'Compromissado', 'Risco', 'Saving Previsto'];
            const decompositionTotals: { [key: string]: number } = {};
            statusOrder.forEach(s => decompositionTotals[s] = 0);
            
            filteredData.forEach(row => {
                const statusRaw = (row['Status'] || '').toString().trim().toLowerCase();
                let statusKey: string | null = null;
                if (statusRaw === 'previsto') statusKey = 'Previsto';
                else if (statusRaw === 'mudanças aprovadas' || statusRaw === 'mudança aprovada') statusKey = 'Mudança Aprovada';
                else if (statusRaw === 'realizado') statusKey = 'Realizado';
                else if (statusRaw === 'em processamento') statusKey = 'Em Processamento';
                else if (statusRaw === 'compromissado') statusKey = 'Compromissado';
                else if (statusRaw === 'risco') statusKey = 'Risco';
                else if (statusRaw === 'saving previsto' || statusRaw === 'saving prev.') statusKey = 'Saving Previsto';
                
                if (statusKey) {
                    meses.forEach(mes => {
                        if(row[mes] !== undefined) {
                            // FIX: Deconstruct arithmetic operation to aid type inference and prevent errors.
                            const valueToAdd = (statusKey === 'Realizado' || statusKey === 'Compromissado') ? Math.abs(parseNumber(row[mes])) : parseNumber(row[mes]);
                            decompositionTotals[statusKey] = (decompositionTotals[statusKey] as number) + (valueToAdd as number); // FIX: Add explicit casts to satisfy TS compiler
                        }
                    });
                }
            });

            const decompositionLabels = statusOrder.filter(s => decompositionTotals[s] !== 0);
            const decompositionValues = decompositionLabels.map(s => decompositionTotals[s]);

            const realizedData = filteredData.filter(row => (row['Status'] || '').toString().trim().toLowerCase() === 'realizado');
            const projectTotals: { [key: string]: number } = {};
            realizedData.forEach(row => {
                const projectName = row['Projeto Vinculado'] || 'Não Especificado';
                // FIX: Explicitly type projectTotal to avoid inference issues.
                let projectTotal: number = 0;
                meses.forEach(mes => {
                    projectTotal += Math.abs(parseNumber(row[mes]));
                });
                projectTotals[projectName] = (projectTotals[projectName] || 0) + projectTotal;
            });

            const sortedProjects = Object.entries(projectTotals).sort(([, a], [, b]) => b - a);
            const realizedByProjectLabels = sortedProjects.map(([name]) => name);
            const realizedByProjectValues = sortedProjects.map(([, total]) => total);

            const categoryTotals: { [key: string]: number } = {};
            realizedData.forEach(row => {
                const categoryName = row['Categoria'] || 'Não Especificada';
                // FIX: Explicitly type categoryTotal to avoid inference issues.
                let categoryTotal: number = 0;
                meses.forEach(mes => {
                    categoryTotal += Math.abs(parseNumber(row[mes]));
                });
                categoryTotals[categoryName] = (categoryTotals[categoryName] || 0) + categoryTotal;
            });

            const sortedCategories = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);
            const realizedByCategoryLabels = sortedCategories.map(([name]) => name);
            const realizedByCategoryValues = sortedCategories.map(([, total]) => total);
            
            // Highlight 'Serviços' category
            const realizedByCategoryBackgroundColors = realizedByCategoryLabels.map(label =>
                label.toLowerCase() === 'serviços' ? '#3095A6' : '#587DBD'
            );
            const realizedByCategoryBorderColors = realizedByCategoryLabels.map(label =>
                label.toLowerCase() === 'serviços' ? '#247483' : '#4a69a1'
            );

            let realizedByContractData = null;
            if (filteredData.length > 0 && 'Contrato' in filteredData[0]) {
                const contractTotals: { [key: string]: number } = {};
                realizedData.forEach(row => {
                    const contractName = row['Contrato'] || 'Não Especificado';
                    // FIX: Explicitly type contractTotal to avoid inference issues.
                    let contractTotal: number = 0;
                    meses.forEach(mes => {
                        contractTotal += Math.abs(parseNumber(row[mes]));
                    });
                    contractTotals[contractName] = (contractTotals[contractName] || 0) + contractTotal;
                });

                const sortedContracts = Object.entries(contractTotals).sort(([, a], [, b]) => b - a);
                const realizedByContractLabels = sortedContracts.map(([name]) => name);
                const realizedByContractValues = sortedContracts.map(([, total]) => total);

                realizedByContractData = {
                    labels: realizedByContractLabels,
                    datasets: [{
                        label: 'Total Realizado',
                        data: realizedByContractValues,
                        backgroundColor: '#77B836',
                        borderColor: '#5a922a',
                        borderWidth: 1,
                    }]
                };
            }

            const newChartData = {
                sCurve: { labels, datasets: [
                        { label: 'Previsto', data: sCurveSeries['Previsto'], borderColor: 'grey', backgroundColor: 'grey', borderDash: [5, 5], fill: false, tension: 0.4, pointRadius: 0, borderWidth: 3 },
                        { label: 'Previsto + Mudanças', data: sCurveSeries['Previsto + Mudanças Aprovadas'], borderColor: '#62C0D3', backgroundColor: '#62C0D3', borderDash: [5, 5], fill: false, tension: 0.4, pointRadius: 0, borderWidth: 3 },
                        { label: 'Compromissado', data: sCurveSeries['Compromissado'], borderColor: 'orange', backgroundColor: 'orange', borderDash: [5, 5], fill: false, tension: 0.4, pointRadius: 0, borderWidth: 3 },
                        { label: 'Realizado', data: sCurveSeries['Realizado'], borderColor: 'orange', backgroundColor: 'orange', fill: false, tension: 0.4, pointRadius: 0, borderWidth: 4 },
                    ]},
                decomposition: { labels: decompositionLabels, datasets: [{
                        label: 'Decomposição por Status', data: decompositionValues,
                        backgroundColor: ['#0A3130', '#3095A6', '#F97316', '#FBBF24', '#EA580C', '#16A34A', '#A16207'],
                    }]},
                realizedByCategory: {
                    labels: realizedByCategoryLabels,
                    datasets: [{
                        label: 'Total Realizado',
                        data: realizedByCategoryValues,
                        backgroundColor: realizedByCategoryBackgroundColors,
                        borderColor: realizedByCategoryBorderColors,
                        borderWidth: 1,
                    }]
                },
                realizedByProject: {
                    labels: realizedByProjectLabels,
                    datasets: [{
                        label: 'Total Realizado',
                        data: realizedByProjectValues,
                        backgroundColor: '#498733',
                        borderColor: '#3a6b28',
                        borderWidth: 1,
                    }]
                },
                realizedByContract: realizedByContractData,
            };
            setChartData(newChartData);

            // AI Analysis
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const summaryForPrompt = JSON.stringify(decompositionTotals, (key, value) => (typeof value === 'number') ? formatCurrency(value) : value, 2);

            const prompt = `Você é um analista financeiro com foco em gestão de projetos. Com base nos dados abaixo, gere um relatório executivo que contenha:
1. Análise da execução orçamentária (valores previstos vs. realizados vs. comprometidos)
2. Tendência de execução mensal
3. Principais desvios e variações financeiras
4. Pontos de atenção e riscos futuros
5. Conclusão resumida com recomendação para gestores
Dados:
${summaryForPrompt}`;
            
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
            setAiAnalysis(response.text);

            const dataToSave = { fileName: file?.name, allData, filterOptions, filters, chartData: newChartData, aiAnalysis: response.text };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
            
            setMessage(null);
            hasGeneratedOnce.current = true;
        } catch (err: any) {
            console.error("Erro ao gerar dashboard:", err);
            setError(err.message || "Ocorreu um erro desconhecido.");
            setMessage(null);
        } finally {
            setIsLoading(false);
        }
    }, 100);
  }, [allData, filters, file?.name, filterOptions]);
  
  useEffect(() => {
    if (hasGeneratedOnce.current && allData.length > 0) {
      handleGenerateDashboard();
    }
  }, [filters, allData, handleGenerateDashboard]);

  const activeFilters = getActiveFilters();

  return (
    <main className="flex-grow bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 space-y-8">
        <BackButton fallback="/portfolio" />
        <header className="text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-2">Análise Financeira</h1>
          <p className="text-lg text-gray-600">Carregue sua planilha e gere o dashboard financeiro com análise de IA.</p>
        </header>

        <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1">
            <label htmlFor="file-upload" className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:brightness-110 transition-colors cursor-pointer">
              <UploadIcon className="h-6 w-6" />
              <span>{file ? "Trocar Planilha" : "Carregar Planilha"}</span>
            </label>
            <input id="file-upload" type="file" className="hidden" accept=".xlsx" onChange={handleFileChange} />
             {file && <p className="text-center text-sm text-gray-500 mt-2 truncate" title={file.name}>Planilha ativa: {file.name}</p>}
          </div>
          <div className="md:col-span-2">
            {isLoading && (
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-[#3095A6] h-1 rounded-full animate-pulse"></div>
              </div>
            )}
            {message && <p className="text-center text-gray-600 font-medium">{message}</p>}
          </div>
        </section>

        {filterOptions && (
          <section className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
              <MultiSelectDropdown
                  label="Anos"
                  options={filterOptions.anos}
                  selectedOptions={filters.ano}
                  onOptionClick={(option) => handleMultiSelectFilterChange('ano', option)}
              />
              <MultiSelectDropdown
                  label="Projetos"
                  options={filterOptions.projetos}
                  selectedOptions={filters.projeto}
                  onOptionClick={(option) => handleMultiSelectFilterChange('projeto', option)}
              />
              <MultiSelectDropdown
                  label="Programas"
                  options={filterOptions.programas}
                  selectedOptions={filters.programa}
                  onOptionClick={(option) => handleMultiSelectFilterChange('programa', option)}
              />
              <MultiSelectDropdown
                  label="Categorias"
                  options={filterOptions.categorias}
                  selectedOptions={filters.categoria}
                  onOptionClick={(option) => handleMultiSelectFilterChange('categoria', option)}
              />
            </div>
             {activeFilters.length > 0 && (
                <div className="pt-4 flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-semibold text-gray-600">Filtros Ativos:</span>
                    {activeFilters.map(({ type, value }) => (
                        <div key={`${type}-${value}`} className="flex items-center gap-1 bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                            <span>{value}</span>
                            <button onClick={() => removeFilter(type, value)} className="hover:text-red-600" title={`Remover filtro ${value}`}>
                                <XCircleIcon className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
          </section>
        )}
        
        <div className="flex justify-center">
             <button
              onClick={handleGenerateDashboard}
              disabled={!file || isLoading}
              className="inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ChartBarIcon className="h-6 w-6" />
              <span>Gerar Dashboard</span>
            </button>
        </div>
        
        {isLoading && !chartData && (
            <div className="text-center py-10">
                <RefreshCwIcon className="h-8 w-8 mx-auto animate-spin text-[#0A3130]" />
                <p className="mt-4 text-lg text-gray-700">{message}</p>
            </div>
        )}

        {error && (
             <div className="text-center py-10 bg-red-50 p-4 rounded-lg">
                <p className="text-red-700 font-bold">Ocorreu um erro:</p>
                <p className="text-red-600 mt-2">{error}</p>
            </div>
        )}

        {chartData && (
          <>
            <section className="space-y-8 pt-8 animate-fadeIn">
              <div className="bg-white p-4 rounded-lg shadow-md border min-h-[400px]">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                    <h3 className="text-xl font-bold text-gray-800">Curva S Financeira</h3>
                    <div className="flex items-center gap-2">
                        <label htmlFor="showValuesToggle" className="text-sm font-medium text-gray-700 select-none cursor-pointer">
                            Mostrar Valores
                        </label>
                        <button
                            id="showValuesToggle"
                            onClick={() => setShowPinnedValues(!showPinnedValues)}
                            className={`${
                                showPinnedValues ? 'bg-[#3095A6]' : 'bg-gray-300'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                        >
                            <span
                                className={`${
                                    showPinnedValues ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </button>
                    </div>
                </div>
                <div className="relative h-[400px] md:h-[500px]">
                  <SCurveChart data={chartData.sCurve} showPinnedValues={showPinnedValues} />
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white p-4 rounded-lg shadow-md border min-h-[400px]">
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Decomposição por Status</h3>
                    <div className="relative h-[400px] md:h-[500px]">
                      <DecompositionChart data={chartData.decomposition} />
                    </div>
                  </div>
                   <div className="bg-white p-4 rounded-lg shadow-md border min-h-[400px]">
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Decomposição Realizado por Categoria</h3>
                    <div className="relative h-[400px] md:h-[500px]">
                      <DecompositionChart data={chartData.realizedByCategory} />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md border min-h-[400px]">
                    <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Decomposição Realizado por Projeto</h3>
                    <div className="relative h-[400px] md:h-[500px]">
                      <ProjectDecompositionChart data={chartData.realizedByProject} />
                    </div>
                  </div>
                  {chartData.realizedByContract && (
                    <div className="bg-white p-4 rounded-lg shadow-md border min-h-[400px]">
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-4">Decomposição Realizado por Contrato</h3>
                        <div className="relative h-[400px] md:h-[500px]">
                            <ProjectDecompositionChart data={chartData.realizedByContract} />
                        </div>
                    </div>
                  )}
              </div>
            </section>
            <section className="mt-12 animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                    <SparklesIcon className="h-8 w-8 text-[#0A3130]" />
                    <h3 className="text-2xl font-bold text-gray-800">Análise Financeira por IA</h3>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 min-h-[200px]">
                    {isLoading && !aiAnalysis && (
                         <div className="flex items-center justify-center h-full">
                            <RefreshCwIcon className="h-6 w-6 animate-spin text-gray-600 mr-3" />
                            <span className="text-gray-700">A IA está analisando os dados...</span>
                        </div>
                    )}
                    {aiAnalysis && <AiAnalysisReport text={aiAnalysis} />}
                </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default FinancialAnalysisPage;