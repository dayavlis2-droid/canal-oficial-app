import React, { useState } from 'react';
import { X, Trash2, Plus, ShieldCheck } from 'lucide-react';

const CreateAcordoModal = ({ onClose, onSend, initialItems = [] }) => {
    const [paymentMethod, setPaymentMethod] = useState('Pix');
    const [installments, setInstallments] = useState('1');
    const [items, setItems] = useState(initialItems);
    
    // Form Inputs
    const [newItemName, setNewItemName] = useState('');
    const [newItemQty, setNewItemQty] = useState(1);
    const [newItemPrice, setNewItemPrice] = useState('');

    const addItem = () => {
        if (!newItemName || !newItemPrice) return;
        const newItem = {
            id: Date.now().toString(),
            name: newItemName,
            quantity: newItemQty,
            unitPrice: Number(newItemPrice)
        };
        setItems([...items, newItem]);
        setNewItemName('');
        setNewItemQty(1);
        setNewItemPrice('');
    };

    const removeItem = (id) => {
        setItems(items.filter(i => i.id !== id));
    };

    const totalValue = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

    return (
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 animate-fade-in font-sans">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-gray-100 pb-4">
                  <div>
                      <h3 className="font-bold text-xl text-slate-800">Novo Orçamento</h3>
                      <p className="text-xs text-gray-500">Formalize o pedido</p>
                  </div>
                  <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X className="text-gray-600" size={20}/></button>
              </div>
              
              <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  
                  if (items.length === 0) {
                      alert("Adicione pelo menos um item.");
                      return;
                  }

                  const acordo = {
                      title: formData.get('title'),
                      items: items,
                      totalValue: totalValue,
                      deadline: formData.get('deadline'),
                      payment: paymentMethod,
                      installments: paymentMethod === 'Cartão' ? Number(installments) : undefined,
                      notes: formData.get('notes'),
                      cpf: formData.get('cpf'),
                      clientPhone: formData.get('clientPhone'),
                      status: 'pendente'
                  };
                  onSend(acordo);
              }} className="space-y-4">
                  
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Descrição do Pedido</label>
                      <input name="title" required placeholder="Ex: Pedido de Roupas" defaultValue={initialItems.length > 0 ? "Pedido via Catálogo" : ""} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#005C99] outline-none" />
                  </div>

                  {/* Items List */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Itens do Orçamento</label>
                      <div className="space-y-2 mb-3">
                          {items.map(item => (
                              <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100">
                                  <div>
                                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                      <p className="text-xs text-gray-500">{item.quantity}x R$ {item.unitPrice.toFixed(2)}</p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <span className="font-bold text-[#005C99] text-sm">R$ {(item.quantity * item.unitPrice).toFixed(2)}</span>
                                      <button type="button" onClick={() => removeItem(item.id)} className="text-red-400"><Trash2 size={16}/></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                      
                      {/* Add Item Form */}
                      <div className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-6">
                              <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Item" className="w-full p-2 text-sm border rounded-lg"/>
                          </div>
                          <div className="col-span-2">
                              <input type="number" value={newItemQty} onChange={e => setNewItemQty(Number(e.target.value))} placeholder="Qtd" className="w-full p-2 text-sm border rounded-lg"/>
                          </div>
                          <div className="col-span-3">
                              <input type="number" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="R$" className="w-full p-2 text-sm border rounded-lg"/>
                          </div>
                          <div className="col-span-1">
                              <button type="button" onClick={addItem} className="w-full h-9 bg-green-500 text-white rounded-lg flex items-center justify-center hover:bg-green-600"><Plus size={18}/></button>
                          </div>
                      </div>
                      <div className="mt-3 pt-3 border-t flex justify-between">
                          <span className="font-bold text-slate-600">Total:</span>
                          <span className="font-bold text-[#005C99] text-lg">R$ {totalValue.toFixed(2)}</span>
                      </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">CPF (Opcional)</label>
                          <input name="cpf" placeholder="000.000.000-00" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#005C99] outline-none" />
                      </div>
                      <div>
                          <label className="text-xs font-bold text-gray-500 uppercase ml-1">Telefone (Opcional)</label>
                          <input name="clientPhone" placeholder="(00) 00000-0000" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#005C99] outline-none" />
                      </div>
                  </div>
                  
                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pagamento</label>
                      <div className="flex gap-2">
                          <div className="flex-1">
                               <select 
                                  value={paymentMethod}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#005C99] outline-none appearance-none"
                               >
                                  <option value="Pix">Pix</option>
                                  <option value="Dinheiro">Dinheiro</option>
                                  <option value="Cartão">Cartão</option>
                                  <option value="Boleto">Boleto</option>
                              </select>
                          </div>
                          {paymentMethod === 'Cartão' && (
                               <div className="w-24">
                                  <select 
                                      value={installments}
                                      onChange={(e) => setInstallments(e.target.value)}
                                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#005C99] outline-none"
                                  >
                                      {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                                          <option key={num} value={num}>{num}x</option>
                                      ))}
                                  </select>
                                </div>
                          )}
                      </div>
                  </div>

                  <div>
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">Observações</label>
                      <textarea name="notes" placeholder="Detalhes adicionais..." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#005C99] focus:bg-white outline-none transition-all h-24"></textarea>
                  </div>
                  
                  <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 hover:bg-slate-800 flex items-center justify-center gap-2">
                      <ShieldCheck size={18} /> GERAR ORÇAMENTO
                  </button>
              </form>
          </div>
      </div>
    );
};

export default CreateAcordoModal;