import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import ResponsiveModal from './ResponsiveModal'; // <--- O NOVO MODAL

const ProCatalogScreen = ({ catalog, setCatalog, setCurrentScreen }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const handleSaveItem = () => {
        if (!currentItem.title || !currentItem.price) return;

        if (currentItem.id) {
            // Editar
            setCatalog(catalog.map(i => i.id === currentItem.id ? currentItem : i));
        } else {
            // Criar
            setCatalog([...catalog, { ...currentItem, id: Date.now().toString() }]);
        }
        setIsEditing(false);
        setCurrentItem(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Tem certeza que deseja excluir?")) {
            setCatalog(catalog.filter(i => i.id !== id));
        }
    };

    const openModal = (item = { title: '', price: '', description: '' }) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                 <div className="flex items-center gap-3">
                     <button onClick={() => setCurrentScreen('home')} className="text-gray-600 font-bold text-sm">Voltar</button>
                     <h2 className="font-bold text-lg text-[#005C99]">Gerenciar Catálogo</h2>
                 </div>
                 <button 
                    onClick={() => openModal()}
                    className="bg-[#005C99] text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-800"
                 >
                    <Plus size={16}/> Novo Item
                 </button>
            </div>

            {/* Lista */}
            <div className="p-4 space-y-3 overflow-y-auto pb-20">
                {catalog.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">
                        <Package size={48} className="mx-auto mb-4 opacity-30"/>
                        <p>Nenhum item cadastrado.</p>
                    </div>
                ) : (
                    catalog.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group">
                            <div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.description}</p>
                                <p className="text-[#005C99] font-bold mt-1">R$ {parseFloat(item.price).toFixed(2)}</p>
                            </div>
                            <div className="flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal(item)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><Edit2 size={16}/></button>
                                <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- MODAL DE EDIÇÃO (ResponsiveModal) --- */}
            <ResponsiveModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                title={currentItem?.id ? "Editar Item" : "Novo Serviço/Produto"}
                footer={
                    <div className="flex w-full gap-3">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="flex-1 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSaveItem}
                            className="flex-1 bg-[#005C99] text-white py-3 rounded-xl font-bold hover:bg-blue-800"
                        >
                            Salvar Item
                        </button>
                    </div>
                }
            >
                {currentItem && (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Título</label>
                            <input 
                                value={currentItem.title} 
                                onChange={e => setCurrentItem({...currentItem, title: e.target.value})}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Ex: Consultoria"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Preço (R$)</label>
                            <input 
                                type="number"
                                value={currentItem.price} 
                                onChange={e => setCurrentItem({...currentItem, price: parseFloat(e.target.value)})}
                                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-1">Descrição</label>
                            <textarea 
                                value={currentItem.description} 
                                onChange={e => setCurrentItem({...currentItem, description: e.target.value})}
                                className="w-full p-3 border rounded-xl h-24 focus:ring-2 focus:ring-blue-500 outline-none" 
                                placeholder="Detalhes do serviço..."
                            />
                        </div>
                    </div>
                )}
            </ResponsiveModal>
        </div>
    );
};

export default ProCatalogScreen;
