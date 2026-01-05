import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import ResponsiveModal from './ResponsiveModal'; // Importando o novo modal

const CreateAcordoModal = ({ isOpen, onClose, onSend, clientName }) => {
    const [title, setTitle] = useState('');
    const [totalValue, setTotalValue] = useState('');
    const [description, setDescription] = useState('');

    const handleSend = () => {
        if (!title || !totalValue) {
            alert("Preencha o título e o valor.");
            return;
        }
        onSend({ 
            title, 
            totalValue: parseFloat(totalValue), 
            description,
            status: 'pending' 
        });
        // Limpar form
        setTitle('');
        setTotalValue('');
        setDescription('');
        onClose();
    };

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={onClose}
            title="Novo Orçamento / Acordo"
            footer={
                <div className="flex w-full gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSend}
                        className="flex-1 bg-[#005C99] text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <FileText size={18} /> Enviar Proposta
                    </button>
                </div>
            }
        >
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm text-blue-800">Criando proposta para: <strong>{clientName || 'Cliente'}</strong></p>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Título do Serviço</label>
                    <input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#005C99] focus:ring-1 focus:ring-[#005C99] outline-none transition-all"
                        placeholder="Ex: Instalação Elétrica"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Valor Total (R$)</label>
                    <input 
                        type="number"
                        value={totalValue}
                        onChange={(e) => setTotalValue(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#005C99] focus:ring-1 focus:ring-[#005C99] outline-none transition-all"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-600 mb-1">Detalhes (Opcional)</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-200 rounded-xl h-32 focus:border-[#005C99] focus:ring-1 focus:ring-[#005C99] outline-none transition-all resize-none"
                        placeholder="Descreva as condições, prazos ou itens inclusos..."
                    />
                </div>
            </div>
        </ResponsiveModal>
    );
};

export default CreateAcordoModal;