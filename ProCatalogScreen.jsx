import React, { useState, useRef } from 'react';
import { ChevronLeft, ImageIcon, Trash2, Camera, Plus } from 'lucide-react';

const ProCatalogScreen = ({ catalog, setCatalog, setCurrentScreen }) => {
    const [newItem, setNewItem] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const fileInputRef = useRef(null);

    const handleAddItem = () => {
        if(!newItem.title || !newItem.price) return;
        const item = {
            id: Date.now().toString(),
            title: newItem.title,
            price: Number(newItem.price),
            description: newItem.description || '',
            image: newItem.image
        };
        setCatalog([...catalog, item]);
        setNewItem({});
        setIsAdding(false);
    };

    const handleDelete = (id) => {
        setCatalog(catalog.filter(i => i.id !== id));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setNewItem({ ...newItem, image: ev.target?.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <header className="bg-white p-4 shadow-sm flex items-center gap-3 sticky top-0 z-10">
                <button onClick={() => setCurrentScreen('home')} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft className="text-slate-700"/></button>
                <h2 className="font-bold text-lg text-slate-800">Gerenciar Catálogo</h2>
            </header>

            <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {catalog.map((item) => (
                    <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-3 items-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                            {item.image ? <img src={item.image} className="w-full h-full object-cover"/> : <ImageIcon size={20} className="text-gray-400"/>}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                            <p className="text-xs text-gray-500 truncate mt-1">{item.description}</p>
                            <p className="font-bold text-[#005C99] mt-2 text-sm">R$ {item.price.toFixed(2)}</p>
                        </div>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-full">
                            <Trash2 size={18}/>
                        </button>
                    </div>
                ))}

                {isAdding ? (
                    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 animate-slide-up">
                        <h4 className="font-bold text-sm mb-4 text-slate-800">Novo Item</h4>
                        <div className="space-y-3">
                            <div 
                                className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {newItem.image ? (
                                    <img src={newItem.image} className="w-full h-full object-cover rounded-xl" />
                                ) : (
                                    <>
                                        <Camera size={24} className="text-gray-400 mb-1"/>
                                        <span className="text-xs text-gray-400 font-medium">Adicionar Foto</span>
                                    </>
                                )}
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload}/>
                            
                            <input 
                                placeholder="Nome do produto" 
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#005C99]"
                                value={newItem.title || ''}
                                onChange={e => setNewItem({...newItem, title: e.target.value})}
                            />
                            <input 
                                placeholder="Preço (R$)" 
                                type="number"
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#005C99]"
                                value={newItem.price || ''}
                                onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                            />
                            <textarea 
                                placeholder="Descrição" 
                                className="w-full p-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#005C99]"
                                value={newItem.description || ''}
                                onChange={e => setNewItem({...newItem, description: e.target.value})}
                            />
                            <div className="flex gap-2 pt-2">
                                <button onClick={() => setIsAdding(false)} className="flex-1 py-3 text-gray-500 text-sm font-bold bg-gray-100 rounded-xl hover:bg-gray-200">Cancelar</button>
                                <button onClick={handleAddItem} className="flex-1 py-3 bg-[#005C99] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 hover:bg-blue-800">Salvar Item</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold flex items-center justify-center gap-2 hover:border-[#005C99] hover:text-[#005C99] hover:bg-blue-50 transition-all"
                    >
                        <Plus size={20}/> Adicionar Item ao Catálogo
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProCatalogScreen;