import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Send, Trash2 } from 'lucide-react';
import ResponsiveModal from './ResponsiveModal'; // <--- O SEGREDO ESTÁ AQUI

const ClientCatalogScreen = ({ catalog, onSendOrder, setCurrentScreen }) => {
    const [cart, setCart] = useState({});
    const [isCartOpen, setIsCartOpen] = useState(false);

    // --- Lógica do Carrinho ---
    const updateQuantity = (item, delta) => {
        setCart(prev => {
            const currentQty = prev[item.id]?.qty || 0;
            const newQty = Math.max(0, currentQty + delta);
            
            if (newQty === 0) {
                const newCart = { ...prev };
                delete newCart[item.id];
                return newCart;
            }
            return { ...prev, [item.id]: { ...item, qty: newQty } };
        });
    };

    const cartItems = Object.values(cart);
    const totalCart = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
            {/* Header da Tela */}
            <div className="p-4 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
                <h2 className="font-bold text-lg text-gray-800">Catálogo de Serviços</h2>
                <div 
                    className="relative cursor-pointer p-2" 
                    onClick={() => cartItems.length > 0 && setIsCartOpen(true)}
                >
                    <ShoppingBag className={cartItems.length > 0 ? "text-[#005C99]" : "text-gray-400"} />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                            {totalItems}
                        </span>
                    )}
                </div>
            </div>

            {/* Lista de Itens */}
            <div className="p-4 pb-24 overflow-y-auto space-y-4">
                {catalog.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div className="flex-1">
                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                            <p className="text-[#005C99] font-bold mt-1">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 ml-3">
                            <button onClick={() => updateQuantity(item, -1)} className="p-2 text-[#005C99] hover:bg-white rounded-md transition-all">
                                <Minus size={16}/>
                            </button>
                            <span className="font-bold w-4 text-center">{cart[item.id]?.qty || 0}</span>
                            <button onClick={() => updateQuantity(item, 1)} className="p-2 text-[#005C99] hover:bg-white rounded-md transition-all">
                                <Plus size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Barra Inferior Flutuante (Resumo) */}
            {totalItems > 0 && (
                <div className="fixed bottom-4 left-4 right-4 md:absolute md:bottom-4 md:left-4 md:right-4 z-20">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="w-full bg-[#005C99] text-white p-4 rounded-xl shadow-lg flex items-center justify-between hover:bg-blue-800 transition-all"
                    >
                        <span className="font-bold">{totalItems} itens</span>
                        <span className="flex items-center gap-2 font-bold">
                            Ver Carrinho (R$ {totalCart.toFixed(2)}) <ShoppingBag size={18} />
                        </span>
                    </button>
                </div>
            )}

            {/* --- MODAL DO CARRINHO (Agora usando ResponsiveModal) --- */}
            <ResponsiveModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                title="Seu Carrinho"
                footer={
                    cartItems.length > 0 && (
                        <button 
                            onClick={() => { onSendOrder(cartItems); setIsCartOpen(false); }}
                            className="w-full bg-[#25D366] text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 shadow-sm"
                        >
                            <Send size={18} /> Enviar Pedido no WhatsApp
                        </button>
                    )
                }
            >
                {cartItems.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <ShoppingBag size={48} className="mx-auto mb-3 opacity-20"/>
                        <p>Seu carrinho está vazio.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                                <div>
                                    <div className="font-bold text-gray-800">{item.title}</div>
                                    <div className="text-sm text-gray-500">
                                        {item.qty}x R$ {item.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-[#005C99]">R$ {(item.price * item.qty).toFixed(2)}</span>
                                    <button 
                                        onClick={() => {
                                            const newCart = {...cart};
                                            delete newCart[item.id];
                                            setCart(newCart);
                                        }}
                                        className="text-red-400 p-2 hover:bg-red-50 rounded-full"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        <div className="bg-blue-50 p-4 rounded-xl flex justify-between items-center mt-4">
                            <span className="text-blue-900 font-bold">Total do Pedido</span>
                            <span className="text-[#005C99] text-xl font-bold">R$ {totalCart.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </ResponsiveModal>
        </div>
    );
};

export default ClientCatalogScreen;
