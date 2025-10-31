import React from 'react';
import { ControlSupportProcess } from '../types';
import { ClipboardCheckIcon, UsersIcon, ClockIcon, ArrowUpRightFromSquareIcon } from './Icons';

interface ControlProcessProcedureProps {
  process: ControlSupportProcess;
  onOpenSupplierForm: () => void;
}

const ControlProcessProcedure: React.FC<ControlProcessProcedureProps> = ({ process, onOpenSupplierForm }) => {
  const isSupplierRegistration = process.id === 'csp-1';
  
  return (
    <div className="space-y-8 text-gray-800">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0A3130]">
          {process.name}
        </h2>
      </div>
      <div className="space-y-6 text-left p-6 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-start">
          <ClipboardCheckIcon className="h-6 w-6 text-green-600 mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-gray-800">Objetivo</h3>
            <p className="text-gray-700 leading-relaxed">{process.objective}</p>
          </div>
        </div>
        <div className="flex items-start">
          <UsersIcon className="h-6 w-6 text-sky-600 mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-gray-800">Responsável</h3>
            <p className="text-gray-700 leading-relaxed">{process.responsible}</p>
          </div>
        </div>
        <div className="flex items-start">
          <ClockIcon className="h-6 w-6 text-purple-600 mr-4 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg text-gray-800">Frequência</h3>
            <p className="text-gray-700 leading-relaxed">{process.frequency}</p>
          </div>
        </div>
      </div>

      {/* Renderiza condicionalmente o link para o cadastro de fornecedor */}
      {isSupplierRegistration && (
        <div className="mt-4 text-center">
          <button
            onClick={onOpenSupplierForm}
            className="inline-flex items-center gap-2 text-lg font-semibold text-[#0A3130] hover:text-[#3095A6] hover:underline transition-colors"
            aria-label="Solicitar o cadastro de fornecedor"
          >
            Solicite o cadastro de fornecedor aqui
            <ArrowUpRightFromSquareIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ControlProcessProcedure;