import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Info, MessageCircle, LogOut, AlertCircle, Clock, X, User, Phone, Mail, MapPin, FileText, Download, ShoppingBag, Image as ImageIcon, File, Smile, Paperclip, Send, Store } from 'lucide-react';
import CreateAcordoModal from './CreateAcordoModal';

const ChatScreen = ({ 
    messages, currentUser, businessProfile, clientDb, workStatus, blockMessagesOffline, queuePosition, 
    sendMessage, updateCombinadoStatus, downloadCombinadoPDF, setCurrentScreen 
}) => {
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef(null);
    const [showProfileInfo, setShowProfileInfo] = useState(false);
    const [showAcordoModal, setShowAcordoModal] = useState(false);
    
    // Acordo Initial Items State
    const [acordoInitialItems, setAcordoInitialItems] = useState([]);
    
    // Refs
    const imageInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "👍", "👎", "👏", "🙌", "🤝", "🙏", "✅", "❌", "💰", "📅"];
    const [showEmojis, setShowEmojis] = useState(false);
    const [showAttachments, setShowAttachments] = useState(false);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [messages]);

    const isPro = currentUser?.role === 'profissional';
    const isClientBlocked = !isPro && workStatus !== 'open' && blockMessagesOffline;

    const triggerImageUpload = () => imageInputRef.current?.click();
    const triggerFileUpload = () => fileInputRef.current?.click();

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) sendMessage("Foto enviada", 'image', { fileUrl: event.target.result });
            };
            reader.readAsDataURL(file);
        }
        setShowAttachments(false);
        e.target.value = ''; 
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
             const reader = new FileReader();
             reader.onload = (event) => {
                 if (event.target?.result) sendMessage(file.name, 'file', { fileName: file.name, fileUrl: event.target.result });
             };
             reader.readAsDataURL(file);
        }
        setShowAttachments(false);
        e.target.value = ''; 
    };

    const addEmoji = (emoji) => {
        setInputText(prev => prev + emoji);
    };

    const downloadFile = (fileUrl, fileName) => {
        if (!fileUrl) return;
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName || 'download';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Safe render for modal data
    const modalData = isPro 
        ? { 
            name: clientDb?.name || 'Cliente', 
            photoUrl: clientDb?.photoUrl, 
            sub: 'Cliente', 
            details: [
                { icon: Phone, label: 'Telefone', val: clientDb?.phone || 'Não informado' },
                { icon: Mail, label: 'Email', val: clientDb?.email || 'Não informado' },
                { icon: MapPin, label: 'Endereço', val: clientDb?.address || 'Não informado' },
                { icon: MapPin, label: 'Cidade', val: clientDb?.city || 'Não informado' }
            ] 
          }
        : {
            name: businessProfile.name,
            photoUrl: businessProfile.photoUrl,
            sub: 'Canal Oficial',
            details: [
                { icon: Clock, label: 'Horário', val: businessProfile.openingHours },
                { icon: Phone, label: 'Telefone', val: businessProfile.phone },
                { icon: Mail, label: 'Email', val: businessProfile.email },
                { icon: MapPin, label: 'Endereço', val: `${businessProfile.address || ''}, ${businessProfile.number || ''} - ${businessProfile.neighborhood || ''}` },
                { icon: MapPin, label: 'Cidade', val: `${businessProfile.city || ''} - ${businessProfile.zipCode || ''}` }
            ]
        };

    const handleSend = () => { sendMessage(inputText); setInputText(''); };
    
    const handleOpenAcordoWithItems = (orderItems) => {
        const mappedItems = orderItems.map(item => ({
            id: item.id,
            name: item.title,
            quantity: item.quantity,
            unitPrice: item.price
        }));
        setAcordoInitialItems(mappedItems);
        setShowAcordoModal(true);
    };

    return (
        <div className="flex flex-col h-full bg-[#E5DDD5] relative">
            <input type="file" ref={imageInputRef} accept="image/*" className="hidden" style={{display: 'none'}} onChange={handleImageChange} />
            <input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx" className="hidden" style={{display: 'none'}} onChange={handleFileChange} />

            <header className="bg-[#005C99] text-white p-3 shadow-md flex items-center gap-3 relative z-20">
                {isPro && <button onClick={() => setCurrentScreen('home')}><ChevronLeft/></button>}
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sm font-bold overflow-hidden border-2 border-white/30">
                    {isPro ? (clientDb?.photoUrl ? <img src={clientDb.photoUrl} className="w-full h-full object-cover"/> : <span className="text-[#005C99]">C</span>) : <Store className="text-[#005C99]" size={20} />}
                </div>
                <div className="flex-1 cursor-pointer" onClick={() => setShowProfileInfo(true)}>
                    <h3 className="font-bold leading-tight text-sm">{isPro ? (clientDb?.name || 'Cliente') : businessProfile.name}</h3>
                    {!isPro && <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span><span className="text-xs opacity-90">Aberto Agora</span></div>}
                </div>
                <button onClick={() => setShowProfileInfo(true)} className="p-2 hover:bg-white/10 rounded-full"><Info size={20}/></button>
                
                {/* WhatsApp Integration Button for Pro */}
                {isPro && clientDb?.phone && (
                    <button 
                        onClick={() => {
                            const message = `Olá, acesse nosso canal oficial: canaloficial/${businessProfile.username}`;
                            const link = `https://wa.me/${clientDb.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
                            window.open(link, '_blank');
                        }}
                        className="p-2 hover:bg-white/10 rounded-full"
                        title="Chamar no WhatsApp"
                    >
                        <MessageCircle size={20} />
                    </button>
                )}

                {!isPro && <button onClick={() => setCurrentScreen('login')}><LogOut size={20}/></button>}
            </header>

            {/* Blocked UI or Input */}
            {isClientBlocked ? (
                <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
                      <div className="text-center">
                          <div className="bg-red-100 p-4 rounded-full inline-block mb-4"><AlertCircle size={40} className="text-red-500"/></div>
                          <h3 className="text-xl font-bold text-slate-800 mb-2">Atendimento Encerrado</h3>
                          <p className="text-slate-500 max-w-xs mx-auto mb-6">Nosso horário de atendimento acabou. Retorne amanhã para falar conosco.</p>
                          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-xs mx-auto">
                              <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2 mb-2">
                                  <span className="text-slate-500 flex items-center gap-2"><Clock size={16}/> Horário</span>
                                  <span className="font-bold text-slate-800">{businessProfile.openingHours}</span>
                              </div>
                              <div className="text-xs text-slate-400 text-center">Agradecemos a compreensão</div>
                          </div>
                      </div>
                </div>
            ) : (
                <>
                {showProfileInfo && (
                <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowProfileInfo(false)}>
                    <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden animate-slide-up" onClick={e => e.stopPropagation()}>
                        <div className="h-24 bg-[#005C99] relative">
                             <button onClick={() => setShowProfileInfo(false)} className="absolute top-2 right-2 p-2 text-white/80 hover:text-white"><X size={20}/></button>
                             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full p-1 shadow-lg">
                                 <div className="w-full h-full bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                                      {modalData.photoUrl ? <img src={modalData.photoUrl} className="w-full h-full object-cover"/> : <User className="text-gray-400"/>}
                                 </div>
                             </div>
                        </div>
                        <div className="pt-12 pb-6 px-6 text-center">
                            <h3 className="font-bold text-xl text-gray-800">{modalData.name}</h3>
                            <p className="text-sm text-gray-500 mb-6">{modalData.sub}</p>
                            <div className="space-y-4 text-left max-h-60 overflow-y-auto">
                                {modalData.details.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                        <item.icon size={18} className="text-[#005C99] flex-shrink-0"/>
                                        <div className="flex-1"><p className="font-bold text-xs text-gray-400 uppercase">{item.label}</p><p className="break-words">{item.val}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser?.id;
                    const data = msg.orcamento || msg.acordo;

                    if (data) {
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className="bg-white rounded-lg shadow w-72 border border-[#00BFA5] overflow-hidden">
                                    <div className="bg-[#00BFA5] p-2 text-white font-bold text-xs uppercase flex gap-2"><FileText size={14}/> Orçamento</div>
                                    <div className="p-3">
                                        <h4 className="font-bold">{data.title}</h4>
                                        <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">{data.items?.map(i => <div key={i.id}>{i.quantity}x {i.name}</div>)}</div>
                                        <div className="flex justify-between mt-2 font-bold text-[#005C99]"><span>TOTAL</span><span>R$ {data.totalValue.toFixed(2)}</span></div>
                                    </div>
                                    <div className="bg-gray-50 p-2 flex justify-center"><button onClick={()=>downloadCombinadoPDF(data)} className="text-xs flex gap-1 items-center text-gray-500"><Download size={12}/> Baixar PDF</button></div>
                                </div>
                            </div>
                        );
                    }

                    if (msg.type === 'order' && msg.orderItems) {
                        const total = msg.orderItems.reduce((a,b) => a + (b.price * b.quantity), 0);
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className="bg-white rounded-xl shadow-md overflow-hidden w-72 border border-gray-200">
                                    <div className="bg-[#005C99] p-3 flex items-center gap-2 text-white"><ShoppingBag size={18} /><span className="font-bold text-sm uppercase">Novo Pedido</span></div>
                                    <div className="p-3 bg-gray-50 text-sm space-y-2">
                                        {msg.orderItems.map((item, idx) => (
                                            <div key={idx} className="flex justify-between border-b border-gray-100 pb-1 last:border-0">
                                                <span className="text-gray-600">{item.quantity}x {item.title}</span>
                                                <span className="font-bold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between pt-2 border-t border-gray-200 mt-2"><span className="font-bold text-gray-800">TOTAL</span><span className="font-bold text-[#005C99] text-lg">R$ {total.toFixed(2)}</span></div>
                                    </div>
                                    {isPro && (<div className="p-2 bg-white"><button onClick={() => handleOpenAcordoWithItems(msg.orderItems || [])} className="w-full py-2 bg-[#00BFA5] text-white rounded-lg text-xs font-bold hover:bg-teal-600">Fechar Negócio (Gerar Orçamento)</button></div>)}
                                </div>
                            </div>
                        )
                    }

                    if (msg.type === 'image') {
                        return (
                             <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-1 rounded-lg shadow-sm max-w-[70%] ${isMe ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                                    <img src={msg.fileUrl} alt="sent" className="rounded-lg mb-1 w-full h-auto" />
                                </div>
                            </div>
                        )
                    }

                    if (msg.type === 'file') {
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg shadow-sm flex items-center gap-3 max-w-[80%] ${isMe ? 'bg-[#dcf8c6]' : 'bg-white'}`}>
                                    <div className="bg-red-500 p-2 rounded text-white">
                                        <FileText size={20} />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-800 break-all truncate">{msg.fileName}</p>
                                        <p className="text-xs text-gray-500">Documento</p>
                                        <button onClick={() => downloadFile(msg.fileUrl, msg.fileName)} className="text-[10px] text-blue-600 hover:underline flex items-center gap-1 mt-1">
                                            <Download size={10}/> Baixar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    
                    if (msg.type === 'auto_reply') {
                        return (
                            <div key={msg.id} className="flex justify-center my-4">
                                <div className="bg-orange-100 text-orange-800 text-xs px-4 py-2 rounded-full shadow-sm flex items-center gap-2 whitespace-pre-line text-center">
                                    {msg.content}
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] px-4 py-2 rounded-lg text-sm shadow-sm ${isMe ? 'bg-[#dcf8c6]' : 'bg-white'}`}>{msg.content}</div>
                        </div>
                    );
                })}
            </div>

            <div className="p-2 bg-white flex items-center gap-2">
                {isPro && <button onClick={() => setShowAcordoModal(true)} className="p-2 text-[#00BFA5]"><FileText/></button>}
                
                <button onClick={() => { setShowEmojis(!showEmojis); setShowAttachments(false); }} className={`p-2 rounded-full transition-colors ${showEmojis ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:bg-gray-100'}`}><Smile size={24}/></button>

                <button onClick={() => { setShowAttachments(!showAttachments); setShowEmojis(false); }} className={`p-2 rounded-full transition-colors ${showAttachments ? 'bg-gray-200 text-gray-800' : 'text-gray-400 hover:bg-gray-100'}`}><Paperclip size={24}/></button>

                <input className="flex-1 p-2 bg-gray-100 rounded-full" value={inputText} onChange={e=>setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} onFocus={() => { setShowAttachments(false); setShowEmojis(false); }} placeholder="Digite uma mensagem" />
                <button onClick={handleSend} className="p-3 bg-[#005C99] text-white rounded-full"><Send size={18}/></button>
            </div>

            {(showAttachments || showEmojis) && (
                <div className="mx-4 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-slide-up z-10">
                    {showAttachments && (
                        <div className="flex gap-4 justify-around">
                            <button onClick={triggerImageUpload} className="flex flex-col items-center gap-2 group"><div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center"><ImageIcon size={24}/></div><span className="text-xs font-bold text-gray-600">Foto</span></button>
                            <button onClick={triggerFileUpload} className="flex flex-col items-center gap-2 group"><div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center"><File size={24}/></div><span className="text-xs font-bold text-gray-600">PDF</span></button>
                        </div>
                    )}
                    {showEmojis && (
                        <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto">
                            {emojis.map((emoji, idx) => (<button key={idx} onClick={() => addEmoji(emoji)} className="text-3xl hover:bg-gray-100 p-2 rounded">{emoji}</button>))}
                        </div>
                    )}
                </div>
            )}

            {showAcordoModal && <CreateAcordoModal initialItems={acordoInitialItems} onClose={() => { setShowAcordoModal(false); setAcordoInitialItems([]); }} onSend={(data) => { sendMessage("Orçamento gerado:", 'orcamento', { orcamento: data }); setShowAcordoModal(false); setAcordoInitialItems([]); }} />}
            </>
            )}
        </div>
    );
};

export default ChatScreen;