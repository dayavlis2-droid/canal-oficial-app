import React, { useState } from 'react';
import { ChevronLeft, ImageIcon, Minus, Plus, ShoppingBag } from 'lucide-react';

const ClientCatalogScreen = ({ catalog, onSendOrder, setCurrentScreen }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (item) => {
        const existing = cart.find(i => i.id === item.id);
        if (existing && existing.quantity > 1) {
            setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
            setCart(cart.filter(i => i.id !== item.id));
        }
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <div className="bg-white p-6 pb-6 shadow-sm relative z-10">
                <button onClick={() => setCurrentScreen('client_landing')} className="absolute top-6 left-4 text-gray-500 hover:bg-gray-100 p-2 rounded-full"><ChevronLeft/></button>
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800">Catálogo</h1>
                    <p className="text-gray-500 text-sm">Selecione o que precisa</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {catalog.map((item) => {
                    const inCart = cart.find(i => i.id === item.id);
                    return (
                        <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                                {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={24}/></div>}
                            </div>
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm leading-tight">{item.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description}</p>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <span className="font-bold text-[#005C99] text-lg">R$ {item.price.toFixed(2)}</span>
                                    
                                    {inCart ? (
                                        <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl">
                                            <button onClick={() => removeFromCart(item)} className="p-1 bg-white rounded-lg shadow-sm text-gray-600"><Minus size={14}/></button>
                                            <span className="font-bold text-sm w-4 text-center">{inCart.quantity}</span>
                                            <button onClick={() => addToCart(item)} className="p-1 bg-[#005C99] text-white rounded-lg shadow-sm"><Plus size={14}/></button>
                                        </div>
                                    ) : (
                                        <button 
                                            onClick={() => addToCart(item)}
                                            className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                        >
                                            Adicionar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {cart.length > 0 && (
                <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-20 animate-slide-up rounded-t-3xl">
                    <div className="flex justify-between items-center mb-4 px-2">
                        <span className="text-sm font-medium text-gray-500">{cart.reduce((a,b)=>a+b.quantity,0)} itens</span>
                        <div className="text-right">
                             <p className="text-xs text-gray-400">Total a pagar</p>
                             <span className="font-bold text-2xl text-[#005C99]">R$ {total.toFixed(2)}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => onSendOrder(cart)}
                        className="w-full bg-[#005C99] text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 hover:bg-blue-800 flex items-center justify-center gap-2 transition-transform active:scale-95"
                    >
                        <ShoppingBag size={20}/> ENVIAR PEDIDO
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClientCatalogScreen;