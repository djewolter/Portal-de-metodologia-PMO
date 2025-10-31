import React, { useState } from 'react';
import { UploadIcon, DownloadIcon, RefreshCwIcon, ChartBarIcon } from '../components/Icons';
import BackButton from '../components/BackButton';

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

const FileInput: React.FC<{
  id: string;
  label: string;
  file: File | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  acceptedFormats: string;
}> = ({ id, label, file, onChange, required, acceptedFormats }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <label htmlFor={id} className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${file ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
      <UploadIcon className={`h-6 w-6 flex-shrink-0 ${file ? 'text-green-600' : 'text-gray-400'}`} />
      <span className={`text-sm truncate ${file ? 'text-green-800 font-semibold' : 'text-gray-500'}`}>{file ? file.name : 'Clique para selecionar o arquivo'}</span>
    </label>
    <input id={id} type="file" className="hidden" onChange={onChange} accept={acceptedFormats} />
  </div>
);

const ContractFinancialManagementPage: React.FC = () => {
    const [contractName, setContractName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalValue, setTotalValue] = useState<number | ''>('');
    const [financialFile, setFinancialFile] = useState<File | null>(null);
    const [generateSCurve, setGenerateSCurve] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const isFormValid = contractName && startDate && endDate && totalValue !== '' && financialFile;
    
    const readExcelFile = (file: File): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            if (typeof (window as any).XLSX === 'undefined') {
                return reject(new Error("A biblioteca XLSX não está carregada."));
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target?.result;
                    const workbook = (window as any).XLSX.read(data, { type: 'array' });
                    let allJsonData: any[] = [];
                    workbook.SheetNames.forEach((sheetName: string) => {
                      const worksheet = workbook.Sheets[sheetName];
                      allJsonData = allJsonData.concat((window as any).XLSX.utils.sheet_to_json(worksheet));
                    });
                    resolve(allJsonData);
                } catch (err) {
                    reject(new Error("Erro ao processar o arquivo Excel. Verifique se o formato está correto."));
                }
            };
            reader.onerror = () => reject(new Error("Não foi possível ler o arquivo."));
            reader.readAsArrayBuffer(file);
        });
    };

    const generateChartImage = async (data: any[]): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (typeof (window as any).Chart === 'undefined') {
                 return reject(new Error("A biblioteca Chart.js não está carregada."));
            }
            // Assume excel columns: 'Mês', 'Previsto', 'Realizado'
            const labels = data.map(row => row['Mês'] || '');
            const plannedRaw = data.map(row => parseNumber(row['Previsto']));
            const actualRaw = data.map(row => parseNumber(row['Realizado']));
            
            let cumulativePlanned = 0;
            const cumulativePlannedData = plannedRaw.map(val => {
                cumulativePlanned += val;
                return cumulativePlanned;
            });
            
            let cumulativeActual = 0;
            const cumulativeActualData = actualRaw.map(val => {
                cumulativeActual += val;
                return cumulativeActual;
            });

            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Não foi possível criar o contexto do canvas.');

            const chart = new (window as any).Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [
                        {
                            label: 'Previsto Acumulado',
                            data: cumulativePlannedData,
                            borderColor: 'grey',
                            backgroundColor: 'rgba(128, 128, 128, 0.1)',
                            fill: false,
                            tension: 0.1
                        },
                        {
                            label: 'Realizado Acumulado',
                            data: cumulativeActualData,
                            borderColor: '#3095A6',
                            backgroundColor: 'rgba(48, 149, 166, 0.1)',
                            fill: false,
                            tension: 0.1
                        }
                    ]
                },
                options: {
                    responsive: false,
                    animation: {
                       onComplete: () => {
                          resolve(chart.toBase64Image());
                          chart.destroy();
                       }
                    },
                    plugins: {
                        title: { display: true, text: 'Curva S Financeira do Contrato' },
                        legend: { position: 'top' }
                    },
                    scales: {
                        y: { ticks: { callback: (value: number) => `R$ ${value.toLocaleString('pt-BR')}` } }
                    }
                }
            });
             // Fallback in case onComplete doesn't fire (e.g., no animation)
             setTimeout(() => {
                try {
                    resolve(chart.toBase64Image());
                    chart.destroy();
                } catch(e) {
                    // might be already destroyed
                }
             }, 1000);
        });
    };
    
    const createHtmlTable = (data: any[]): string => {
        if (!data || data.length === 0) return '<p>Nenhum dado financeiro para exibir.</p>';
        const headers = Object.keys(data[0]);
        const headerRow = `<tr>${headers.map(h => `<th style="background-color: #f2f2f2; border: 1px solid #ddd; padding: 8px;">${h}</th>`).join('')}</tr>`;
        const bodyRows = data.map(row => `<tr>${headers.map(h => `<td style="border: 1px solid #ddd; padding: 8px;">${row[h] || ''}</td>`).join('')}</tr>`).join('');
        return `<table style="border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 10pt;"><thead>${headerRow}</thead><tbody>${bodyRows}</tbody></table>`;
    };

    const handleGenerateReport = async () => {
        if (!isFormValid) {
            setError('Todos os campos obrigatórios devem ser preenchidos.');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            const financialData = await readExcelFile(financialFile!);
            let chartImageHtml = '';
            if (generateSCurve) {
                try {
                    const chartBase64 = await generateChartImage(financialData);
                    chartImageHtml = `<p><img src="${chartBase64}" alt="Curva S Financeira" style="max-width: 100%; height: auto;"/></p>`;
                } catch (chartError: any) {
                    console.error("Chart generation failed:", chartError);
                    chartImageHtml = `<p style="color: red;"><strong>Erro ao gerar a Curva S:</strong> ${chartError.message}. Verifique se a planilha contém as colunas 'Mês', 'Previsto' e 'Realizado'.</p>`;
                }
            }

            const financialTableHtml = createHtmlTable(financialData);
            
            const formattedEndDate = new Date(`${endDate}T00:00:00Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
            const fileName = `Gestao_Financeira_${contractName.replace(/\s+/g, '_')}_${formattedEndDate}.docx`;

            const htmlContent = `
                <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
                <body style="font-family: Calibri, sans-serif; font-size: 11pt;">
                    <h1 style="color: #2E74B5;">Relatório de Gestão Financeira de Contrato</h1>
                    <p><strong>Contrato:</strong> ${contractName}</p>
                    <p><strong>Período:</strong> ${new Date(`${startDate}T00:00:00Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} a ${new Date(`${endDate}T00:00:00Z`).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                    <p><strong>Valor Total:</strong> ${Number(totalValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                    <br/>
                    ${generateSCurve ? `<h2>Curva S Financeira</h2>${chartImageHtml}<br/>` : ''}
                    <h2>Dados Financeiros</h2>
                    ${financialTableHtml}
                </body></html>
            `;

            if (typeof (window as any).htmlDocx === 'undefined' || typeof (window as any).saveAs !== 'function') {
                throw new Error("Bibliotecas de exportação (html-docx-js, FileSaver.js) não foram encontradas.");
            }
            
            const blob = (window as any).htmlDocx.asBlob(htmlContent);
            (window as any).saveAs(blob, fileName);

        } catch (e: any) {
            setError(e.message || "Falha ao gerar o relatório. Verifique o console para mais detalhes.");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <main className="flex-grow bg-gray-100 py-12 px-4">
      <div className="container mx-auto">
        <BackButton />
        <header className="text-center mb-10 animate-fadeIn">
            <ChartBarIcon className="h-16 w-16 mx-auto text-[#0A3130]" />
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3130] mt-4 mb-3">
                Gestão Financeira de Contrato
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Gerencie a execução financeira de contratos com base em dados de pagamento, previsão, comprometimento e saldo. Gere relatórios automáticos e análises mensais.
            </p>
        </header>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                  <label htmlFor="contractName" className="block text-sm font-medium text-gray-700">Nome do Contrato <span className="text-red-500">*</span></label>
                  <input type="text" id="contractName" value={contractName} onChange={e => setContractName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black" placeholder="Ex: Contrato de Licenciamento de Software" />
              </div>
              <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início <span className="text-red-500">*</span></label>
                  <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black" />
              </div>
              <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Término <span className="text-red-500">*</span></label>
                  <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black" />
              </div>
              <div className="md:col-span-2">
                  <label htmlFor="totalValue" className="block text-sm font-medium text-gray-700">Valor Total do Contrato (R$) <span className="text-red-500">*</span></label>
                  <input type="number" id="totalValue" value={totalValue} onChange={e => setTotalValue(e.target.value === '' ? '' : parseFloat(e.target.value))} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm text-black" placeholder="Ex: 50000.00" />
              </div>
          </div>
          <FileInput
            id="financial-file"
            label="Planilha Financeira (com colunas 'Mês', 'Previsto', 'Realizado')"
            file={financialFile}
            onChange={(e) => setFinancialFile(e.target.files?.[0] || null)}
            required
            acceptedFormats=".xlsx,.csv"
          />
          <div className="flex items-center gap-3">
            <input type="checkbox" id="generate-s-curve" checked={generateSCurve} onChange={e => setGenerateSCurve(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#0A3130] focus:ring-[#3095A6]" />
            <label htmlFor="generate-s-curve" className="text-sm font-medium text-gray-700">Gerar Curva S Financeira automaticamente</label>
          </div>
          
          {error && <p className="text-red-600 text-center">{error}</p>}

          <div className="text-center pt-4">
              <button
                  onClick={handleGenerateReport}
                  disabled={!isFormValid || isLoading}
                  className="inline-flex items-center justify-center gap-3 w-full md:w-auto px-8 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                  {isLoading ? <RefreshCwIcon className="h-6 w-6 animate-spin" /> : <DownloadIcon className="h-6 w-6" />}
                  {isLoading ? 'Gerando Relatório...' : 'Gerar Relatório Financeiro'}
              </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContractFinancialManagementPage;