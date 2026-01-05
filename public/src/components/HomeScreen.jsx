import React, { useState } from 'react';
import { Settings, LogOut, CheckCircle, Coffee, Power, Check, Copy, History, Tag, User } from 'lucide-react';

const HomeScreen = ({ currentUser, workStatus, setWorkStatus, setBreakReturn, businessProfile, messages, setCurrentScreen, handleLogout, unreadCount, clientDb }) => {
    const [linkCopied, setLinkCopied] = useState(false);
    const [showStatusMenu, setShowStatusMenu] = useState(false);
    
    // Função auxiliar definida aqui para não precisar importar de arquivo externo
    const copyToClipboard = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try { document.execCommand('copy'); } catch (err) { console.error(err); }
        document.body.removeChild(textArea);
    };

    const handleCopyLink = () => {
        copyToClipboard(`canaloficial/${businessProfile.username}`);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    const handleStatusChange = (status) => {
        setWorkStatus(status);
        setShowStatusMenu(false);
    };

    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="bg-[#005C99] text-white p-4 shadow-md flex justify-between items-center">
          <h2 className="font-bold text-lg">Painel CanalOficial</h2>
          <div className="flex gap-2">
              <button onClick={() => setCurrentScreen('settings')} className="p-2 rounded-full hover:bg-white/10"><Settings size={20}/></button>
              <button onClick={handleLogout} className="p-2 rounded-full hover:bg-white/10"><LogOut size={20}/></button>
          </div>
        </header>

        {/* Status Control Widget */}
        <div className="bg-white p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Status de Atendimento</span>
                <button onClick={() => setShowStatusMenu(!showStatusMenu)} className="text-xs text-[#005C99] font-bold bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100">Alterar</button>
            </div>
            
            {showStatusMenu ? (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                    <button onClick={() => handleStatusChange('open')} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${workStatus === 'open' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-100 text-gray-600'}`}>Aberto</button>
                    <button onClick={() => handleStatusChange('break')} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${workStatus === 'break' ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-white border-gray-100 text-gray-600'}`}>Pausa</button>
                    <button onClick={() => handleStatusChange('closed')} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${workStatus === 'closed' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-gray-100 text-gray-600'}`}>Fechado</button>
                </div>
            ) : (
                <div className={`flex items-center gap-4 p-4 rounded-2xl border-l-4 shadow-sm ${
                    workStatus === 'open' ? 'bg-green-50 border-green-500' : 
                    workStatus === 'break' ? 'bg-orange-50 border-orange-500' : 
                    'bg-red-50 border-red-500'
                }`}>
                    <div className={`p-2 rounded-full ${
                        workStatus === 'open' ? 'bg-green-200 text-green-700' : 
                        workStatus === 'break' ? 'bg-orange-200 text-orange-700' : 
                        'bg-red-200 text-red-700'
                    }`}>
                        {workStatus === 'open' ? <CheckCircle size={20}/> : workStatus === 'break' ? <Coffee size={20}/> : <Power size={20}/>}
                    </div>
                    <div>
                        <p className={`font-bold text-base ${
                            workStatus === 'open' ? 'text-green-800' : 
                            workStatus === 'break' ? 'text-orange-800' : 
                            'text-red-800'
                        }`}>
                            {workStatus === 'open' ? 'Loja Aberta' : workStatus === 'break' ? 'Em Pausa' : 'Loja Fechada'}
                        </p>
                        {workStatus === 'break' && (
                             <div className="flex items-center gap-2 mt-1">
                                 <span className="text-xs text-orange-700 font-medium">Volto às:</span>
                                 <input 
                                    type="time" 
                                    className="bg-white/50 border border-orange-300 text-xs px-1 rounded text-orange-900 font-bold outline-none focus:bg-white"
                                    onChange={(e) => setBreakReturn(e.target.value)}
                                 />
                             </div>
                        )}
                        {workStatus === 'open' && <p className="text-xs text-green-700">Recebendo mensagens normalmente</p>}
                        {workStatus === 'closed' && <p className="text-xs text-red-700">Mensagens bloqueadas ou agendadas</p>}
                    </div>
                </div>
            )}
        </div>

        {/* Share Link Banner */}
        <div className="px-4 py-4">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-4 rounded-2xl shadow-lg text-white flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Seu Link</p>
                    <p className="text-sm font-bold truncate max-w-[200px]">canaloficial/{businessProfile.username}</p>
                </div>
                <button 
                    onClick={handleCopyLink}
                    className={`text-xs font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${linkCopied ? 'bg-green-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                >
                    {linkCopied ? <><Check size={16}/> COPIADO</> : <><Copy size={16}/> COPIAR</>}
                </button>
            </div>
        </div>

        <div className="px-4 pb-4 flex-1 overflow-y-auto">
             <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => setCurrentScreen('agreements')} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all group">
                    <div className="bg-blue-50 p-3 rounded-full text-[#005C99] group-hover:scale-110 transition-transform"><History size={24}/></div>
                    <span className="text-sm font-bold text-slate-700">Histórico</span>
                </button>
                 <button onClick={() => setCurrentScreen('pro_catalog')} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 hover:shadow-md transition-all group">
                    <div className="bg-teal-50 p-3 rounded-full text-[#00BFA5] group-hover:scale-110 transition-transform"><Tag size={24}/></div>
                    <span className="text-sm font-bold text-slate-700">Catálogo</span>
                </button>
             </div>

             <h3 className="text-gray-500 text-xs font-bold uppercase mb-3 ml-1 tracking-wider">Mensagens Recentes</h3>
             <div 
                onClick={() => { setCurrentScreen('chat'); }}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
            >
                {unreadCount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white">
                        {unreadCount}
                    </div>
                )}
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center text-xl font-bold text-slate-500 overflow-hidden border-2 border-white shadow-sm">
                     <User size={28}/>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between mb-1 items-baseline">
                        <span className="font-bold text-slate-800 text-base">{clientDb?.name || 'Cliente'}</span>
                        <span className="text-xs text-gray-400">Agora</span>
                    </div>
                    <p className={`text-sm truncate ${unreadCount > 0 ? 'font-bold text-slate-800' : 'text-gray-500'}`}>
                        {messages.length > 0 ? (
                            messages[messages.length-1].type === 'order' ? '🛍️ Novo Pedido Recebido' :
                            messages[messages.length-1].type === 'image' ? '📷 Foto' : 
                            messages[messages.length-1].content
                        ) : (
                            <span className="italic opacity-50">Inicie a conversa...</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
      </div>
    );
};

export default HomeScreen;