import React, { useState } from 'react';
import { ChevronLeft, Filter, Search, Calendar, FileText, Phone, Download, History } from 'lucide-react';

const AgreementsScreen = ({ messages, setCurrentScreen, downloadCombinadoPDF }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [tab, setTab] = useState('fechados');
    const [showFilters, setShowFilters] = useState(false);

    const filterMessages = (msgs) => {
        return msgs.filter((msg) => {
            if (!msg.orcamento) return false;
            
            const term = searchTerm.toLowerCase();
            const matchesText = 
                msg.orcamento.title.toLowerCase().includes(term) ||
                msg.orcamento.totalValue.toString().includes(term) ||
                (msg.orcamento.cpf && msg.orcamento.cpf.includes(term)) ||
                (msg.orcamento.clientPhone && msg.orcamento.clientPhone.includes(term));

            const msgDate = new Date(msg.timestamp);
            msgDate.setHours(0,0,0,0);
            
            let matchesStart = true;
            if (startDate) {
                matchesStart = msg.timestamp >= new Date(startDate);
            }

            let matchesEnd = true;
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59);
                matchesEnd = msg.timestamp <= end;
            }

            return matchesText && matchesStart && matchesEnd;
        });
    };

    const accepted = messages.filter((m) => m.type === 'orcamento' && m.orcamento?.status === 'aceito');
    const rejected = messages.filter((m) => m.type === 'orcamento' && m.orcamento?.status === 'recusado');
    const pending = messages.filter((m) => m.type === 'orcamento' && m.orcamento?.status === 'pendente');

    const displayMessages = filterMessages(tab === 'fechados' ? accepted : [...pending, ...rejected]);

    return (
        <div className="flex flex-col h-full bg-slate-50">
            <header className="bg-white p-4 shadow-sm flex items-center gap-3">
                <button onClick={() => setCurrentScreen('home')}><ChevronLeft/></button>
                <div className="flex-1">
                    <h2 className="font-bold text-lg text-slate-800">Histórico de Orçamentos</h2>
                    <p className="text-xs text-gray-400">Arquivado por 1 ano</p>
                </div>
                <button onClick={() => setShowFilters(!showFilters)} className={`p-2 rounded-full transition-colors ${showFilters ? 'bg-[#005C99] text-white' : 'bg-gray-100 text-gray-600'}`}><Filter size={20}/></button>
            </header>
            
            {showFilters && (
                <div className="bg-white px-4 pb-4 pt-2 border-b border-gray-100 animate-slide-up space-y-3 shadow-sm z-10">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar CPF, telefone, nome..." 
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#005C99] focus:ring-1 focus:ring-[#005C99]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1"><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">De</label><input type="date" className="w-full p-2 bg-gray-50 border rounded-xl text-sm text-gray-600 outline-none focus:border-[#005C99]" value={startDate} onChange={(e) => setStartDate(e.target.value)}/></div>
                        <div className="flex-1"><label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Até</label><input type="date" className="w-full p-2 bg-gray-50 border rounded-xl text-sm text-gray-600 outline-none focus:border-[#005C99]" value={endDate} onChange={(e) => setEndDate(e.target.value)}/></div>
                    </div>
                </div>
            )}

            <div className="p-4 flex-1 overflow-y-auto">
                <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
                    <button onClick={() => setTab('fechados')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'fechados' ? 'bg-white shadow-sm text-green-700' : 'text-gray-500'}`}>Fechados ({accepted.length})</button>
                    <button onClick={() => setTab('outros')} className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${tab === 'outros' ? 'bg-white shadow-sm text-gray-700' : 'text-gray-500'}`}>Pendentes/Recusados</button>
                </div>

                <div className="space-y-3">
                    {displayMessages.map((msg) => (
                        <div key={msg.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-800 text-lg">{msg.orcamento?.title}</h4>
                                <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase font-bold tracking-wide ${msg.orcamento?.status === 'aceito' ? 'bg-green-100 text-green-700' : msg.orcamento?.status === 'pendente' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{msg.orcamento?.status}</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <p className="text-xl font-bold text-[#005C99] mt-1">R$ {msg.orcamento?.totalValue.toFixed(2)}</p>
                                <p className="flex items-center gap-1"><Calendar size={14}/> Data: {msg.timestamp.toLocaleDateString()}</p>
                                <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded-lg">
                                    {msg.orcamento?.items.map(i => <div key={i.id}>{i.quantity}x {i.name}</div>)}
                                </div>
                                {msg.orcamento?.cpf && <p className="flex items-center gap-1 text-xs text-gray-500 mt-2"><FileText size={14}/> CPF: {msg.orcamento.cpf}</p>}
                                {msg.orcamento?.clientPhone && <p className="flex items-center gap-1 text-xs text-gray-500"><Phone size={14}/> Tel: {msg.orcamento.clientPhone}</p>}
                            </div>
                            <button onClick={() => downloadCombinadoPDF(msg.orcamento)} className="mt-3 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition-colors"><Download size={16}/> Baixar Comprovante</button>
                        </div>
                    ))}
                    {displayMessages.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <History size={64} className="mx-auto mb-3 opacity-20"/>
                            <p className="font-medium">Nenhum orçamento encontrado.</p>
                            {(searchTerm || startDate || endDate) && <p className="text-xs mt-1">Tente ajustar os filtros de busca.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgreementsScreen;