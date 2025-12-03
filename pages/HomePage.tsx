

import React, { useState } from 'react';
// FIX: Use named imports for react-router-dom to address module resolution issues.
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  DocumentIcon,
  AcademicCapIcon,
  PresentationChartLineIcon,
  RocketIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  EyeIcon,
  EyeSlashIcon,
  SparklesIcon,
  UploadIcon,
  XCircleIcon,
  RefreshCwIcon,
} from '../components/Icons';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import searchableData from '../data/searchData';
import { SearchableItem } from '../types';
import Modal from '../components/Modal';
import { GoogleGenAI } from '@google/genai';

type GeminiPart = { text: string } | { inlineData: { data: string; mimeType: string; } };

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
          fullText += content.items.map((item: any) => item.str).join(' ');
        }
        parts.push({ text: `Conteúdo do PDF (${fileName}):\n${fullText}` });
      } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
        parts.push({ text: `Conteúdo do DOCX (${fileName}):\n${result.value}` });
      } else if (mimeType === 'text/plain') {
        const text = await file.text();
        parts.push({ text: `Conteúdo do TXT (${fileName}):\n${text}` });
      } else {
        parts.push({ text: `AVISO: Arquivo "${fileName}" com formato não suportado para extração de conteúdo. A análise considerará apenas o nome do arquivo.` });
      }
    } catch (error) {
      console.error(`Erro ao processar o arquivo ${fileName}:`, error);
      parts.push({ text: `ERRO: Não foi possível processar o conteúdo do arquivo "${fileName}".` });
    }
    return parts;
};

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');
    const elements = [];
    let listItems: string[] = [];

    const flushList = () => {
        if (listItems.length > 0) {
            elements.push(
                <ul key={`ul-${elements.length}`} className="list-disc pl-6 space-y-1 my-2">
                    {listItems.map((item, idx) => <li key={idx}>{item}</li>)}
                </ul>
            );
            listItems = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('### ')) {
            flushList();
            elements.push(<h3 key={i} className="text-xl font-bold text-gray-800 mt-5 mb-2">{line.substring(4)}</h3>);
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            listItems.push(line.substring(2));
        } else {
            flushList();
            if (line.trim() !== '') {
                elements.push(<p key={i} className="my-2 text-gray-700 leading-relaxed">{line}</p>);
            }
        }
    }
    flushList(); // Make sure the last list is rendered

    return <div className="prose max-w-none text-left">{elements}</div>;
};


export const HomePage: React.FC = () => {
  const cardItems = [
    {
      title: 'Metodologia de Projetos',
      path: '/metodologia',
      icon: <BookOpenIcon className="h-14 w-14 text-[#0A3130]" />,
    },
    {
      title: 'Templates e Documentos',
      path: '/templates',
      icon: <DocumentIcon className="h-14 w-14 text-[#0A3130]" />,
    },
    {
      title: 'Onboarding para Gerentes',
      path: '/onboarding-gerentes',
      icon: <AcademicCapIcon className="h-14 w-14 text-[#0A3130]" />,
    },
    {
      title: 'Portfólio de Projetos',
      path: '/portfolio',
      icon: <PresentationChartLineIcon className="h-14 w-14 text-[#0A3130]" />,
      isProtected: true,
    },
    {
      title: 'Acelerador Gerente de Projetos',
      path: '/acelerador-gerente',
      icon: <RocketIcon className="h-14 w-14 text-[#0A3130]" />,
    },
    {
      title: 'Cronograma do Portal',
      path: '/cronograma-portal',
      icon: <CalendarDaysIcon className="h-14 w-14 text-[#0A3130]" />,
      isProtected: true,
    },
    {
      title: 'Sugestão de Melhoria',
      icon: <SparklesIcon className="h-14 w-14 text-[#0A3130]" />,
      onClick: () => setIsSuggestionModalOpen(true),
    },
    {
      title: 'Gestão Financeira de Contrato',
      path: '/gestao-financeira-contrato',
      icon: <ChartBarIcon className="h-14 w-14 text-[#0A3130]" />,
      isProtected: true,
    },
  ];

  const [results, setResults] = useState<SearchableItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isConstructionModalOpen, setIsConstructionModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // State for Suggestion Modal
  const [isSuggestionModalOpen, setIsSuggestionModalOpen] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionFile, setSuggestionFile] = useState<File | null>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [suggestionResult, setSuggestionResult] = useState('');
  const [suggestionError, setSuggestionError] = useState('');

  const handleSearch = (query: string) => {
    setHasSearched(true);
    if (!query.trim()) {
        setResults([]);
        return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filteredData = searchableData.filter(item =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery)
    );
    setResults(filteredData);
  };

  const handleProtectedCardClick = (path: string) => {
    setTargetPath(path);
    setPasswordInput('');
    setPasswordError('');
    setShowPassword(false);
    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (passwordInput === 'M3TODOL@GIA_PMO') {
          if (targetPath) {
              navigate(targetPath);
          }
          setIsPasswordModalOpen(false);
      } else {
          setPasswordError('Senha incorreta. Acesso negado.');
      }
  };
  
  const resetSuggestionModal = () => {
    setSuggestionText('');
    setSuggestionFile(null);
    setSuggestionLoading(false);
    setSuggestionResult('');
    setSuggestionError('');
  };
  
  const handleGenerateSuggestion = async () => {
    if (!suggestionText.trim()) {
        setSuggestionError('Por favor, descreva sua sugestão ou problema.');
        return;
    }
    setSuggestionLoading(true);
    setSuggestionError('');
    setSuggestionResult('');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const promptParts: GeminiPart[] = [];
        
        const fullPrompt = `Você é um consultor especialista em otimização de processos e gestão de projetos. Sua tarefa é analisar a descrição fornecida pelo usuário e, se houver, o conteúdo do documento anexado, para gerar uma sugestão de melhoria estruturada.

Sua resposta DEVE seguir estritamente o seguinte formato em Markdown:

### 1. Cenário Atual
(Resuma o problema ou processo descrito pelo usuário em 1-2 frases.)

### 2. Pontos de Dor Identificados
(Liste em formato de tópicos os principais problemas ou ineficiências que você identificou.)

### 3. Proposta de Melhoria
(Descreva sua sugestão de forma clara e detalhada. Explique o que deve ser feito e por quê.)

### 4. Plano de Ação Sugerido
(Apresente um plano de ação simples, com 3 a 5 passos, para implementar a melhoria.)

### 5. Indicadores de Sucesso
(Liste 2 a 3 métricas que podem ser usadas para medir o sucesso da implementação da melhoria.)

---
Analise o conteúdo a seguir, que inclui a descrição do usuário e o conteúdo de um arquivo anexado (se houver):
`;
        
        promptParts.push({ text: fullPrompt });
        promptParts.push({ text: `Descrição do usuário: "${suggestionText}"` });

        if (suggestionFile) {
            const fileParts = await processSingleFileForGemini(suggestionFile);
            promptParts.push(...fileParts);
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: promptParts }
        });

        setSuggestionResult(response.text);
    } catch (err: any) {
        console.error(err);
        setSuggestionError(err.message || 'Ocorreu um erro ao gerar a sugestão. Tente novamente.');
    } finally {
        setSuggestionLoading(false);
    }
  };

  return (
    <main className="flex-grow bg-gradient-to-br from-gray-100 via-white to-[#3095A6]/10 py-12 md:py-16">
      {/* Welcome & Search Block */}
      <div className="max-w-7xl mx-auto px-6 animate-fadeIn">
        <div className="bg-white/90 backdrop-blur-lg shadow-lg border border-gray-200 rounded-2xl p-10 md:p-12 text-center">
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A3130] mb-8">
            Bem-vindo ao Escritório de Projetos da Sipal
          </h1>
          <div className="max-w-3xl mx-auto mb-10">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Search Results Section */}
          {hasSearched && (
            <div className="max-w-4xl mx-auto mb-12 animate-fadeIn text-left">
              <SearchResults results={results} hasSearched={hasSearched} />
            </div>
          )}
          
          {/* Objective and Mission */}
          <div className="max-w-5xl mx-auto text-left space-y-10">
             <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <h2 className="text-2xl font-bold text-[#0A3130] mb-3 border-l-4 border-[#3095A6] pl-4">Objetivo do Escritório de Projetos</h2>
                <p className="text-gray-700 leading-relaxed pl-4">
                  Garantir a governança, o alinhamento e a excelência na execução de todos os projetos do Grupo Sipal, promovendo entregas dentro do prazo, do orçamento e com a qualidade requerida, de modo a maximizar o valor gerado para o negócio e para os nossos clientes.
                </p>
              </div>
              <div className="animate-fadeIn" style={{ animationDelay: '200ms' }}>
                <h2 className="text-2xl font-bold text-[#0A3130] mb-3 border-l-4 border-[#3095A6] pl-4">Missão do Escritório de Projetos</h2>
                <p className="text-gray-700 leading-relaxed pl-4">
                  Estabelecer e disseminar metodologias, padrões e boas práticas de gerenciamento de projetos; apoiar as equipes com ferramentas, capacitações e monitoramento contínuo; favorecer a tomada de decisões baseada em dados e riscos bem mapeados; e fomentar uma cultura colaborativa, ágil e orientada a resultados que impulsione o crescimento sustentável do Grupo Sipal.
                </p>
              </div>
          </div>

        </div>
      </div>
      
      {/* Access Cards Menu */}
      <div className="max-w-7xl mx-auto p-6 mt-16 animate-fadeIn" style={{ animationDelay: '300ms' }}>
        <h2 className="text-3xl font-bold text-center text-[#0A3130] mb-10">Acessos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardItems.map((item: {title: string, path?: string, icon: React.ReactNode, isProtected?: boolean, onClick?: () => void}) => {
            const cardClassName = "bg-white/90 backdrop-blur-lg shadow-lg border border-gray-200 rounded-2xl p-6 text-center transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-xl flex flex-col items-center justify-center space-y-4 min-h-[180px]";
            
            if (item.onClick) {
              return (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  className={cardClassName}
                >
                  {item.icon}
                  <h3 className="text-xl font-semibold text-[#0A3130]">
                    {item.title}
                  </h3>
                </button>
              );
            }

            if (item.path && item.isProtected) {
              return (
                <button
                  key={item.title}
                  onClick={() => handleProtectedCardClick(item.path!)}
                  className={cardClassName}
                >
                  {item.icon}
                  <h3 className="text-xl font-semibold text-[#0A3130]">
                    {item.title}
                  </h3>
                </button>
              );
            }

            if (item.path) {
              return (
                <Link
                  key={item.title}
                  to={item.path}
                  className={cardClassName}
                >
                  {item.icon}
                  <h3 className="text-xl font-semibold text-[#0A3130]">
                    {item.title}
                  </h3>
                </Link>
              );
            }
            
            return (
              <button
                key={item.title}
                onClick={() => setIsConstructionModalOpen(true)}
                className={cardClassName}
              >
                {item.icon}
                <h3 className="text-xl font-semibold text-[#0A3130]">
                  {item.title}
                </h3>
              </button>
            );
          })}
        </div>
      </div>

      <Modal isOpen={isConstructionModalOpen} onClose={() => setIsConstructionModalOpen(false)}>
        <div className="text-center p-4">
            <h2 className="text-2xl font-bold text-[#0A3130] mb-4">Página em Construção</h2>
            <p className="text-gray-700 mb-6 text-lg">
              Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
            </p>
            <button
                onClick={() => setIsConstructionModalOpen(false)}
                className="bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:brightness-110"
            >
                Entendi
            </button>
        </div>
      </Modal>

      <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)}>
        <div className="text-center p-4">
            <h2 className="text-2xl font-bold text-[#0A3130] mb-4">Página em desenvolvimento acesso restrito.</h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-sm mx-auto">
                <div>
                    <label htmlFor="password-input" className="sr-only">Senha</label>
                    <div className="relative">
                        <input
                            id="password-input"
                            type={showPassword ? "text" : "password"}
                            value={passwordInput}
                            onChange={(e) => {
                                setPasswordInput(e.target.value);
                                if (passwordError) setPasswordError('');
                            }}
                            className={`w-full p-3 border rounded-lg text-black ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Digite a senha de acesso"
                            autoFocus
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                    </div>
                    {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:brightness-110"
                >
                    Acessar
                </button>
            </form>
        </div>
      </Modal>

      <Modal isOpen={isSuggestionModalOpen} onClose={() => { setIsSuggestionModalOpen(false); resetSuggestionModal(); }}>
        <div className="p-4">
          <h2 className="text-2xl font-bold text-center text-[#0A3130] mb-4">Sugestão de Melhoria com IA</h2>
          
          {suggestionLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px]">
              <RefreshCwIcon className="h-10 w-10 animate-spin text-gray-700" />
              <p className="mt-4 text-lg font-semibold text-gray-700">Analisando e gerando sugestão...</p>
            </div>
          ) : suggestionError ? (
             <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
                <XCircleIcon className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-bold text-red-700">Ocorreu um Erro</h3>
                <p className="text-gray-600 mt-2 max-w-md">{suggestionError}</p>
                <button onClick={resetSuggestionModal} className="mt-6 bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-700">Tentar Novamente</button>
            </div>
          ) : suggestionResult ? (
             <div>
                <div className="bg-gray-50 p-4 rounded-lg border max-h-[60vh] overflow-y-auto scrollbar-thin">
                    <SimpleMarkdown text={suggestionResult} />
                </div>
                <div className="text-center mt-6">
                    <button onClick={resetSuggestionModal} className="bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:brightness-110">Gerar Nova Sugestão</button>
                </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-600">Descreva um processo, um problema ou uma ideia. Você também pode anexar um documento (PDF, DOCX, TXT) para dar mais contexto à IA.</p>
              
              <textarea
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-[#3095A6]"
                placeholder="Ex: O processo de aprovação de notas fiscais é muito lento e manual, envolvendo e-mails e planilhas..."
              />

              <label htmlFor="suggestion-file-upload" className={`flex items-center gap-3 w-full p-3 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${suggestionFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}>
                <UploadIcon className={`h-6 w-6 flex-shrink-0 ${suggestionFile ? 'text-green-600' : 'text-gray-400'}`} />
                <span className={`text-sm truncate ${suggestionFile ? 'text-green-800 font-semibold' : 'text-gray-500'}`}>{suggestionFile ? suggestionFile.name : 'Anexar documento (opcional)'}</span>
              </label>
              <input id="suggestion-file-upload" type="file" className="hidden" onChange={(e) => setSuggestionFile(e.target.files?.[0] || null)} accept=".pdf,.docx,.txt" />

              <button
                onClick={handleGenerateSuggestion}
                disabled={!suggestionText.trim()}
                className="w-full bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-bold py-3 px-8 rounded-lg shadow-md hover:brightness-110 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gerar Sugestão
              </button>
            </div>
          )}
        </div>
      </Modal>
    </main>
  );
};
