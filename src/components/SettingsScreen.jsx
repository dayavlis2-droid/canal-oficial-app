import React, { useState } from 'react';
import { ChevronLeft, Store, Camera, Save } from 'lucide-react';

const SettingsScreen = ({ currentUser, businessProfile, setBusinessProfile, setBlockMessagesOffline, blockMessagesOffline, setCurrentScreen }) => {
    const [isSaving, setIsSaving] = useState(false);

    const handleProPhotoUpdate = (e) => {
        const file = e.target.files?.[0];
        if (file) {
             const reader = new FileReader();
             reader.onload = (ev) => {
                 setBusinessProfile({...businessProfile, photoUrl: ev.target?.result});
             };
             reader.readAsDataURL(file);
        }
    };

    // --- FUNÇÃO PARA SALVAR NO BANCO ---
    const handleSaveSettings = async () => {
        setIsSaving(true);
        try {
            const backendData = {
                business_name: businessProfile.name,
                custom_link: businessProfile.username,
                phone: businessProfile.phone,
                email_contact: businessProfile.email,
                cnpj: businessProfile.cnpj,
                zip_code: businessProfile.zipCode,
                city: businessProfile.city,
                street: businessProfile.address,
                number: businessProfile.number,
                neighborhood: businessProfile.neighborhood,
                opening_hours: businessProfile.openingHours,
                welcome_message: businessProfile.welcomeMessage,
                logo_url: businessProfile.photoUrl
            };

            // CORREÇÃO AQUI: Removidos os "..." e ajustada a sintaxe do fetch
            const response = await fetch('https://canal-oficial-app.onrender.com/settings/2', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(backendData)
            });

            if (response.ok) {
                alert("Configurações salvas com sucesso!");
            } else {
                alert("Erro ao salvar.");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro de conexão ao salvar.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
             <header className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => setCurrentScreen('home')}><ChevronLeft/></button>
                    <h2 className="font-bold text-lg">Configurações</h2>
                </div>
                {/* BOTÃO DE SALVAR */}
                <button 
                    onClick={handleSaveSettings} 
                    disabled={isSaving}
                    className="bg-[#005C99] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-800 disabled:opacity-50"
                >
                    <Save size={16} /> {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
             </header>

             <div className="p-4 space-y-6 overflow-y-auto pb-20">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h3 className="font-bold text-[#005C99] mb-4 flex items-center gap-2"><Store size={18}/> Perfil do Negócio</h3>
                      <div className="flex items-center gap-4 mb-4">
                           <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden relative group cursor-pointer border-2 border-dashed border-gray-300">
                               {businessProfile.photoUrl ? (
                                   <img src={businessProfile.photoUrl} alt="Logo da Empresa" className="w-full h-full object-cover"/>
                               ) : (
                                   <Camera size={24} className="m-auto mt-5"/>
                               )}
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleProPhotoUpdate}/>
                           </div>
                           <div className="text-xs text-gray-400">Toque na foto para alterar</div>
                      </div>
                      <div className="space-y-3">
                          <input value={businessProfile.name} onChange={(e) => setBusinessProfile({...businessProfile, name: e.target.value})} className="w-full p-2 border rounded" placeholder="Nome da Empresa"/>
                          <input value={businessProfile.username} onChange={(e) => setBusinessProfile({...businessProfile, username: e.target.value})} className="w-full p-2 border rounded" placeholder="Link (Slug)"/>
                          <input value={businessProfile.phone} onChange={(e) => setBusinessProfile({...businessProfile, phone: e.target.value})} className="w-full p-2 border rounded" placeholder="Telefone"/>
                          <input value={businessProfile.email} onChange={(e) => setBusinessProfile({...businessProfile, email: e.target.value})} className="w-full p-2 border rounded" placeholder="Email"/>
                          <input value={businessProfile.cnpj || ''} onChange={(e) => setBusinessProfile({...businessProfile, cnpj: e.target.value})} className="w-full p-2 border rounded" placeholder="CNPJ (Opcional)"/>
                          
                          <div className="grid grid-cols-2 gap-2">
                              <input value={businessProfile.zipCode || ''} onChange={(e) => setBusinessProfile({...businessProfile, zipCode: e.target.value})} className="w-full p-2 border rounded" placeholder="CEP"/>
                              <input value={businessProfile.city} onChange={(e) => setBusinessProfile({...businessProfile, city: e.target.value})} className="w-full p-2 border rounded" placeholder="Cidade"/>
                          </div>
                          <input value={businessProfile.address} onChange={(e) => setBusinessProfile({...businessProfile, address: e.target.value})} className="w-full p-2 border rounded" placeholder="Endereço"/>
                          <div className="grid grid-cols-2 gap-2">
                              <input value={businessProfile.number || ''} onChange={(e) => setBusinessProfile({...businessProfile, number: e.target.value})} className="w-full p-2 border rounded" placeholder="Número"/>
                              <input value={businessProfile.neighborhood || ''} onChange={(e) => setBusinessProfile({...businessProfile, neighborhood: e.target.value})} className="w-full p-2 border rounded" placeholder="Bairro"/>
                          </div>
                          
                          <input value={businessProfile.openingHours} onChange={(e) => setBusinessProfile({...businessProfile, openingHours: e.target.value})} className="w-full p-2 border rounded" placeholder="Horário de Funcionamento"/>
                          
                          <div className="mt-4">
                            <label className="text-xs text-gray-500 font-bold uppercase mb-1">Mensagem de Boas-vindas</label>
                            <textarea 
                                value={businessProfile.welcomeMessage || ''} 
                                onChange={(e) => setBusinessProfile({...businessProfile, welcomeMessage: e.target.value})} 
                                className="w-full p-2 border rounded h-24 text-sm" 
                                placeholder="Digite a mensagem inicial para seus clientes..." 
                            />
                            <p className="text-xs text-gray-400 mt-1">Se deixar vazio, usaremos a mensagem padrão.</p>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                      <h3 className="font-bold text-[#005C99] mb-4">Comportamento Offline</h3>
                      <div className="space-y-3">
                          <label className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${!blockMessagesOffline ? 'border-[#005C99] bg-blue-50' : 'border-gray-100'}`}>
                              <input type="radio" name="mode" checked={!blockMessagesOffline} onChange={() => setBlockMessagesOffline(false)} className="mt-1 accent-[#005C99]" />
                              <div className="ml-3">
                                  <span className="font-bold block text-sm text-[#005C99]">Agendar (Silencioso)</span>
                                  <span className="text-xs text-gray-500">Recebe mensagens mas avisa que responderá depois.</span>
                              </div>
                          </label>
                          <label className={`flex items-start p-3 rounded-xl border-2 cursor-pointer transition-all ${blockMessagesOffline ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}>
                              <input type="radio" name="mode" checked={blockMessagesOffline} onChange={() => setBlockMessagesOffline(true)} className="mt-1 accent-red-500" />
                              <div className="ml-3">
                                  <span className="font-bold block text-sm text-red-600">Bloquear Mensagens</span>
                                  <span className="text-xs text-gray-500">Cliente vê aviso e não consegue enviar nada.</span>
                              </div>
                          </label>
                      </div>
                  </div>
             </div>
        </div>
    );
};

export default SettingsScreen;