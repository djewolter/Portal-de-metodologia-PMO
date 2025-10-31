import React, { useState, FormEvent } from 'react';
import Modal from './Modal';
import { CheckCircleIcon } from './Icons';

// Helper for input components
const Input = (props: React.ComponentProps<'input'> & { label: string; error?: string }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">{props.label}</label>
    <input {...props} className={`mt-1 block w-full px-3 py-2 bg-white border ${props.error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-[#3095A6] focus:border-[#3095A6]`} />
    {props.error && <p className="mt-1 text-xs text-red-600">{props.error}</p>}
  </div>
);

const Select = (props: React.ComponentProps<'select'> & { label: string; error?: string }) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">{props.label}</label>
        <select {...props} className={`mt-1 block w-full px-3 py-2 bg-white border ${props.error ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm text-black focus:outline-none focus:ring-[#3095A6] focus:border-[#3095A6]`}>
            {props.children}
        </select>
        {props.error && <p className="mt-1 text-xs text-red-600">{props.error}</p>}
    </div>
);


const maskCNPJ = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .slice(0, 18);
};

const maskCEP = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 9);
};

const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

interface SupplierRegistrationFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const SupplierRegistrationForm: React.FC<SupplierRegistrationFormProps> = ({ isOpen, onClose }) => {
    const initialFormState = {
        razaoSocial: '', cnpj: '', endereco: '', bairro: '', cidade: '', estado: '', cep: '',
        repLegal: '', email: '', banco: '', agencia: '', conta: '', titulo: '',
        faturamentoCnpj: '', categoria: '', dataInicio: '', dataFim: '', valorContrato: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        let processedValue = value;
        if (name === 'cnpj') processedValue = maskCNPJ(value);
        else if (name === 'cep') processedValue = maskCEP(value);
        
        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ''); // Remove all non-digits
        
        const numberValue = parseInt(value, 10) || 0;
        
        const formattedValue = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numberValue / 100);
        
        setFormData(prev => ({ ...prev, valorContrato: formattedValue }));
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.razaoSocial.trim()) newErrors.razaoSocial = 'Razão Social é obrigatória.';
        if (!formData.cnpj) newErrors.cnpj = 'CNPJ é obrigatório.';
        else if (formData.cnpj.replace(/\D/g, '').length !== 14) newErrors.cnpj = 'CNPJ inválido.';
        if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'E-mail inválido.';
        if (!formData.categoria) newErrors.categoria = 'Categoria é obrigatória.';
        if (!formData.dataInicio) newErrors.dataInicio = 'Data de início é obrigatória.';
        if (!formData.dataFim) newErrors.dataFim = 'Data de fim é obrigatória.';
        if (!formData.valorContrato || formData.valorContrato === 'R$ 0,00') newErrors.valorContrato = 'Valor do contrato é obrigatório.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            console.log('Dados do formulário:', formData);
            setIsSubmitted(true);
        }
    };

    const handleCloseAndReset = () => {
        setIsSubmitted(false);
        setFormData(initialFormState);
        setErrors({});
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCloseAndReset}>
            {isSubmitted ? (
                <div className="text-center p-8">
                    <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-800">Solicitação Registrada!</h3>
                    <p className="text-gray-600 mt-2">Sua solicitação de cadastro de fornecedor foi enviada com sucesso.</p>
                    <button onClick={handleCloseAndReset} className="mt-6 bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:brightness-110">Fechar</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <h2 className="text-2xl font-bold text-center text-[#0A3130]">Formulário de Cadastro de Fornecedor</h2>

                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">Dados do Fornecedor</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Razão Social" name="razaoSocial" value={formData.razaoSocial} onChange={handleInputChange} required error={errors.razaoSocial} />
                            <Input label="CNPJ" name="cnpj" value={formData.cnpj} onChange={handleInputChange} required error={errors.cnpj} />
                            <Input label="Endereço" name="endereco" value={formData.endereco} onChange={handleInputChange} />
                            <Input label="Bairro" name="bairro" value={formData.bairro} onChange={handleInputChange} />
                            <Input label="Cidade" name="cidade" value={formData.cidade} onChange={handleInputChange} />
                            <Select label="Estado" name="estado" value={formData.estado} onChange={handleInputChange}>
                                <option value="">Selecione...</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </Select>
                            <Input label="CEP" name="cep" value={formData.cep} onChange={handleInputChange} />
                            <Input label="Nome do Representante Legal" name="repLegal" value={formData.repLegal} onChange={handleInputChange} />
                             <div className="md:col-span-2">
                                <Input label="Contato E-mail" type="email" name="email" value={formData.email} onChange={handleInputChange} required error={errors.email} />
                            </div>
                        </div>
                    </fieldset>
                    
                    <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">Dados Bancários</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Banco" name="banco" value={formData.banco} onChange={handleInputChange} />
                            <Input label="Agência" name="agencia" value={formData.agencia} onChange={handleInputChange} />
                            <Input label="Conta Bancária" name="conta" value={formData.conta} onChange={handleInputChange} />
                        </div>
                    </fieldset>

                     <fieldset className="border p-4 rounded-lg">
                        <legend className="px-2 font-semibold text-gray-700">Detalhes do Contrato</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="md:col-span-2">
                                <Input label="Título (Nome da Solução)" name="titulo" value={formData.titulo} onChange={handleInputChange} />
                           </div>
                           <Input label="Empresa de Faturamento (CNPJ)" name="faturamentoCnpj" value={formData.faturamentoCnpj} onChange={handleInputChange} />
                            <Select label="Categoria" name="categoria" value={formData.categoria} onChange={handleInputChange} required error={errors.categoria}>
                                <option value="">Selecione...</option>
                                <option value="Serviço">Serviço</option>
                                <option value="Licenciamento">Licenciamento</option>
                            </Select>
                            <Input label="Data de Início" type="date" name="dataInicio" value={formData.dataInicio} onChange={handleInputChange} required error={errors.dataInicio} />
                            <Input label="Data de Fim" type="date" name="dataFim" value={formData.dataFim} onChange={handleInputChange} required error={errors.dataFim} />
                             <div className="md:col-span-2">
                                <Input label="Valor do Contrato" name="valorContrato" value={formData.valorContrato} onChange={handleCurrencyChange} required error={errors.valorContrato} placeholder="R$ 0,00" />
                            </div>
                        </div>
                    </fieldset>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-gradient-to-b from-[#0A3130] to-[#3095A6] text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:brightness-110">
                            Enviar Solicitação
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default SupplierRegistrationForm;