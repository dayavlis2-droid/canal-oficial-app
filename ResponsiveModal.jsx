import React from 'react';
import { X } from 'lucide-react';

const ResponsiveModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer, 
    maxWidth = 'max-w-md' 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300">
            {/* O SEGREDO: h-[100dvh] força a altura exata da tela visível no celular */}
            <div className={`
                w-full h-[100dvh] md:h-auto md:max-h-[85vh] 
                bg-white md:rounded-2xl shadow-2xl flex flex-col 
                ${maxWidth} overflow-hidden
            `}>
                
                {/* HEADER - Agora com fundo azul para você ver que atualizou */}
                <div className="flex items-center justify-between p-4 bg-[#005C99] text-white shrink-0 md:rounded-t-2xl">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* BODY - Flex-1 faz ele ocupar SÓ o espaço que sobra */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                    {children}
                </div>

                {/* FOOTER - Shrink-0 impede que ele seja esmagado */}
                {footer && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0 md:rounded-b-2xl pb-safe">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponsiveModal;
