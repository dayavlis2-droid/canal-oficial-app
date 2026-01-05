import React from 'react';
import { X } from 'lucide-react';

const ResponsiveModal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer, 
    maxWidth = 'max-w-md' // Padrão médio, pode passar 'max-w-2xl' para maiores
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4 transition-all duration-300">
            {/* Container Principal do Modal 
               Mobile: h-[100dvh] (ocupa toda altura visível), arredondamento zero
               Desktop: Altura automática com limite, arredondado
            */}
            <div className={`
                w-full h-[100dvh] md:h-auto md:max-h-[85vh] 
                bg-white md:rounded-2xl shadow-2xl flex flex-col 
                ${maxWidth} transition-all duration-300
            `}>
                
                {/* HEADER (Fixo) */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0 bg-white md:rounded-t-2xl">
                    <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                    <button 
                        onClick={onClose} 
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* BODY (Rolagem) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 overscroll-contain">
                    {children}
                </div>

                {/* FOOTER (Fixo no fundo) */}
                {footer && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0 md:rounded-b-2xl flex flex-col md:flex-row gap-3 justify-end items-center">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponsiveModal;