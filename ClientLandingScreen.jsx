import React, { useState } from 'react';
import { Store, ShoppingBag, MessageSquare } from 'lucide-react';

const ClientLandingScreen = ({ businessProfile, onStartChat, onGoToCatalog }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const validateAndProceed = (action) => {
        if(!name.trim()) { alert("Digite seu nome"); return; }
        if(action === 'chat') onStartChat(name, phone); else onGoToCatalog(name, phone);
    };
    return (
        <div className="flex flex-col h-full bg-slate-50 p-8 justify-center items-center text-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl border-4 border-white">{businessProfile.photoUrl ? <img src={businessProfile.photoUrl} className="w-full h-full object-cover"/> : <Store className="text-[#005C99]" size={40}/>}</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{businessProfile.name}</h1>
            <div className="w-full bg-white p-6 rounded-2xl shadow-sm space-y-4">
                <input className="w-full p-3 border rounded-xl" placeholder="Seu Nome" value={name} onChange={e=>setName(e.target.value)}/>
                <input className="w-full p-3 border rounded-xl" placeholder="Seu WhatsApp" value={phone} onChange={e=>setPhone(e.target.value)}/>
                <button onClick={()=>validateAndProceed('catalog')} className="w-full bg-[#005C99] text-white py-4 rounded-xl font-bold flex justify-center gap-2"><ShoppingBag size={18}/> VER CATÁLOGO</button>
                <button onClick={()=>validateAndProceed('chat')} className="w-full bg-white text-[#005C99] border-2 border-[#005C99] py-3 rounded-xl font-bold flex justify-center gap-2"><MessageSquare size={18}/> FALAR COM ATENDENTE</button>
            </div>
        </div>
    );
};

export default ClientLandingScreen;