import React from 'react';
import BackButton from '../components/BackButton';

const OnboardingPage: React.FC = () => {
  return (
    <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <div className="space-y-8">
            {/* Title */}
            <div className="text-center animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#0A3130]">
                Onboarding do Escritório de Projetos – Parte 1
            </h1>
            </div>

            {/* Welcome Box */}
            <div className="bg-[#e0f2fe] border-l-4 border-[#3095A6] text-[#0A3130] p-6 rounded-r-lg shadow-md animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <h2 className="font-bold text-xl mb-2">Seja bem-vindo ao Escritório de Projetos da Sipal.</h2>
            <p>Esta página apresenta de forma resumida como funcionamos e o que você pode esperar do nosso processo de projetos.</p>
            </div>

            {/* Institutional Block */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-[#0A3130] border-l-4 border-[#0A3130] pl-4">
                1. Apresentação Institucional – Conheça o Grupo Sipal
            </h2>
            <p className="text-gray-700 leading-relaxed">
                O <strong>Grupo Sipal</strong> é uma força consolidada no agronegócio, com foco em inovação e na geração de valor em toda a cadeia produtiva.
            </p>
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Nossos Valores:</h3>
                <ul className="space-y-3 text-gray-700 list-disc list-inside">
                <li><strong>Comprometimento com resultado</strong></li>
                <li><strong>Responsabilidade socioambiental</strong></li>
                <li><strong>Respeito às pessoas e ao conhecimento técnico</strong></li>
                <li><strong>Espírito de colaboração</strong></li>
                </ul>
            </div>
            </div>

            {/* PMO Block */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-bold text-[#0A3130] border-l-4 border-[#0A3130] pl-4">
                2. Função e Objetivos do Escritório de Projetos (PMO)
            </h2>
            <p className="text-gray-700 leading-relaxed">
                O PMO da Sipal atua de forma <strong>tático-estratégica</strong>. Nosso papel é padronizar métodos de gestão, apoiar os gerentes de projeto, organizar o portfólio, gerar indicadores de desempenho e facilitar a comunicação entre todos os envolvidos.
            </p>
            </div>

            {/* Final Phrase */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fadeIn" style={{ animationDelay: '400ms' }}>
            <p className="text-lg font-semibold text-[#0A3130]">
                Se você participa de um projeto, conte com nosso apoio para seguir as melhores práticas e garantir os resultados esperados.
            </p>
            </div>
        </div>
      </div>
    </main>
  );
};

export default OnboardingPage;