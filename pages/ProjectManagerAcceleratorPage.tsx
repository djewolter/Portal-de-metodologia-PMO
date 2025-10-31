













import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
// FIX: Import 'SparklesIcon' to resolve 'Cannot find name' errors.
import { DocumentIcon, UploadIcon, CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, RefreshCwIcon, DownloadIcon, RocketIcon, ClipboardListIcon, FileTextIcon, DocumentDuplicateIcon, VideoCameraIcon, PresentationChartLineIcon, PlusIcon, ArrowLeftIcon, SparklesIcon } from '../components/Icons';
import BackButton from '../components/BackButton';

// =================================================================================
// TYPE DEFINITIONS
// =================================================================================
type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';
type Evaluation = 'Conforme' | 'Parcialmente Alinhado' | 'Divergente';
interface GuidelineAnalysis { guidelineTitle: string; evaluation: Evaluation; justification: string; suggestion: string; }
interface AnalysisSummary { overallCompliance: string; criticalClauses: string[]; recommendation: string; }
interface AnalysisResult { analysis: GuidelineAnalysis[]; summary: AnalysisSummary; }
type MinutesGenerationStatus = 'idle' | 'loading' | 'success' | 'error';
interface Person { id: number; name: string; email: string; role: string; }
interface ActionItem { owner: string; task: string; deadline: string; }
interface GeneratedMinutes { title: string; date: string; location: string; participants: Person[]; absentees: Person[]; objective: string; agenda: string[]; discussions: string[]; risks: string[]; conclusion: string; actions: ActionItem[]; missingInfo?: string[]; }
type AcceleratorView = 'minutes' | 'contract' | 'commercial-proposal' | 'reimbursement-analysis';

interface ReimbursementAnalysisResult {
  parecerFinal: string;
  colaborador: string;
  periodo: string;
  resumoDespesas: {
    refeicoes: number;
    transporte: number;
    combustivel: number;
    hospedagem: number;
    outros: number;
    totalGeral: number;
  };
  pendencias: string[];
}

interface ReimbursementAnalysisAndChatPanelProps {
    result: ReimbursementAnalysisResult;
    onNewAnalysis: () => void;
    // Chat props
    chatHistory: { role: 'user' | 'model'; text: string }[];
    isChatLoading: boolean;
    chatInput: string;
    onChatInputChange: (value: string) => void;
    onSendMessage: (e: React.FormEvent) => void;
}


// New interfaces for the commercial proposal analyzer
interface CriterionAnalysis {
  criterion: string;
  score: number;
  justification: string;
}

interface CommercialProposalAnalysisResult {
  criteriaTable: CriterionAnalysis[];
  executiveSummary: string;
  improvementSuggestions: string;
  gapsForReview: string[];
}

type GeminiPart = { text: string } | { inlineData: { data: string; mimeType: string; } };

// =================================================================================
// HELPERS & CONSTANTS
// =================================================================================
const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};


const processSingleFileForGemini = async (file: File): Promise<GeminiPart[]> => {
    const parts: GeminiPart[] = [];
    const mimeType = file.type;
    const fileName = file.name;
    const isXlsx = mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || fileName.toLowerCase().endsWith('.xlsx');

    try {
        if (mimeType.startsWith('image/')) {
            const base64Data = await fileToBase64(file);
            parts.push({ inlineData: { data: base64Data, mimeType } });
        } else if (mimeType === 'application/pdf') {
            const arrayBuffer = await file.arrayBuffer();
            const typedArray = new Uint8Array(arrayBuffer);
            const pdf = await (window as any).pdfjsLib.getDocument(typedArray).promise;

            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const text = content.items.map((item: any) => item.str).join(' ');
                fullText += text + '\n\n';
            }
            parts.push({ text: `Texto extraído do PDF (${fileName}):\n${fullText}` });

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
                    parts.push({ inlineData: { data: base64Data, mimeType: 'image/jpeg' } });
                }
            }
        } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const arrayBuffer = await file.arrayBuffer();
            const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
            parts.push({ text: `Texto extraído do DOCX (${fileName}):\n${result.value}` });
        } else if (isXlsx) {
            if (typeof (window as any).XLSX === 'undefined') {
                throw new Error("A biblioteca XLSX não está carregada.");
            }
            const arrayBuffer = await file.arrayBuffer();
            const workbook = (window as any).XLSX.read(arrayBuffer, { type: 'array' });
            let textContent = `Conteúdo da planilha Excel (${fileName}):\n\n`;
            workbook.SheetNames.forEach((sheetName: string) => {
                const worksheet = workbook.Sheets[sheetName];
                const csvText = (window as any).XLSX.utils.sheet_to_csv(worksheet, { FS: ';' });
                textContent += `--- Aba: ${sheetName} ---\n${csvText}\n\n`;
            });
            parts.push({ text: textContent });
        } else if (mimeType === 'text/plain') {
            const text = await file.text();
            parts.push({ text: `Conteúdo do arquivo de texto (${fileName}):\n${text}` });
        } else {
           console.warn(`Tipo de arquivo não suportado para processamento direto: ${fileName} (${mimeType})`);
        }
    } catch (error) {
        console.error(`Erro ao processar o arquivo ${fileName}:`, error);
        // Retorna o texto de erro como uma parte para que a IA possa vê-lo
        parts.push({ text: `ERRO: Não foi possível processar o arquivo "${fileName}".` });
    }

    return parts;
};

const processFilesForGemini = async (files: File[]): Promise<GeminiPart[]> => {
    let allParts: GeminiPart[] = [];
    for (const file of files) {
        const isZip = file.type.includes('zip') || file.name.toLowerCase().endsWith('.zip');
        if (isZip) {
            if (typeof (window as any).JSZip === 'undefined') throw new Error("A biblioteca JSZip não está carregada.");
            const jszip = new (window as any).JSZip();
            const zip = await jszip.loadAsync(file);
            const filePromises: Promise<GeminiPart[]>[] = [];
            zip.forEach((relativePath, zipEntry) => {
                if (!zipEntry.dir) {
                    const promise = zipEntry.async('blob').then(blob => {
                        const recreatedFile = new File([blob], zipEntry.name, { type: blob.type });
                        return processSingleFileForGemini(recreatedFile);
                    });
                    filePromises.push(promise);
                }
            });
            const partsFromZip = await Promise.all(filePromises);
            allParts.push(...partsFromZip.flat());
        } else {
            const partsFromFile = await processSingleFileForGemini(file);
            allParts.push(...partsFromFile);
        }
    }
    return allParts;
};


const CONTRACT_GUIDELINES = [ { id: 'g1', title: 'Segurança da Informação', description: 'O contrato deve incluir cláusulas que garantam a segurança da informação, como criptografia, controle de acesso e auditoria.' }, { id: 'g2', title: 'LGPD e Privacidade de Dados', description: 'Deve haver menção explícita à conformidade com a LGPD, definindo papéis (controlador, operador) e responsabilidades.' }, { id: 'g3', title: 'SLA (Acordo de Nível de Serviço)', description: 'Deve definir claramente os níveis de serviço, incluindo tempo de resposta, tempo de resolução e disponibilidade.' }, { id: 'g4', title: 'Backup e Recuperação de Desastres', description: 'Exigência de políticas de backup e um plano de recuperação de desastres.' }, { id: 'g5', title: 'Continuidade do Negócio', description: 'Cláusulas que garantam a continuidade do serviço em caso de falhas.' }, { id: 'g6', title: 'Portabilidade de Dados', description: 'Direito de exportar todos os dados em formato legível ao término do contrato.' }, { id: 'g7', title: 'Propriedade Intelectual', description: 'Clareza sobre a propriedade de dados e customizações desenvolvidas.' }, { id: 'g8', title: 'Confidencialidade (NDA)', description: 'Obrigações de confidencialidade sobre as informações compartilhadas.' }, { id: 'g9', title: 'Responsabilidades das Partes', description: 'Definição clara das obrigações de cada parte.' }, { id: 'g10', title: 'Vigência e Rescisão', description: 'Regras claras para o prazo do contrato e as condições de rescisão.' }, { id: 'g11', title: 'Condições de Pagamento', description: 'Valores, moedas, e prazos de pagamento detalhados.' }, { id: 'g12', title: 'Multas e Penalidades', description: 'Penalidades por descumprimento de SLA ou outras obrigações.' }, { id: 'g13', title: 'Garantias e Suporte Técnico', description: 'Termos da garantia do serviço/produto e como o suporte é prestado.' }, { id: 'g14', title: 'Auditoria e Conformidade', description: 'Direito da Sipal de auditar a conformidade do fornecedor.' }, { id: 'g15', title: 'Limitação de Responsabilidade', description: 'Limites de responsabilidade financeira em caso de falhas.' }, { id: 'g16', title: 'Lei Aplicável e Foro', description: 'Definição da legislação e do foro para resolver disputas.' }, { id: 'g17', title: 'Notificações', description: 'Canais oficiais para notificações formais entre as partes.' }, { id: 'g18', title: 'Cessão do Contrato', description: 'Regras sobre a transferência do contrato para terceiros.' }, { id: 'g19', title: 'Reajuste de Preços', description: 'Índices e periodicidade para reajuste dos valores.' }, { id: 'g20', title: 'Acordo Integral', description: 'Cláusula que estabelece que o contrato substitui todos os acordos anteriores.' }, { id: 'g21', title: 'Subcontratação', description: 'Regras e necessidade de aprovação para subcontratação de serviços.' }, { id: 'g22', title: 'Proteção contra Malware e Vírus', description: 'Obrigação do fornecedor de manter as soluções livres de software malicioso.' }, ];
const navItems = [
    { id: 'minutes', title: 'Gerador de Ata', icon: ClipboardListIcon },
    { id: 'contract', title: 'Analisador de Contrato', icon: DocumentDuplicateIcon },
    { id: 'commercial-proposal', title: 'Analisador de Proposta Comercial', icon: PresentationChartLineIcon },
    { id: 'reimbursement-analysis', title: 'Analisador de Reembolso', icon: FileTextIcon },
];

// =================================================================================
// REUSABLE UI COMPONENTS
// =================================================================================
const UploadCard: React.FC<{ id: string; icon: React.FC<{ className?: string }>; title: string; description: string; file: File | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; acceptedFormats: string; required?: boolean; }> = ({ id, icon: Icon, title, description, file, onChange, acceptedFormats, required }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200/80 p-6 text-center flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="bg-[#e0f2fe] rounded-full p-3 mb-4">
        <Icon className="h-8 w-8 text-[#3095A6]" />
      </div>
      <h4 className="text-lg font-semibold text-gray-800">{title}{required && <span className="text-red-500">*</span>}</h4>
      <p className="text-sm text-gray-500 mt-1 mb-5 flex-grow">{description}</p>
      <label htmlFor={id} className="w-full mt-auto">
        <div className={`w-full p-3 rounded-lg border-2 border-dashed transition-all duration-300 cursor-pointer transform hover:scale-[1.03]
                        ring-offset-white focus-within:ring-2 focus-within:ring-[#3095A6]
                        ${file 
                          ? 'border-green-400 bg-green-50' 
                          : 'border-gray-300 bg-white hover:border-[#3095A6]'}`}>
          <span className={`text-sm truncate font-semibold ${file ? 'text-green-800' : 'text-gray-600'}`}>{file ? file.name : 'Clique para selecionar'}</span>
        </div>
      </label>
      <input id={id} type="file" className="hidden" onChange={onChange} accept={acceptedFormats} />
    </div>
);

const AcceleratorNav: React.FC<{ activeView: AcceleratorView; setActiveView: (view: AcceleratorView) => void; }> = ({ activeView, setActiveView }) => (
    <div className="border-b border-gray-200 bg-gray-50/80 backdrop-blur-sm">
        <nav className="flex justify-center flex-wrap gap-2 sm:gap-4 p-2" aria-label="Tabs">
            {navItems.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as AcceleratorView)}
                    className={`flex items-center gap-2 whitespace-nowrap py-3 px-4 sm:px-6 font-semibold text-sm rounded-lg transition-colors duration-200 ${
                        activeView === tab.id
                            ? 'bg-white text-[#0A3130] shadow-sm'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                    }`}
                >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.title}</span>
                </button>
            ))}
        </nav>
    </div>
);

// =================================================================================
// COMMERCIAL PROPOSAL ANALYZER COMPONENTS
// =================================================================================
const CommercialProposalResultsPanel: React.FC<{ result: CommercialProposalAnalysisResult; onReset: () => void; }> = ({ result, onReset }) => {
    return (
        <div className="animate-fadeIn text-left max-w-4xl mx-auto space-y-8">
            <header className="text-center">
                <h3 className="text-3xl font-bold text-gray-800">Análise da Proposta Comercial</h3>
                <p className="text-gray-600 mt-1">Relatório gerado por IA com base no documento fornecido.</p>
            </header>
            
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-xl font-bold text-gray-800 mb-3">📝 Parecer Executivo</h4>
                <p className="text-gray-700 leading-relaxed">{result.executiveSummary}</p>
            </div>
            
            <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">📊 Análise por Critério</h4>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 font-semibold text-left text-gray-700">Critério</th>
                                <th className="p-3 font-semibold text-center text-gray-700 w-24">Nota (0-5)</th>
                                <th className="p-3 font-semibold text-left text-gray-700">Justificativa</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* FIX: Add defensive check for array properties from AI response. */}
                            {(Array.isArray(result.criteriaTable) ? result.criteriaTable : []).map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="p-3 font-semibold text-gray-800">{item.criterion}</td>
                                    <td className="p-3 text-center font-bold text-lg" style={{ color: item.score >= 4 ? '#16A34A' : item.score >= 2 ? '#FBBF24' : '#EF4444' }}>{item.score}</td>
                                    <td className="p-3 text-gray-600 leading-normal">{item.justification}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {result.improvementSuggestions && (
                <div className="p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                    <h4 className="text-xl font-bold text-blue-800 mb-3">💡 Sugestões de Melhoria</h4>
                    <p className="text-blue-900 leading-relaxed whitespace-pre-wrap">{result.improvementSuggestions}</p>
                </div>
            )}
            
            {result.gapsForReview && result.gapsForReview.length > 0 && (
                <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <h4 className="text-xl font-bold text-yellow-800 mb-3">⚠️ Pontos a Revisar com o Fornecedor</h4>
                    <ul className="list-disc list-inside space-y-2 text-yellow-900">
                        {/* FIX: Add defensive check for array properties from AI response. */}
                        {(Array.isArray(result.gapsForReview) ? result.gapsForReview : []).map((gap, index) => (
                            <li key={index}>{gap}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div className="text-center pt-4">
                <button onClick={onReset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <RefreshCwIcon className="h-5 w-5" />
                    Analisar Outra Proposta
                </button>
            </div>
        </div>
    );
};


const CommercialProposalAnalyzer: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<AnalysisStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CommercialProposalAnalysisResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) {
            setFiles([]);
            return;
        }

        // FIX: Explicitly type 'newFiles' as 'File[]' to ensure correct type inference in loops and array methods.
        const newFiles: File[] = Array.from(selectedFiles);

        for (const file of newFiles) {
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/zip', 'application/x-zip-compressed'];
            const isZip = file.name.toLowerCase().endsWith('.zip');
            if (!allowedTypes.includes(file.type) && !isZip) {
                setError(`Formato de arquivo inválido: ${file.name}. Envie .pdf, .docx, .txt ou .zip.`);
                setFiles([]);
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError(`O arquivo ${file.name} é muito grande. O limite é 10MB.`);
                setFiles([]);
                return;
            }
        }
        
        if (newFiles.length > 1 && newFiles.some(f => f.type === 'application/zip' || f.type === 'application/x-zip-compressed' || f.name.toLowerCase().endsWith('.zip'))) {
            setError("Não é possível misturar arquivos .zip com outros arquivos. Envie apenas o .zip ou selecione múltiplos arquivos de outros tipos.");
            setFiles([]);
            return;
        }

        setFiles(newFiles);
        setStatus('idle');
        setError(null);
        setResult(null);
    };

    const handleReset = () => {
        setFiles([]);
        setStatus('idle');
        setError(null);
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (files.length === 0) return;
        setStatus('loading');
        setError(null);
        setResult(null);

        try {
            const fileParts = await processFilesForGemini(files);
            if (fileParts.length === 0) throw new Error("Não foi possível extrair conteúdo dos documentos. Verifique se os arquivos não estão vazios ou corrompidos.");

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
            Você é um especialista sênior em Tecnologia da Informação e Gestão de Projetos com experiência em RFI, RFP, propostas técnicas e avaliação de fornecedores. Sua tarefa é analisar a proposta técnica recebida para um produto/serviço de tecnologia e emitir um parecer detalhado, estruturado e pontuado. A proposta é fornecida como uma combinação de texto extraído e imagens de cada página. Você deve considerar AMBOS para sua análise, prestando atenção especial a tabelas, gráficos e leiautes nas imagens que podem não ser totalmente capturados no texto extraído.
 
            Critérios de Análise:
            1. Escopo e Objetivo: Está claro, completo e sem ambiguidades? Há exclusões de escopo bem definidas? Identificar termos vagos ou genéricos. Dê uma nota de 0 a 5 e uma justificativa.
            2. Solução Técnica / Arquitetura: A solução proposta é aderente às necessidades? Tecnologias e frameworks são atuais e suportados? Há integração clara com sistemas legados e APIs? Dê uma nota de 0 a 5 e uma justificativa.
            3. Cronograma e Entregáveis: Contém fases, marcos, entregáveis e dependências? Prazos são realistas frente à complexidade? Há riscos de atraso ou janelas mal definidas? Dê uma nota de 0 a 5 e uma justificativa.
            4. Equipe e Alocação de Recursos: Perfis e senioridades estão bem definidos? O tamanho da equipe é suficiente para atender o escopo? Alocação dedicada ou parcial? Dê uma nota de 0 a 5 e uma justificativa.
            5. Custos e Modelo Comercial: Custos estão claros (CAPEX/OPEX, licenças, suporte)? Há comparação de TCO (Total Cost of Ownership)? Termos de SLA e suporte foram detalhados? Dê uma nota de 0 a 5 e uma justificativa.
            6. Riscos, Premissas e Mitigações: Principais riscos foram mapeados? Premissas estão explícitas e realistas? Mitigações são adequadas? Dê uma nota de 0 a 5 e uma justificativa.
            7. Compliance e Segurança: Atende a requisitos de LGPD, ISO, auditoria? Existe plano de continuidade (BCP/DRP)? Controles de segurança (acessos, criptografia, logs) estão claros? Dê uma nota de 0 a 5 e uma justificativa.
            
            Resultado Esperado (formato JSON):
            - executiveSummary: Um parecer executivo (1 parágrafo) resumindo a avaliação.
            - criteriaTable: Uma lista de objetos, cada um com 'criterion' (string), 'score' (number de 0 a 5), e 'justification' (string).
            - improvementSuggestions: Uma string com sugestões de melhoria para pontos críticos.
            - gapsForReview: Uma lista de strings com os pontos que apresentam lacunas e precisam ser revisados pelo fornecedor.

            Analise o conteúdo a seguir:
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ text: prompt }, ...fileParts],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            executiveSummary: { type: Type.STRING, description: 'Um parecer executivo (1 parágrafo) resumindo a avaliação.' },
                            criteriaTable: {
                                type: Type.ARRAY,
                                description: 'Uma tabela/resumo com as notas (0 a 5) e justificativas por critério.',
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        criterion: { type: Type.STRING, description: 'O nome do critério de análise (ex: Escopo e Objetivo).' },
                                        score: { type: Type.NUMBER, description: 'A nota de 0 a 5 para o critério.' },
                                        justification: { type: Type.STRING, description: 'A justificativa para a nota atribuída.' }
                                    },
                                    required: ['criterion', 'score', 'justification']
                                }
                            },
                            improvementSuggestions: { type: Type.STRING, description: 'Sugestões de melhoria para pontos críticos da proposta.' },
                            gapsForReview: {
                                type: Type.ARRAY,
                                description: 'Uma lista de pontos que apresentam lacunas e precisam ser revisados pelo fornecedor.',
                                items: { type: Type.STRING }
                            }
                        },
                        required: ['executiveSummary', 'criteriaTable', 'improvementSuggestions', 'gapsForReview']
                    }
                }
            });

            const parsedResult = JSON.parse(response.text.trim());
            setResult(parsedResult);
            setStatus('success');

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocorreu um erro durante a análise. Tente novamente.");
            setStatus('error');
        }
    };

    if (status === 'success' && result) {
        return <CommercialProposalResultsPanel result={result} onReset={handleReset} />;
    }

    return (
        <div className="text-center">
            <PresentationChartLineIcon className="h-16 w-16 mx-auto text-[#0A3130]" />
            <h3 className="text-2xl font-bold text-gray-800 mt-4">Analisador de Proposta Comercial</h3>
            <p className="text-gray-600 mt-2 mb-6 mx-auto max-w-lg">Faça o upload de uma proposta técnica ou comercial (ou um arquivo .zip com múltiplos documentos) para receber uma análise detalhada, com notas, parecer executivo e pontos de melhoria.</p>

            <div className="max-w-md mx-auto">
                <label htmlFor="proposal-upload" className={`flex flex-col items-center justify-center w-full p-6 rounded-lg border-2 border-dashed  transition-colors cursor-pointer ${files.length > 0 ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                    <UploadIcon className={`h-10 w-10 mb-3 ${files.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-semibold ${files.length > 0 ? 'text-green-800' : 'text-gray-500'}`}>{files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : 'Clique para selecionar o(s) documento(s)'}</span>
                     <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT ou um único ZIP, até 10MB</p>
                </label>
                <input id="proposal-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.txt,.zip" multiple />
                {files.length > 0 && (
                    <div className="mt-2 text-left text-xs text-gray-600 w-full">
                        <ul className="list-disc list-inside">
                            {files.map(f => <li key={f.name} className="truncate" title={f.name}>{f.name}</li>)}
                        </ul>
                    </div>
                )}
            </div>
            
            {error && <p className="text-red-600 mt-4">{error}</p>}

            {status === 'loading' && (
                <div className="mt-6 flex items-center justify-center gap-3">
                    <RefreshCwIcon className="h-6 w-6 animate-spin text-gray-700" />
                    <span className="text-lg font-semibold text-gray-700">Analisando...</span>
                </div>
            )}

            {files.length > 0 && status !== 'loading' && (
                <button 
                    onClick={handleAnalyze} 
                    className="mt-6 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-110 transition-transform transform hover:scale-105"
                >
                    Analisar Proposta
                </button>
            )}
        </div>
    );
};


// =================================================================================
// CONTRACT ANALYZER COMPONENTS
// =================================================================================

const ContractResultsPanel: React.FC<{ result: AnalysisResult; onReset: () => void; onExport: () => void }> = ({ result, onReset, onExport }) => {
    const [openItem, setOpenItem] = useState<string | null>(null);
    const toggleItem = (title: string) => setOpenItem(openItem === title ? null : title);
    const getStatusIcon = (evaluation: Evaluation) => {
        const commonClasses = "h-7 w-7 rounded-full flex-shrink-0";
        switch (evaluation) {
            case 'Conforme': return <CheckCircleIcon className={`${commonClasses} text-green-500`} />;
            case 'Parcialmente Alinhado': return <ExclamationTriangleIcon className={`${commonClasses} text-yellow-500`} />;
            case 'Divergente': return <XCircleIcon className={`${commonClasses} text-red-500`} />;
        }
    };

    const pontosPositivos = result.analysis.filter(item => item.evaluation === 'Conforme');
    const pontosAtencao = result.analysis.filter(item => item.evaluation === 'Parcialmente Alinhado');
    const pontosNegativos = result.analysis.filter(item => item.evaluation === 'Divergente');

    return (
        <div id="print-section" className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Resultado da Análise</h2>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8 space-y-4 text-gray-800">
                <h3 className="text-xl font-bold">Resumo Geral</h3>
                <p><strong>Nível de Conformidade:</strong> <span className="font-semibold">{result.summary.overallCompliance}</span></p>
                <div>
                    <h4 className="font-semibold">Cláusulas Críticas para Revisão:</h4>
                    <ul className="list-disc list-inside">{result.summary.criticalClauses.map((clause, i) => <li key={i}>{clause}</li>)}</ul>
                </div>
                <div>
                    <h4 className="font-semibold">Recomendação Geral:</h4>
                    <p>{result.summary.recommendation}</p>
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Análise Detalhada por Diretriz</h3>
            <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin">
                {pontosPositivos.length > 0 && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">✅ Pontos Positivos</h3>
                        <div className="space-y-2">
                            {pontosPositivos.map((item) => (
                                <div key={item.guidelineTitle} className="border border-gray-200 rounded-lg bg-white">
                                    <button onClick={() => toggleItem(item.guidelineTitle)} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(item.evaluation)}
                                            <span className="font-semibold text-gray-800">{item.guidelineTitle}</span>
                                        </div>
                                        <span className="font-bold text-lg text-gray-400">{openItem === item.guidelineTitle ? '−' : '+'}</span>
                                    </button>
                                    {openItem === item.guidelineTitle && (
                                        <div className="p-3 border-t border-gray-200 bg-white text-sm text-gray-700 animate-fadeIn">
                                            <p><strong>Justificativa:</strong> {item.justification}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {pontosAtencao.length > 0 && (
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">⚠ Pontos de Atenção</h3>
                        <div className="space-y-2">
                            {pontosAtencao.map((item) => (
                                <div key={item.guidelineTitle} className="border border-gray-200 rounded-lg bg-white">
                                    <button onClick={() => toggleItem(item.guidelineTitle)} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(item.evaluation)}
                                            <span className="font-semibold text-gray-800">{item.guidelineTitle}</span>
                                        </div>
                                        <span className="font-bold text-lg text-gray-400">{openItem === item.guidelineTitle ? '−' : '+'}</span>
                                    </button>
                                    {openItem === item.guidelineTitle && (
                                        <div className="p-3 border-t border-gray-200 bg-white text-sm text-gray-700 animate-fadeIn">
                                            <p><strong>Justificativa:</strong> {item.justification}</p>
                                            <p className="mt-2"><strong>Sugestão:</strong> {item.suggestion}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {pontosNegativos.length > 0 && (
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">❌ Pontos Negativos</h3>
                        <div className="space-y-2">
                            {pontosNegativos.map((item) => (
                                <div key={item.guidelineTitle} className="border border-gray-200 rounded-lg bg-white">
                                    <button onClick={() => toggleItem(item.guidelineTitle)} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50">
                                        <div className="flex items-center gap-3">
                                            {getStatusIcon(item.evaluation)}
                                            <span className="font-semibold text-gray-800">{item.guidelineTitle}</span>
                                        </div>
                                        <span className="font-bold text-lg text-gray-400">{openItem === item.guidelineTitle ? '−' : '+'}</span>
                                    </button>
                                    {openItem === item.guidelineTitle && (
                                        <div className="p-3 border-t border-gray-200 bg-white text-sm text-gray-700 animate-fadeIn">
                                            <p><strong>Justificativa:</strong> {item.justification}</p>
                                            <p className="mt-2"><strong>Sugestão:</strong> {item.suggestion}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex justify-center gap-4 no-print">
                <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105">
                    <RefreshCwIcon className="h-5 w-5" />
                    Nova Análise
                </button>
                <button onClick={onExport} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white rounded-lg hover:brightness-110 transition-transform transform hover:scale-105">
                    <DownloadIcon className="h-5 w-5" />
                    Exportar Relatório
                </button>
            </div>
        </div>
    );
};

const ContractAnalyzer: React.FC = () => {
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<AnalysisStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (!selectedFiles || selectedFiles.length === 0) {
            setFiles([]);
            return;
        }

        // FIX: Explicitly type 'newFiles' as 'File[]' to ensure correct type inference in loops and array methods.
        const newFiles: File[] = Array.from(selectedFiles);

        for (const file of newFiles) {
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip', 'application/x-zip-compressed'];
            const isZip = file.name.toLowerCase().endsWith('.zip');
            if (!allowedTypes.includes(file.type) && !isZip) {
                setError("Formato de arquivo inválido. Por favor, envie .pdf, .docx ou .zip.");
                setFiles([]);
                return;
            }

            if (file.size > 10 * 1024 * 1024) { // 10 MB
                setError(`O arquivo ${file.name} é muito grande. O limite é 10MB.`);
                setFiles([]);
                return;
            }
        }
        
        if (newFiles.length > 1 && newFiles.some(f => f.type === 'application/zip' || f.type === 'application/x-zip-compressed' || f.name.toLowerCase().endsWith('.zip'))) {
            setError("Não é possível misturar arquivos .zip com outros arquivos. Envie apenas o .zip ou selecione múltiplos arquivos de outros tipos.");
            setFiles([]);
            return;
        }

        setFiles(newFiles);
        setStatus('idle');
        setError(null);
        setAnalysisResult(null);
    };

    const handleAnalysis = async () => {
        if (files.length === 0) return;
        setStatus('loading');
        setError(null);
        try {
            const fileParts = await processFilesForGemini(files);
            if (fileParts.length === 0) throw new Error("Não foi possível extrair conteúdo dos documentos. Verifique se os arquivos não estão vazios ou corrompidos.");

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const guidelinesText = CONTRACT_GUIDELINES.map(g => `${g.id}: ${g.title} - ${g.description}`).join('\n');
            const prompt = `Você é um especialista em análise de contratos de TI para a empresa Sipal. Analise o texto e as imagens das páginas do contrato a seguir, que está em português, com base nas 22 diretrizes corporativas listadas abaixo. A análise deve considerar tanto o texto extraído quanto o conteúdo visual das imagens, como tabelas, diagramas ou formatações especiais. Responda em formato JSON, seguindo o schema fornecido. Para cada diretriz, classifique a aderência do contrato como 'Conforme', 'Parcialmente Alinhado' ou 'Divergente'. Forneça uma justificativa clara para sua avaliação e uma sugestão de melhoria se a conformidade não for total. Ao final, gere um resumo com o nível geral de conformidade (Alto, Médio, Baixo), as 3 cláusulas mais críticas a serem ajustadas e uma recomendação geral.
      
              Diretrizes:
              ${guidelinesText}
        
              Analise o conteúdo a seguir:
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: [{ text: prompt }, ...fileParts],
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            analysis: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        guidelineTitle: { type: Type.STRING },
                                        evaluation: { type: Type.STRING },
                                        justification: { type: Type.STRING },
                                        suggestion: { type: Type.STRING },
                                    },
                                    required: ['guidelineTitle', 'evaluation', 'justification', 'suggestion']
                                },
                            },
                            summary: {
                                type: Type.OBJECT,
                                properties: {
                                    overallCompliance: { type: Type.STRING },
                                    criticalClauses: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    recommendation: { type: Type.STRING },
                                },
                                required: ['overallCompliance', 'criticalClauses', 'recommendation']
                            },
                        },
                        required: ['analysis', 'summary'],
                    },
                },
            });
            const resultText = response.text.trim();
            setAnalysisResult(JSON.parse(resultText));
            setStatus('success');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocorreu um erro durante a análise. Tente novamente.");
            setStatus('error');
        }
    };

    const handleReset = () => {
        setFiles([]);
        setStatus('idle');
        setError(null);
        setAnalysisResult(null);
    };

    const handleExportToDocx = () => {
        if (!analysisResult) return;
        if (typeof (window as any).htmlDocx === 'undefined' || typeof (window as any).saveAs !== 'function') {
            setError("Recurso de exportação indisponível. Verifique a conexão com a internet.");
            return;
        }

        const getEvalStyles = (evaluation: Evaluation) => {
            switch (evaluation) {
                case 'Conforme': return 'border-left: 5px solid #22C55E; background-color: #F0FDF4;';
                case 'Parcialmente Alinhado': return 'border-left: 5px solid #FBBF24; background-color: #FFFBEB;';
                case 'Divergente': return 'border-left: 5px solid #EF4444; background-color: #FEF2F2;';
                default: return 'border-left: 5px solid #E5E7EB; background-color: #F9FAFB;';
            }
        };

        const createAnalysisSection = (title: string, items: GuidelineAnalysis[], emoji: string) => {
            if (items.length === 0) return '';
            const itemsHtml = items.map(item => `
                <div style="margin-bottom: 10px; border: 1px solid #E5E7EB; padding: 10px; border-radius: 5px; ${getEvalStyles(item.evaluation)}">
                    <p style="font-weight: bold; font-size: 12pt; color: #111827; margin: 0 0 5px 0;">${item.guidelineTitle}</p>
                    <p style="margin: 0 0 5px 0;"><strong>Justificativa:</strong> ${item.justification}</p>
                    ${item.suggestion && item.evaluation !== 'Conforme' ? `<p style="margin: 0;"><strong>Sugestão:</strong> ${item.suggestion}</p>` : ''}
                </div>
            `).join('');
            return `<h3 style="color: #111827; font-size: 16pt; margin-top: 20px; margin-bottom: 10px;">${emoji} ${title}</h3>${itemsHtml}`;
        };

        const { analysis, summary } = analysisResult;
        const htmlContent = `
            <!DOCTYPE html><html><head><meta charset="UTF-8"></head>
            <body style="font-family: Calibri, sans-serif; font-size: 11pt; color: #333;">
                <h1 style="color: #1F2937; font-size: 24pt; text-align: center; border-bottom: 2px solid #0A3130; padding-bottom: 10px;">Resultado da Análise de Contrato</h1>
                <h2 style="color: #1F2937; font-size: 18pt; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px;">Resumo Geral</h2>
                <div style="background-color: #F9FAFB; border: 1px solid #E5E7EB; padding: 15px; margin-bottom: 20px; border-radius: 8px;">
                    <p><strong>Nível de Conformidade:</strong> ${summary.overallCompliance}</p>
                    <p><strong>Cláusulas Críticas para Revisão:</strong></p>
                    <ul style="margin-top: 5px; padding-left: 20px;">${summary.criticalClauses.map(clause => `<li>${clause}</li>`).join('')}</ul>
                    <p><strong>Recomendação Geral:</strong> ${summary.recommendation}</p>
                </div>
                <h2 style="color: #1F2937; font-size: 18pt; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-top: 25px;">Análise Detalhada por Diretriz</h2>
                ${createAnalysisSection('Pontos Positivos', analysis.filter(i => i.evaluation === 'Conforme'), '✅')}
                ${createAnalysisSection('Pontos de Atenção', analysis.filter(i => i.evaluation === 'Parcialmente Alinhado'), '⚠️')}
                ${createAnalysisSection('Pontos Negativos', analysis.filter(i => i.evaluation === 'Divergente'), '❌')}
            </body></html>`;

        try {
            const blob = (window as any).htmlDocx.asBlob(htmlContent);
            (window as any).saveAs(blob, 'Analise_Contrato_Sipal.docx');
        } catch (e) {
            console.error("Erro ao gerar DOCX:", e);
            setError("Ocorreu um erro ao tentar gerar o arquivo Word.");
        }
    };

    return (
        <>
            {status !== 'success' ? (
                <div className="text-center">
                    <DocumentDuplicateIcon className="h-16 w-16 mx-auto text-red-500" />
                    <h3 className="text-2xl font-bold text-gray-800 mt-4">Analisador de Contrato</h3>
                    <p className="text-gray-600 mt-2 mb-6 mx-auto max-w-md">Faça upload de um contrato (.pdf ou .docx) ou um arquivo .zip com múltiplos documentos para uma análise de conformidade com as diretrizes da Sipal.</p>
                    <div className="max-w-md mx-auto">
                        <label htmlFor="contract-upload" className={`flex flex-col items-center justify-center w-full p-6 rounded-lg border-2 border-dashed  transition-colors cursor-pointer ${files.length > 0 ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                            <UploadIcon className={`h-10 w-10 mb-3 ${files.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={`text-sm font-semibold ${files.length > 0 ? 'text-green-800' : 'text-gray-500'}`}>{files.length > 0 ? `${files.length} arquivo(s) selecionado(s)` : 'Clique para selecionar'}</span>
                             <p className="text-xs text-gray-400 mt-1">PDF, DOCX ou um único ZIP, até 10MB</p>
                        </label>
                        <input id="contract-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.zip" multiple />
                        {files.length > 0 && (
                            <div className="mt-2 text-left text-xs text-gray-600">
                                <ul className="list-disc list-inside">
                                    {files.map(f => <li key={f.name} className="truncate" title={f.name}>{f.name}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    {error && <p className="text-red-600 mt-4">{error}</p>}
                    {files.length > 0 && status !== 'loading' && (
                        <button onClick={handleAnalysis} className="mt-6 bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-red-700 transition-transform transform hover:scale-105">Analisar Contrato</button>
                    )}
                    {status === 'loading' && (
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <RefreshCwIcon className="h-6 w-6 animate-spin text-gray-700" />
                            <span className="text-lg font-semibold text-gray-700">Analisando...</span>
                        </div>
                    )}
                </div>
            ) : (
                analysisResult && <ContractResultsPanel result={analysisResult} onReset={handleReset} onExport={handleExportToDocx} />
            )}
        </>
    );
};

// =================================================================================
// MEETING MINUTES GENERATOR COMPONENTS
// =================================================================================
const PersonListEditor: React.FC<{
    title: string;
    list: Person[];
    setList: React.Dispatch<React.SetStateAction<Person[]>>;
}> = ({ title, list, setList }) => {

    const addPerson = () => {
        const newPerson: Person = { id: Date.now(), name: '', email: '', role: '' };
        setList(currentList => [...currentList, newPerson]);
    };

    const updatePerson = (id: number, field: keyof Omit<Person, 'id'>, value: string) => {
        setList(currentList => currentList.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const removePerson = (id: number) => {
        setList(currentList => currentList.filter(p => p.id !== id));
    };

    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-black mb-4">{title}</h3>
            <div className="space-y-3">
                {list.map((person) => (
                    <div key={person.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-white p-3 rounded-md shadow-sm border">
                        <input type="text" placeholder="Nome" value={person.name} onChange={(e) => updatePerson(person.id, 'name', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm text-black placeholder:text-black" />
                        <input type="email" placeholder="E-mail" value={person.email} onChange={(e) => updatePerson(person.id, 'email', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm text-black placeholder:text-black" />
                        <input type="text" placeholder="Área/Cargo" value={person.role} onChange={(e) => updatePerson(person.id, 'role', e.target.value)} className="w-full p-2 border border-gray-300 rounded-md text-sm text-black placeholder:text-black" />
                        <button onClick={() => removePerson(person.id)} className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-sm font-semibold">
                            <XCircleIcon className="h-4 w-4" />
                            <span>Remover</span>
                        </button>
                    </div>
                ))}
            </div>
            <button onClick={addPerson} className="mt-4 flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-md text-sm font-semibold">
                <PlusIcon className="h-4 w-4" />
                Adicionar {title === 'Participantes' ? 'Participante' : 'Ausente'}
            </button>
        </div>
    );
};

const ParticipantsEditor: React.FC<{
    participants: Person[];
    setParticipants: React.Dispatch<React.SetStateAction<Person[]>>;
    absentees: Person[];
    setAbsentees: React.Dispatch<React.SetStateAction<Person[]>>;
    onFinalize: () => void;
    onBack: () => void;
}> = ({ participants, setParticipants, absentees, setAbsentees, onFinalize, onBack }) => {
    return (
        <div className="animate-fadeIn w-full">
            <h2 className="text-2xl font-bold text-center mb-6 text-black">Passo 2: Preencher Participantes</h2>
            <div className="space-y-6">
                <PersonListEditor title="Participantes" list={participants} setList={setParticipants} />
                <PersonListEditor title="Ausentes" list={absentees} setList={setAbsentees} />
            </div>
            <div className="mt-8 flex justify-center flex-wrap gap-4">
                <button onClick={onBack} className="flex items-center gap-2 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-colors">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Recomeçar
                </button>
                <button onClick={onFinalize} className="flex items-center gap-2 px-6 py-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold rounded-lg shadow-md hover:brightness-110 transition-transform transform hover:scale-105">
                    Gerar Ata Final
                </button>
            </div>
        </div>
    );
};


const MeetingMinutesResultsPanel: React.FC<{ result: GeneratedMinutes; onReset: () => void; onExportDocx: () => void; }> = ({ result, onReset, onExportDocx }) => {
    return (
        <div className="animate-fadeIn">
            <div id="minutes-content-area" className="text-black max-h-[60vh] overflow-y-auto pr-3 scrollbar-thin">
                <header className="text-center border-b-2 border-gray-300 pb-4 mb-6">
                    <h2 className="text-2xl font-bold text-black">{result.title || "Ata de Reunião"}</h2>
                    <p className="text-md font-semibold text-black">{result.date}</p>
                    <p className="text-sm text-black">{result.location}</p>
                </header>
                
                {result.missingInfo && result.missingInfo.length > 0 && (
                     <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg mb-6">
                        <h4 className="font-bold">Aviso de Dados Incompletos:</h4>
                        <ul className="list-disc list-inside text-sm">
                            {/* FIX: Add defensive check for array properties from AI response. */}
                            {(Array.isArray(result.missingInfo) ? result.missingInfo : []).map((info, i) => <li key={i}>{info}</li>)}
                        </ul>
                    </div>
                )}

                <section className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2 text-black">1. Participantes</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm mt-2">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 font-semibold text-black">Nome</th>
                                        <th className="p-2 font-semibold text-black">E-mail</th>
                                        <th className="p-2 font-semibold text-black">Área/Cargo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* FIX: Add defensive check for array properties from AI response. */}
                                    {(Array.isArray(result.participants) ? result.participants : []).map((p, i) => (
                                        <tr key={`p-${p.id || i}`} className="border-b">
                                            <td className="p-2 text-black">{p.name}</td>
                                            <td className="p-2 text-black">{p.email}</td>
                                            <td className="p-2 text-black">{p.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* FIX: Add defensive check for array properties from AI response. */}
                        {(Array.isArray(result.absentees) ? result.absentees : []).length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold text-black">Ausentes:</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm mt-2">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="p-2 font-semibold text-black">Nome</th>
                                                <th className="p-2 font-semibold text-black">E-mail</th>
                                                <th className="p-2 font-semibold text-black">Área/Cargo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* FIX: Add defensive check for array properties from AI response. */}
                                            {(Array.isArray(result.absentees) ? result.absentees : []).map((p, i) => (
                                                <tr key={`a-${p.id || i}`} className="border-b">
                                                    <td className="p-2 text-black">{p.name}</td>
                                                    <td className="p-2 text-black">{p.email}</td>
                                                    <td className="p-2 text-black">{p.role}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                     <div>
                        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2 text-black">2. Objetivo da reunião</h3>
                        <p className="pl-4 text-black">{result.objective}</p>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2 text-black">3. Pauta ou Agenda</h3>
                        <ul className="list-disc list-inside pl-4 text-black">
                            {/* FIX: Add defensive check for array properties from AI response. */}
                            {(Array.isArray(result.agenda) ? result.agenda : []).map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2 text-black">4. Discussões e Deliberações</h3>
                        <ul className="list-disc list-inside pl-4 text-black">
                           {/* FIX: Add defensive check for array properties from AI response. */}
                           {(Array.isArray(result.discussions) ? result.discussions : []).map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </div>
                     <div>
                        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2 text-black">5. Encaminhamentos / Próximos Passos</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm mt-2 border-collapse border border-gray-300">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 font-semibold border border-gray-300 text-black">Ação</th>
                                        <th className="p-2 font-semibold border border-gray-300 text-black">Responsável</th>
                                        <th className="p-2 font-semibold border border-gray-300 text-black">Previsão</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* FIX: Add defensive check for array properties from AI response. */}
                                    {(Array.isArray(result.actions) ? result.actions : []).map((action, i) => (
                                        <tr key={i} className="hover:bg-gray-50">
                                            <td className="p-2 border border-gray-300 text-black">{action.task}</td>
                                            <td className="p-2 border border-gray-300 text-black">{action.owner}</td>
                                            <td className="p-2 border border-gray-300 text-black">{action.deadline}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2 text-black">6. Pontos de Atenção / Riscos</h3>
                        <ul className="list-disc list-inside pl-4 text-black">
                           {/* FIX: Add defensive check for array properties from AI response. */}
                           {(Array.isArray(result.risks) ? result.risks : []).map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold border-b border-gray-200 pb-1 mb-2 text-black">7. Conclusão / Encerramento</h3>
                        <p className="text-black">{result.conclusion}</p>
                    </div>
                </section>
            </div>
             <div className="mt-8 flex justify-center flex-wrap gap-4 no-print">
                <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105">
                    <RefreshCwIcon className="h-5 w-5" />
                    Gerar Nova Ata
                </button>
                 <button onClick={onExportDocx} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white rounded-lg hover:brightness-110 transition-transform transform hover:scale-105">
                    <DownloadIcon className="h-5 w-5" />
                    Exportar Ata (Word)
                </button>
            </div>
        </div>
    );
};

const MeetingMinutesGenerator: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [transcriptionFile, setTranscriptionFile] = useState<File | null>(null);
    const [presentationFile, setPresentationFile] = useState<File | null>(null);
    
    const [generationStatus, setGenerationStatus] = useState<MinutesGenerationStatus>('idle');
    const [currentStep, setCurrentStep] = useState<'upload' | 'participants' | 'results'>('upload');
    const [error, setError] = useState<string | null>(null);
    const [minutesResult, setMinutesResult] = useState<GeneratedMinutes | null>(null);
    const [participants, setParticipants] = useState<Person[]>([]);
    const [absentees, setAbsentees] = useState<Person[]>([]);

    const isGenerateEnabled = transcriptionFile && generationStatus !== 'loading';

    const handleFileChange = (setter: React.Dispatch<React.SetStateAction<File | null>>, acceptedTypes?: string[]) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
             if (acceptedTypes && !acceptedTypes.includes(file.type) && !acceptedTypes.some(t => file.name.endsWith(t))) {
                setError(`Tipo de arquivo inválido para este campo. Aceitos: ${acceptedTypes.join(', ')}`);
                e.target.value = '';
            } else {
                setter(file);
                setError(null);
            }
        }
    };

    const handleGenerate = async () => {
        if (!isGenerateEnabled) return;
        setGenerationStatus('loading');
        setError(null);
        setMinutesResult(null);

        try {
            const transcriptionText = await processSingleFileForGemini(transcriptionFile!).then(parts => parts.map(p => 'text' in p ? p.text : '').join('\n'));
            const videoFileName = videoFile?.name || 'Não fornecido';
            const presentationFileName = presentationFile?.name || 'Não fornecido';
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `
                Você é um assistente de PMO especialista em criar atas de reunião formais e objetivas para a empresa Sipal.

                Sua tarefa é gerar uma ata de reunião a partir dos seguintes materiais:
                1. Vídeo da Reunião (contexto): O nome do arquivo é '${videoFileName}'.
                2. Apresentação (estrutura): O nome do arquivo é '${presentationFileName}'.
                3. Transcrição (conteúdo): O conteúdo está abaixo.

                A ata deve ter uma linguagem executiva e objetiva.

                Extraia os nomes dos participantes e ausentes da transcrição. Se não conseguir identificar todos, deixe as listas incompletas. O usuário irá revisá-las e completá-las manualmente.

                Processe todo o conteúdo e gere um JSON VÁLIDO seguindo o schema fornecido.

                Transcrição da Reunião:
                ---
                ${transcriptionText.substring(0, 28000)}
                ---
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "O título da ata. Deve ser 'Ata de reunião'." },
                            date: { type: Type.STRING, description: "Data da reunião, ex: '06/03/2025'." },
                            location: { type: Type.STRING, description: "Local ou plataforma da reunião, ex: 'Agenda On line Microsoft Teams'." },
                             participants: {
                                type: Type.ARRAY,
                                description: "Lista de participantes presentes na reunião. Extraia nome, e-mail e cargo se possível.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        email: { type: Type.STRING },
                                        role: { type: Type.STRING }
                                    },
                                    required: ['name']
                                }
                            },
                            absentees: {
                                type: Type.ARRAY,
                                description: "Lista de participantes que estavam ausentes.",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        name: { type: Type.STRING },
                                        email: { type: Type.STRING },
                                        role: { type: Type.STRING }
                                    },
                                    required: ['name']
                                }
                            },
                            objective: { type: Type.STRING, description: "Seção 'Objetivo da reunião': Breve descrição sobre o propósito principal da reunião." },
                            agenda: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Seção 'Pauta ou Agenda': Lista de tópicos previamente definidos para discussão." },
                            discussions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Seção 'Discussões e Deliberações': Registro dos debates, decisões e consensos." },
                            risks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Seção 'Pontos de Atenção / Riscos': Pontos que devem ser monitorados." },
                            conclusion: { type: Type.STRING, description: "Seção 'Conclusão / Encerramento': Avaliação final, agradecimentos e fechamento da reunião." },
                            actions: {
                                type: Type.ARRAY,
                                description: "Seção 'Encaminhamentos / Próximos Passos'",
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        owner: { type: Type.STRING, description: "Nome do responsável (Responsável)." },
                                        task: { type: Type.STRING, description: "Descrição da tarefa (Ação)." },
                                        deadline: { type: Type.STRING, description: "Prazo para a conclusão (Previsão)." },
                                    },
                                    required: ['owner', 'task', 'deadline']
                                },
                            },
                            missingInfo: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Lista de informações importantes que não foram encontradas na transcrição." },
                        },
                        required: ['title', 'date', 'location', 'participants', 'absentees', 'objective', 'agenda', 'discussions', 'risks', 'conclusion', 'actions']
                    },
                },
            });

            const geminiOutput = JSON.parse(response.text.trim());
            const participantsWithIds = (geminiOutput.participants || []).map((p: any, index: number) => ({
                id: Date.now() + index,
                name: p.name || '',
                email: p.email || '',
                role: p.role || ''
            }));
            const absenteesWithIds = (geminiOutput.absentees || []).map((p: any, index: number) => ({
                id: Date.now() + 1000 + index, // avoid id collision
                name: p.name || '',
                email: p.email || '',
                role: p.role || ''
            }));

            const finalResult: GeneratedMinutes = {
                ...geminiOutput,
                participants: participantsWithIds,
                absentees: absenteesWithIds,
            };

            setMinutesResult(finalResult);
            setParticipants(participantsWithIds);
            setAbsentees(absenteesWithIds);
            setGenerationStatus('success');
            setCurrentStep('participants');
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocorreu um erro durante a geração da ata. Tente novamente.");
            setGenerationStatus('error');
        }
    };
    
    const handleReset = () => {
        setVideoFile(null);
        setTranscriptionFile(null);
        setPresentationFile(null);
        setGenerationStatus('idle');
        setCurrentStep('upload');
        setError(null);
        setMinutesResult(null);
        setParticipants([]);
        setAbsentees([]);
    };

    const handleFinalizeParticipants = () => {
        if (minutesResult) {
            const finalResultState = {
                ...minutesResult,
                participants: [...participants],
                absentees: [...absentees],
            };
            setMinutesResult(finalResultState);
            setCurrentStep('results');
        }
    };

    const exportToDocx = () => {
        if (typeof (window as any).htmlDocx === 'undefined' || typeof (window as any).saveAs !== 'function' || !minutesResult) {
            alert("A funcionalidade de exportação para DOCX não está disponível ou não há dados para exportar.");
            return;
        }

        const participantsRows = (minutesResult.participants || []).map(p => `<tr><td style="border: 1px solid black; padding: 5px;">${p.name || ''}</td><td style="border: 1px solid black; padding: 5px;">${p.email || ''}</td><td style="border: 1px solid black; padding: 5px;">${p.role || ''}</td></tr>`).join('') || '<tr><td colspan="3" style="border: 1px solid black; padding: 5px;">&nbsp;</td></tr>';
        const absenteesRows = (minutesResult.absentees || []).map(p => `<tr><td style="border: 1px solid black; padding: 5px;">${p.name || ''}</td><td style="border: 1px solid black; padding: 5px;">${p.email || ''}</td><td style="border: 1px solid black; padding: 5px;">${p.role || ''}</td></tr>`).join('') || '<tr><td colspan="3" style="border: 1px solid black; padding: 5px;">&nbsp;</td></tr>';
        const agendaList = (minutesResult.agenda || []).map(item => `<li>${item}</li>`).join('');
        const discussionsList = (minutesResult.discussions || []).map(item => `<li>${item}</li>`).join('');
        const risksList = (minutesResult.risks || []).map(item => `<li>${item}</li>`).join('');
        const actionsRows = (minutesResult.actions || []).map(act => `<tr><td style="border: 1px solid black; padding: 5px;">${act.task}</td><td style="border: 1px solid black; padding: 5px;">${act.owner}</td><td style="border: 1px solid black; padding: 5px;">${act.deadline}</td></tr>`).join('');

        const htmlString = `
            <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
            <style>
                body { font-family: Calibri, sans-serif; font-size: 11pt; color: #333; }
                table { border-collapse: collapse; width: 100%; }
                td, th { border: 1px solid black; padding: 5px; vertical-align: top; text-align: left; }
                .no-border, .no-border td, .no-border th { border: none; }
                .header-table { border: 2px solid black; margin-bottom: 14pt; }
                .header-table td { border: none; }
                .header-table .separator { border-right: 2px solid black; }
                .main-title { font-size: 16pt; font-weight: bold; }
                .logo { font-size: 28pt; font-weight: bold; text-align: center; vertical-align: middle; }
                .section-title { font-size: 11pt; font-weight: bold; margin-top: 14pt; margin-bottom: 7pt; }
                .table-header-gray { background-color: #D9D9D9; font-weight: bold; text-align: left; }
                ol, ul { padding-left: 20px; margin: 0; }
                li { margin-bottom: 4pt; }
                p { margin: 0; }
            </style>
            </head><body>
            <table class="header-table">
                <tr>
                    <td class="separator" style="width: 70%; padding: 10px; vertical-align: top;">
                        <div class="main-title">${minutesResult.title}</div>
                        <div style="margin-top: 20px;">PMO-IN-001</div>
                    </td>
                    <td style="width: 30%;" class="logo">SIPAL</td>
                </tr>
            </table>
            
            <table>
                <tr><td colspan="2" class="table-header-gray" style="text-align:center;">Ata de Reunião</td></tr>
                <tr><td style="width: 50%;"><strong>Data</strong><br/>${minutesResult.date}</td><td><strong>Local</strong><br/>${minutesResult.location}</td></tr>
            </table>
            
            <div class="section-title">1. Participantes</div>
            <table><thead><tr class="table-header-gray"><th>NOME</th><th>E-MAIL</th><th>ÁREA - CARGO</th></tr></thead><tbody>${participantsRows}</tbody></table>
            
            ${(minutesResult.absentees || []).length > 0 ? `<div class="section-title" style="font-weight: normal; margin-top: 5pt;">Ausentes</div><table><thead><tr class="table-header-gray"><th>NOME</th><th>E-MAIL</th><th>ÁREA - CARGO</th></tr></thead><tbody>${absenteesRows}</tbody></table>` : ''}

            <div class="section-title">2. Objetivo da reunião</div>
            <p>${minutesResult.objective}</p>
            
            <div class="section-title">3. Pauta ou Agenda</div>
            <ul>${agendaList}</ul>
            
            <div class="section-title">4. Discussões e Deliberações</div>
            <ul>${discussionsList}</ul>
            
            <div class="section-title">5. Encaminhamentos / Próximos Passos</div>
            <table><thead><tr class="table-header-gray"><th>Ação</th><th>Responsável</th><th>Previsão</th></tr></thead><tbody>${actionsRows}</tbody></table>
            
            <div class="section-title">6. Pontos de Atenção / Riscos</div>
            <ul>${risksList}</ul>
            
            <div class="section-title">7. Conclusão / Encerramento</div>
            <p>${minutesResult.conclusion}</p>
            
            <br/><br/>
            <table class="no-border">
                <tr>
                    <td style="width: 50%;">PMO Escritório de Projetos</td>
                    <td style="width: 50%; text-align: right;">PMO-IN-001</td>
                </tr>
            </table>
            </body></html>
        `;

        const dateParts = minutesResult.date.split('/');
        const formattedDate = `${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`;
        const fileName = `Ata_Reuniao_${formattedDate}.docx`;
        
        try {
            const fileBuffer = (window as any).htmlDocx.asBlob(htmlString);
            (window as any).saveAs(fileBuffer, fileName);
        } catch (error) {
            console.error("Erro ao tentar salvar o DOCX:", error);
            alert("Ocorreu um erro ao gerar o arquivo DOCX.");
        }
    };
    
    if (currentStep === 'results' && minutesResult) {
        return <MeetingMinutesResultsPanel result={minutesResult} onReset={handleReset} onExportDocx={exportToDocx} />;
    }

    if (currentStep === 'participants') {
        return <ParticipantsEditor
            participants={participants}
            setParticipants={setParticipants}
            absentees={absentees}
            setAbsentees={setAbsentees}
            onFinalize={handleFinalizeParticipants}
            onBack={handleReset}
        />;
    }

    return (
        <>
            <main className="flex-grow">
                <div className="w-full max-w-5xl mx-auto text-left space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <UploadCard 
                            id="transcription"
                            icon={DocumentIcon}
                            title="Transcrição"
                            description="Envie o arquivo .docx, .pdf, ou .txt"
                            file={transcriptionFile} 
                            onChange={handleFileChange(setTranscriptionFile, ['.pdf', '.docx', '.txt', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'])} 
                            required 
                            acceptedFormats={'.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'} 
                        />
                        <UploadCard
                            id="video"
                            icon={VideoCameraIcon}
                            title="Gravação da Reunião"
                            description="Envie a gravação em .mp4 (opcional)"
                            file={videoFile}
                            onChange={handleFileChange(setVideoFile, ['.mp4', 'video/mp4'])}
                            acceptedFormats={'.mp4,video/mp4'}
                        />
                        <UploadCard 
                            id="presentation" 
                            icon={PresentationChartLineIcon}
                            title="Apresentação"
                            description="Envie o arquivo .pptx (opcional)" 
                            file={presentationFile} 
                            onChange={handleFileChange(setPresentationFile, ['.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'])} 
                            acceptedFormats={'.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation'} 
                        />
                   </div>
                </div>
            </main>
            
            <footer className="text-center mt-8">
                {error && <p className="text-red-600 mb-4">{error}</p>}
                
                <button 
                    onClick={handleGenerate} 
                    disabled={!isGenerateEnabled}
                    className="w-full md:w-auto bg-[#3095A6] text-white px-8 py-3 text-base rounded-lg font-semibold shadow-md hover:brightness-110 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed"
                >
                    {generationStatus === 'loading' ? 'Gerando...' : 'Gerar Rascunho da Ata'}
                </button>
                 {generationStatus === 'loading' && (
                    <div className="mt-4 flex items-center justify-center gap-3">
                        <RefreshCwIcon className="h-6 w-6 animate-spin text-gray-700" />
                        <span className="text-lg font-semibold text-gray-700">A IA está trabalhando...</span>
                    </div>
                )}
            </footer>
        </>
    );
};

// =================================================================================
// REIMBURSEMENT ANALYZER COMPONENTS
// =================================================================================
const ReimbursementAnalysisAndChatPanel: React.FC<ReimbursementAnalysisAndChatPanelProps> = ({ result, onNewAnalysis, chatHistory, isChatLoading, chatInput, onChatInputChange, onSendMessage }) => {
    const chatBodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatHistory, isChatLoading]);

    return (
        <div className="animate-fadeIn text-left max-w-4xl mx-auto space-y-6 text-black">
            <header className="text-center mb-4">
                <h3 className="text-3xl font-bold text-black">Análise de Reembolso</h3>
                <p className="text-gray-600 mt-1">Relatório gerado por IA com base nos documentos fornecidos.</p>
            </header>

            <div className="p-6 rounded-lg bg-gray-100 border border-gray-200">
                <p className="text-black leading-relaxed"><strong>Parecer Final:</strong> {result.parecerFinal}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200"><strong>Colaborador:</strong> {result.colaborador}</div>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200"><strong>Período:</strong> {result.periodo}</div>
            </div>

            <div className="p-6 bg-gray-100 rounded-lg border border-gray-200">
                <h4 className="font-bold text-black mb-3 text-lg">Resumo de Despesas</h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                    <p>Refeições: {formatCurrency(result.resumoDespesas.refeicoes)}</p>
                    <p>Transporte: {formatCurrency(result.resumoDespesas.transporte)}</p>
                    <p>Combustível: {formatCurrency(result.resumoDespesas.combustivel)}</p>
                    <p>Hospedagem: {formatCurrency(result.resumoDespesas.hospedagem)}</p>
                    <p>Outros: {formatCurrency(result.resumoDespesas.outros)}</p>
                    <p className="font-bold text-right mt-2 text-base col-span-2">Total Geral: {formatCurrency(result.resumoDespesas.totalGeral)}</p>
                </div>
            </div>
            
            {result.pendencias && result.pendencias.length > 0 && (
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2 text-lg"><XCircleIcon className="h-6 w-6" /> Pendências de Notas Fiscais</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm pl-2 text-black">
                        {result.pendencias.map((pendencia, index) => (
                            <li key={index}>{pendencia}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            {/* Chat Section */}
            <div className="mt-8 pt-8 border-t border-gray-300">
                <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Falar com a IA</h4>
                <div className="bg-white border border-gray-200 rounded-lg p-4 h-96 flex flex-col shadow-inner">
                    <div ref={chatBodyRef} className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><SparklesIcon className="h-5 w-5 text-gray-600"/></div>}
                                <div className={`max-w-md p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-[#0A3130] text-white' : 'bg-gray-100 text-gray-800'}`}>
                                    <p className="whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                             <div className="flex items-start gap-3 justify-start">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"><SparklesIcon className="h-5 w-5 text-gray-600"/></div>
                                <div className="max-w-md p-3 rounded-lg shadow-sm bg-gray-100 text-gray-800">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <form onSubmit={onSendMessage} className="mt-4 flex gap-2 border-t pt-4">
                        <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => onChatInputChange(e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#3095A6]"
                            placeholder="Pergunte sobre os reembolsos..."
                            disabled={isChatLoading}
                        />
                        <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="px-5 py-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold rounded-lg shadow-md hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>

             <div className="text-center pt-6">
                <button onClick={onNewAnalysis} className="flex items-center gap-2 mx-auto px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <RefreshCwIcon className="h-5 w-5" />
                    Gerar Nova Análise
                </button>
            </div>
        </div>
    );
};

const ReimbursementAnalyzer: React.FC = () => {
    const [view, setView] = useState<'report' | 'upload' | 'loading'>('upload');
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<ReimbursementAnalysisResult | null>(null);
    // Chat state
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [chatSession, setChatSession] = useState<any | null>(null); // Gemini Chat session
    const [filePartsForChat, setFilePartsForChat] = useState<GeminiPart[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            const combinedFiles = [...files, ...newFiles];
            if (combinedFiles.length > 10) {
                setError("Você pode anexar no máximo 10 arquivos.");
                setFiles(combinedFiles.slice(0, 10));
            } else {
                setFiles(combinedFiles);
                setError(null);
            }
        }
    };
    
    const removeFile = (indexToRemove: number) => {
        setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
        if (files.length - 1 <= 10 && error?.includes("máximo 10 arquivos")) {
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (files.length === 0) {
            setError("Por favor, selecione um arquivo para análise.");
            return;
        }
        setError(null);
        setView('loading');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const fileParts = await processFilesForGemini(files);
            setFilePartsForChat(fileParts); // Save for chat context

            if (fileParts.length === 0) {
                throw new Error("Nenhum arquivo suportado foi encontrado nos anexos, ou os arquivos enviados não são suportados.");
            }

            const prompt = `
                Você é um analista financeiro meticuloso da empresa SIPAL, responsável por auditar relatórios de reembolso.
                Sua tarefa é analisar os documentos de reembolso fornecidos (que podem ser um compilado de imagens de recibos, planilhas, etc.) e verificar a conformidade com a Política de Despesas da SIPAL.

                **Contexto Importante:** Muitos colaboradores, ao gastarem acima do limite diário, reportam um valor fixo (ex: R$ 50,00) para evitar processos burocráticos, mesmo que o gasto real tenha sido maior. Isso é uma prática comum e aceita. Portanto, sua análise deve IGNORAR esses casos e focar APENAS em duas violações claras da política.

                **Política de Despesas da SIPAL (Foco da Análise):**
                1.  **Limite Diário de Alimentação:** Identifique APENAS os dias em que o gasto com alimentação ULTRAPASSOU R$ 100,00.
                2.  **Comprovantes de Despesas:** Identifique QUALQUER despesa (de qualquer categoria) que foi reportada no relatório mas NÃO possui um comprovante (nota fiscal ou recibo) correspondente nos documentos enviados.

                **Sua Análise deve incluir:**
                -   Identificação do colaborador e do período das despesas.
                -   Soma das despesas por categoria: refeicoes, transporte, combustivel, hospedagem, outros.
                -   Cálculo do total geral.
                -   Listagem de pendências EXCLUSIVAMENTE para os dois pontos acima (gastos acima de R$100 e despesas sem nota). Não liste outras observações.

                **Formato de Saída:**
                Responda APENAS com um objeto JSON válido, seguindo estritamente o schema abaixo. Seja conciso e direto nas descrições.
            `;
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    parecerFinal: { type: Type.STRING, description: "Um parágrafo com o parecer final sobre a análise. Mencione a conformidade geral e os principais problemas encontrados." },
                    colaborador: { type: Type.STRING, description: "Nome completo do colaborador." },
                    periodo: { type: Type.STRING, description: "Período das despesas no formato 'AAAA-MM-DD a AAAA-MM-DD'." },
                    resumoDespesas: {
                        type: Type.OBJECT,
                        properties: {
                            refeicoes: { type: Type.NUMBER, description: "Soma total das despesas com refeições." },
                            transporte: { type: Type.NUMBER, description: "Soma total das despesas com transporte." },
                            combustivel: { type: Type.NUMBER, description: "Soma total das despesas com combustível." },
                            hospedagem: { type: Type.NUMBER, description: "Soma total das despesas com hospedagem." },
                            outros: { type: Type.NUMBER, description: "Soma total de outras despesas." },
                            totalGeral: { type: Type.NUMBER, description: "Soma de todas as despesas." }
                        },
                        required: ["refeicoes", "transporte", "combustivel", "hospedagem", "outros", "totalGeral"]
                    },
                    pendencias: {
                        type: Type.ARRAY,
                        description: "Uma lista de strings descrevendo cada pendência encontrada.",
                        items: { type: Type.STRING, description: "Exemplo: '2025-08-19 - Taxi ou Uber (R$ 18,20): NF ausente'" }
                    }
                },
                required: ["parecerFinal", "colaborador", "periodo", "resumoDespesas", "pendencias"]
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [{ text: prompt }, ...fileParts] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: responseSchema,
                },
            });
            
            const parsedResult = JSON.parse(response.text.trim());
            setAnalysisResult(parsedResult);
            setView('report');

        } catch (err: any) {
            console.error("Gemini API Error or File Processing Error:", err);
            setError(err.message || "Ocorreu um erro ao processar os arquivos ou comunicar com a IA. Tente novamente.");
            setView('upload');
        }
    };

    const handleNewAnalysis = () => {
        setFiles([]);
        setError(null);
        setAnalysisResult(null);
        setView('upload');
        // Reset chat
        setChatHistory([]);
        setChatInput('');
        setIsChatLoading(false);
        setChatSession(null);
        setFilePartsForChat([]);
    };
    
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || isChatLoading) return;

        const userMessage = chatInput;
        setChatInput('');
        setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsChatLoading(true);

        try {
            let session = chatSession;
            if (!session) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const initialHistory = [
                    {
                        role: 'user',
                        parts: [
                            ...filePartsForChat,
                            { text: "Estes são os documentos para análise de reembolso. A análise inicial já foi feita e retornada em JSON. Agora, atue como um assistente para responder perguntas sobre estes documentos." }
                        ] as any
                    },
                    {
                        role: 'model',
                        parts: [{ text: "Entendido. Analisei os documentos de reembolso. Estou pronto para responder suas perguntas." }]
                    }
                ];
                session = ai.chats.create({ model: 'gemini-2.5-flash', history: initialHistory });
                setChatSession(session);
            }

            const result = await session.sendMessage(userMessage);
            setChatHistory(prev => [...prev, { role: 'model', text: result.text }]);
        } catch (err: any) {
            console.error("Chat Error:", err);
            setChatHistory(prev => [...prev, { role: 'model', text: "Desculpe, ocorreu um erro. Tente novamente." }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    switch (view) {
        case 'report':
            return analysisResult ? <ReimbursementAnalysisAndChatPanel 
                                        result={analysisResult} 
                                        onNewAnalysis={handleNewAnalysis}
                                        chatHistory={chatHistory}
                                        isChatLoading={isChatLoading}
                                        chatInput={chatInput}
                                        onChatInputChange={setChatInput}
                                        onSendMessage={handleSendMessage}
                                    /> : null;
        
        case 'loading':
            return (
                <div className="text-center animate-fadeIn flex flex-col items-center justify-center h-full min-h-[300px]">
                    <RefreshCwIcon className="h-10 w-10 animate-spin text-gray-700" />
                    <p className="text-lg font-semibold text-gray-700 mt-4">Analisando documentos...</p>
                    <p className="text-gray-500">A IA está verificando a conformidade e as pendências.</p>
                </div>
            );

        case 'upload':
            return (
                <div className="text-center animate-fadeIn max-w-lg mx-auto">
                    <FileTextIcon className="h-16 w-16 mx-auto text-[#0A3130]" />
                    <h3 className="text-2xl font-bold text-gray-800 mt-4">Gerar Nova Análise de Reembolso</h3>
                    <p className="text-gray-600 mt-2 mb-6">
                        Faça o upload do relatório de despesas e dos comprovantes (até 10 arquivos) para uma nova análise.
                    </p>
                    
                    <div className="max-w-md mx-auto">
                        <label htmlFor="reimbursement-upload" className={`flex flex-col items-center justify-center w-full p-6 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${files.length > 0 ? 'border-gray-400 bg-gray-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                            <UploadIcon className={`h-10 w-10 mb-3 ${files.length > 0 ? 'text-gray-600' : 'text-gray-400'}`} />
                            <span className={`text-sm font-semibold ${files.length > 0 ? 'text-gray-800' : 'text-gray-500'}`}>{files.length >= 10 ? 'Máximo de 10 arquivos' : 'Adicionar arquivos'}</span>
                            <p className="text-xs text-gray-400 mt-1">PDF, Imagens, XLSX ou ZIP</p>
                        </label>
                        <input id="reimbursement-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.zip,application/zip,application/x-zip-compressed,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" multiple disabled={files.length >= 10} />
                        
                         {files.length > 0 && (
                            <div className="mt-4 text-left text-sm">
                                <h4 className="font-semibold text-gray-700 mb-2">Arquivos selecionados ({files.length}/10):</h4>
                                <ul className="space-y-2">
                                    {files.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md border">
                                            <span className="truncate text-gray-800" title={file.name}>{file.name}</span>
                                            <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100" aria-label={`Remover ${file.name}`}>
                                                <XCircleIcon className="h-5 w-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    
                    {error && <p className="text-red-600 mt-4">{error}</p>}

                    <div className="mt-6 flex justify-center gap-4">
                        <button 
                            onClick={handleAnalyze} 
                            disabled={files.length === 0}
                            className="bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-110 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Analisar
                        </button>
                    </div>
                </div>
            );
    }
    return null;
};

// =================================================================================
// MAIN PAGE COMPONENT
// =================================================================================
const ProjectManagerAcceleratorPage: React.FC = () => {
    const [activeView, setActiveView] = useState<AcceleratorView>('reimbursement-analysis');

    const renderContent = () => {
        switch (activeView) {
            case 'minutes': return <MeetingMinutesGenerator />;
            case 'contract': return <ContractAnalyzer />;
            case 'commercial-proposal': return <CommercialProposalAnalyzer />;
            case 'reimbursement-analysis': return <ReimbursementAnalyzer />;
            default: return null;
        }
    };

    return (
        <main className="flex-grow bg-[#F4F6F8] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <BackButton />
                <header className="text-center my-8 animate-fadeIn">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <RocketIcon className="h-12 w-12 text-[#0A3130]" />
                        <div>
                            <h1 className="text-4xl font-extrabold text-[#0A3130]">Acelerador do Gerente de Projetos</h1>
                            <p className="text-lg text-gray-500 mt-1">Ferramentas com IA para automatizar tarefas e acelerar entregas.</p>
                        </div>
                    </div>
                </header>
                
                <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200">
                    <AcceleratorNav activeView={activeView} setActiveView={setActiveView} />
                    <div className="p-6 sm:p-8 animate-fadeIn min-h-[500px] flex flex-col justify-center">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProjectManagerAcceleratorPage;