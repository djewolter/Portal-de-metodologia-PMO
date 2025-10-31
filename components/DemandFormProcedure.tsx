import React from 'react';
import { ArrowUpRightFromSquareIcon } from './Icons';

const DemandFormProcedure: React.FC = () => {
  return (
    <div className="space-y-8 text-gray-800">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          Procedimento – Avaliar Formulário de Demanda (1.1)
        </h2>
        <p className="mt-2 text-gray-600 max-w-xl mx-auto">
          Avaliação inicial para verificar se o formulário de demanda está completo e adequado para as próximas etapas do projeto.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-4 text-left">
        <h3 className="text-xl font-bold text-gray-700">Passo a Passo</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 leading-relaxed">
          <li>Receber o formulário de demanda preenchido pelo solicitante.</li>
          <li>Conferir se todos os campos obrigatórios foram preenchidos.</li>
          <li>Verificar clareza da descrição da demanda e dos objetivos.</li>
          <li>Validar se os anexos necessários foram incluídos.</li>
          <li>Caso falte informação, retornar para o solicitante com orientações.</li>
          <li>Se aprovado, registrar a avaliação e seguir para a próxima atividade.</li>
        </ol>
      </div>

      {/* Zeev Action Block */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center space-y-3">
         <p className="text-gray-600">Este fluxo é automático e realizado diretamente na plataforma Zeev.</p>
         <a
            href="https://sipal.zeev.it/2.0/request?c=9E1%2BMwJdg7qhOyk2vhIaLOQMiatJneppEaJzInWbrQraaNXEh2ilGyxpQ8KC455dQVOAKvyPYx9X9BP%2FT5XtiA%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:brightness-110 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3095A6]"
          >
            <ArrowUpRightFromSquareIcon className="h-5 w-5" />
            Acessar Solicitação no Zeev
          </a>
      </div>
      
      {/* PMO Warning */}
      <div className="bg-amber-100/60 border-l-4 border-amber-500 text-amber-900 p-4 rounded-r-lg">
        <p>
          Esta etapa é <strong>obrigatória</strong> e realizada pelo <strong>Escritório de Projetos (PMO)</strong>.
        </p>
      </div>
    </div>
  );
};

export default DemandFormProcedure;