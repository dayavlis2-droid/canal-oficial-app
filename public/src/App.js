import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';

// Importando componentes
import AuthScreen from './components/AuthScreen';
import ClientLandingScreen from './components/ClientLandingScreen';
import ClientCatalogScreen from './components/ClientCatalogScreen';
import ProCatalogScreen from './components/ProCatalogScreen';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import SettingsScreen from './components/SettingsScreen';
import AgreementsScreen from './components/AgreementsScreen';

// --- DADOS FIXOS (Para não precisar da pasta utils) ---
const DEFAULT_PRO_USER = { 
    id: 'pro1', name: 'Carlos Vendas', role: 'profissional', email: 'carlos@canaloficial.com', phone: '(11) 99999-8888', username: 'carlosvendas'
};

const DEFAULT_CLIENT_USER = { 
    id: 'cli1', name: 'Maria Cliente', role: 'cliente', email: 'maria@gmail.com', photoUrl: null, phone: '(11) 98765-4321', address: 'Rua das Flores, 50', city: 'São Paulo - SP'
};

const INITIAL_BUSINESS_PROFILE = {
  name: "Carlos Soluções", 
  username: "carlosvendas", 
  photoUrl: null, 
  phone: "(11) 99999-8888", 
  email: "contato@canaloficial.com", 
  cnpj: "",
  address: "Rua do Comércio", 
  number: "123",
  neighborhood: "Centro",
  zipCode: "01000-000",
  city: "São Paulo - SP", 
  openingHours: "Seg a Sex: 09:00 às 18:00",
  welcomeMessage: ""
};

const INITIAL_CATALOG = [
    { id: '1', title: 'Consultoria Básica', price: 150.00, description: '1 hora de análise técnica.' },
    { id: '2', title: 'Manutenção Preventiva', price: 300.00, description: 'Limpeza e ajustes.' },
];

export default function App() {
  const [proDb] = useState(DEFAULT_PRO_USER);
  const [clientDb, setClientDb] = useState(DEFAULT_CLIENT_USER); 
  const [businessProfile, setBusinessProfile] = useState(INITIAL_BUSINESS_PROFILE);
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [messages, setMessages] = useState([
    { id: '1', senderId: 'cli1', content: 'Olá, gostaria de um orçamento.', type: 'text', timestamp: new Date(Date.now() - 1000000) },
    { id: '2', senderId: 'pro1', content: 'Claro! Vou preparar para você.', type: 'text', timestamp: new Date(Date.now() - 900000) },
  ]);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [workStatus, setWorkStatus] = useState('open');
  const [setBreakReturn] = useState(''); 
  const [blockMessagesOffline, setBlockMessagesOffline] = useState(false); 
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [unreadCount] = useState(0); 

  const currentUser = currentUserId === 'pro1' ? proDb : (currentUserId === 'cli1' ? clientDb : null);
  const isProLoggedIn = currentUserId === 'pro1';

  // --- CARREGAR DADOS DO BANCO (Configurações) ---
  useEffect(() => {
    fetch('https://canal-oficial-app.onrender.com/settings/2')
      .then(res => res.json())
      .then(data => {
        if (data && data.business_name) {
           setBusinessProfile(prev => ({
               ...prev,
               name: data.business_name,
               username: data.custom_link || prev.username,
               phone: data.phone || prev.phone,
               email: data.email_contact || prev.email,
               cnpj: data.cnpj || '',
               address: data.street || '',
               number: data.number || '',
               neighborhood: data.neighborhood || '',
               zipCode: data.zip_code || '',
               city: data.city || '',
               openingHours: data.opening_hours || prev.openingHours,
               welcomeMessage: data.welcome_message || '',
               photoUrl: data.logo_url || prev.photoUrl
           }));
        }
      })
      .catch(err => console.error("Erro ao carregar perfil:", err));
  }, []);

  const handleLogin = () => { setCurrentUserId('pro1'); setCurrentScreen('home'); };
  
  const handleClientStart = (name, phone) => { 
      setClientDb({...clientDb, name, phone}); 
      setCurrentUserId('cli1'); 
      const messageContent = businessProfile.welcomeMessage || `Olá! Este é o canal oficial de comunicação da ${businessProfile.name}.\n\n⏰ Horário de atendimento: ${businessProfile.openingHours}\n\nPor favor, informe seu nome e telefone para prosseguirmos.`;
      const welcomeMsg = { id: 'welcome-' + Date.now(), senderId: 'pro1', content: messageContent, type: 'text', timestamp: new Date() };
      setMessages(prev => [...prev, welcomeMsg]);
      setCurrentScreen('chat'); 
  };
   
  const handleClientGoToCatalog = (name, phone) => { setClientDb({...clientDb, name, phone}); setCurrentUserId('cli1'); setCurrentScreen('client_catalog'); };
  
  const handleSendOrder = (cartItems) => { 
      const messageContent = businessProfile.welcomeMessage || `Olá! Este é o canal oficial de comunicação da ${businessProfile.name}.\n\n⏰ Horário de atendimento: ${businessProfile.openingHours}\n\nRecebemos seu pedido! Por favor, confirme seu nome e telefone.`;
      const welcomeMsg = { id: 'welcome-' + Date.now(), senderId: 'pro1', content: messageContent, type: 'text', timestamp: new Date() };
      const orderMsg = { id: Date.now().toString(), senderId: 'cli1', content: 'Realizei um pedido.', type: 'order', timestamp: new Date(), orderItems: cartItems };
      setMessages(prev => [...prev, welcomeMsg, orderMsg]); 
      setCurrentScreen('chat'); 
  };

  const handleLogout = () => { setCurrentUserId(null); setCurrentScreen('login'); };

  const sendMessage = async (content, type = 'text', extra) => {
      if (!currentUser) return;
      const newMessage = { id: Date.now().toString(), senderId: currentUser.id, content, type, timestamp: new Date(), ...extra };
      setMessages(prev => [...prev, newMessage]);

      try {
          const senderRole = currentUser.role === 'profissional' ? 'me' : 'client';
          const idParaSalvar = 2; 

          await fetch('https://canal-oficial-app.onrender.com/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ content: content, sender: senderRole, contact_id: idParaSalvar }),
          });
      } catch (error) {
          console.error("❌ Erro ao enviar para o servidor:", error);
      }
  };

  const downloadCombinadoPDF = (data) => {
      const content = `ORÇAMENTO - ${businessProfile.name}\nItem: ${data.title}\nTotal: R$ ${data.totalValue.toFixed(2)}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orcamento.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  // --- COMPONENTE DE RENDERIZAÇÃO DA TELA ATUAL ---
  const renderScreen = () => {
      switch(currentScreen) {
          case 'home': return <HomeScreen currentUser={currentUser} workStatus={workStatus} setWorkStatus={setWorkStatus} setBreakReturn={setBreakReturn} businessProfile={businessProfile} messages={messages} setCurrentScreen={setCurrentScreen} handleLogout={handleLogout} unreadCount={unreadCount} clientDb={clientDb} />;
          case 'chat': return <ChatScreen messages={messages} currentUser={currentUser} businessProfile={businessProfile} clientDb={clientDb} sendMessage={sendMessage} downloadCombinadoPDF={downloadCombinadoPDF} setCurrentScreen={setCurrentScreen} />;
          case 'settings': return <SettingsScreen currentUser={currentUser} businessProfile={businessProfile} setBusinessProfile={setBusinessProfile} setBlockMessagesOffline={setBlockMessagesOffline} blockMessagesOffline={blockMessagesOffline} setCurrentScreen={setCurrentScreen} />;
          case 'agreements': return <AgreementsScreen messages={messages} setCurrentScreen={setCurrentScreen} downloadCombinadoPDF={downloadCombinadoPDF} />;
          case 'pro_catalog': return <ProCatalogScreen catalog={catalog} setCatalog={setCatalog} setCurrentScreen={setCurrentScreen} />;
          default: return null;
      }
  };

  // --- LAYOUTS ---
  if (!isProLoggedIn) {
      return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-white shadow-xl rounded-2xl overflow-hidden h-[85vh] border border-gray-100">
                  {currentScreen === 'login' && (
                      <div className="h-full relative">
                          <AuthScreen onLogin={handleLogin} businessProfile={businessProfile} />
                          <div className="absolute bottom-6 left-0 right-0 text-center"><button onClick={() => setCurrentScreen('client_landing')} className="text-xs text-gray-400 underline">Modo Demo Cliente</button></div>
                      </div>
                  )}
                  {currentScreen === 'client_landing' && <ClientLandingScreen businessProfile={businessProfile} onStartChat={handleClientStart} onGoToCatalog={handleClientGoToCatalog} />}
                  {currentScreen === 'client_catalog' && <ClientCatalogScreen catalog={catalog} onSendOrder={handleSendOrder} setCurrentScreen={setCurrentScreen} />}
                  {(currentUserId && currentUserId !== 'pro1' && currentScreen === 'chat') && 
                      <ChatScreen messages={messages} currentUser={currentUser} businessProfile={businessProfile} clientDb={clientDb} sendMessage={sendMessage} downloadCombinadoPDF={downloadCombinadoPDF} setCurrentScreen={setCurrentScreen} />
                  }
              </div>
          </div>
      );
  }

  // Layout Profissional (Responsivo)
  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
        <div className={`
            flex-col bg-white border-r border-gray-200 z-10 transition-all duration-300
            ${currentScreen === 'home' ? 'flex w-full' : 'hidden md:flex'} 
            md:w-1/3 lg:w-1/4 md:min-w-[320px]
        `}>
            <HomeScreen 
                currentUser={currentUser} 
                workStatus={workStatus} 
                setWorkStatus={setWorkStatus} 
                setBreakReturn={setBreakReturn} 
                businessProfile={businessProfile} 
                messages={messages} 
                setCurrentScreen={setCurrentScreen} 
                handleLogout={handleLogout} 
                unreadCount={unreadCount} 
                clientDb={clientDb} 
            />
        </div>

        <div className={`
            flex-1 bg-slate-50 relative flex-col
            ${currentScreen === 'home' ? 'hidden md:flex' : 'flex w-full'}
        `}>
            {currentScreen === 'home' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#f0f2f5]">
                    <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                        <MessageSquare size={64} className="text-[#005C99] opacity-50" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-600">Canal Oficial Web</h2>
                    <p className="text-sm mt-2">Gerencie seus atendimentos e orçamentos por aqui.</p>
                </div>
            ) : (
                <div className="h-full w-full max-w-5xl mx-auto bg-white shadow-sm md:border-x border-gray-100 md:my-0">
                    {renderScreen()}
                </div>
            )}
        </div>
    </div>
  );
}