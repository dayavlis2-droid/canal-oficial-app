import React, { useState, useEffect } from 'react';
import { DEFAULT_PRO_USER, DEFAULT_CLIENT_USER, INITIAL_BUSINESS_PROFILE, INITIAL_CATALOG } from './utils/data';

// Importando componentes
import AuthScreen from './components/AuthScreen';
import ClientLandingScreen from './components/ClientLandingScreen';
import ClientCatalogScreen from './components/ClientCatalogScreen';
import ProCatalogScreen from './components/ProCatalogScreen';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import SettingsScreen from './components/SettingsScreen';
import AgreementsScreen from './components/AgreementsScreen';

export default function App() {
  const [proDb, setProDb] = useState(DEFAULT_PRO_USER);
  const [clientDb, setClientDb] = useState(DEFAULT_CLIENT_USER); 
  const [businessProfile, setBusinessProfile] = useState(INITIAL_BUSINESS_PROFILE);
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [messages, setMessages] = useState([
    { id: '1', senderId: 'cli1', content: 'Olá, gostaria de um orçamento.', type: 'text', timestamp: new Date(Date.now() - 1000000) },
    { id: '2', senderId: 'pro1', content: 'Claro! Vou preparar para você.', type: 'text', timestamp: new Date(Date.now() - 900000) },
  ]);

  const [currentUserId, setCurrentUserId] = useState(null);
  const [workStatus, setWorkStatus] = useState('open');
  const [breakReturn, setBreakReturn] = useState('');
  const [blockMessagesOffline, setBlockMessagesOffline] = useState(false); 
  const [queuePosition, setQueuePosition] = useState(3);
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [unreadCount, setUnreadCount] = useState(0);

  const currentUser = currentUserId === 'pro1' ? proDb : (currentUserId === 'cli1' ? clientDb : null);

  // --- CARREGAR DADOS DO BANCO AO INICIAR ---
  useEffect(() => {
    // Busca as configurações do usuário ID 2 (Fixo para este teste)
    fetch('http://localhost:5000/settings/2')
      .then(res => res.json())
      .then(data => {
        if (data && data.business_name) {
           // Mapeia os dados do Banco (snake_case) para o Frontend (camelCase)
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

      const welcomeMsg = {
          id: 'welcome-' + Date.now(),
          senderId: 'pro1', 
          content: messageContent,
          type: 'text',
          timestamp: new Date()
      };
      setMessages(prev => [...prev, welcomeMsg]);
      setCurrentScreen('chat'); 
  };
   
  const handleClientGoToCatalog = (name, phone) => { setClientDb({...clientDb, name, phone}); setCurrentUserId('cli1'); setCurrentScreen('client_catalog'); };
  
  const handleSendOrder = (cartItems) => { 
      const messageContent = businessProfile.welcomeMessage || `Olá! Este é o canal oficial de comunicação da ${businessProfile.name}.\n\n⏰ Horário de atendimento: ${businessProfile.openingHours}\n\nRecebemos seu pedido! Por favor, confirme seu nome e telefone.`;

      const welcomeMsg = {
          id: 'welcome-' + Date.now(),
          senderId: 'pro1',
          content: messageContent,
          type: 'text',
          timestamp: new Date()
      };

      const orderMsg = { id: Date.now().toString(), senderId: 'cli1', content: 'Realizei um pedido.', type: 'order', timestamp: new Date(), orderItems: cartItems };
      setMessages(prev => [...prev, welcomeMsg, orderMsg]); 
      setCurrentScreen('chat'); 
  };

  const handleLogout = () => { setCurrentUserId(null); setCurrentScreen('login'); };

  const sendMessage = async (content, type = 'text', extra) => {
      if (!currentUser) return;

      const newMessage = { 
        id: Date.now().toString(), 
        senderId: currentUser.id, 
        content, 
        type, 
        timestamp: new Date(), 
        ...extra 
      };
      setMessages(prev => [...prev, newMessage]);

      try {
          const senderRole = currentUser.role === 'profissional' ? 'me' : 'client';
          const idParaSalvar = 2; 

          await fetch('http://localhost:5000/messages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  content: content,
                  sender: senderRole,
                  contact_id: idParaSalvar
              }),
          });
      } catch (error) {
          console.error("❌ Erro ao enviar para o servidor:", error);
      }
  };

  const downloadCombinadoPDF = (data) => {
      const content = `
========= ACORDO / ORÇAMENTO =========
EMPRESA: ${businessProfile.name}
-----------------------------------------
Título: ${data.title}
Valor Total: R$ ${data.totalValue.toFixed(2)}
Prazo: ${data.deadline}
Telefone Cliente: ${data.clientPhone || 'N/A'}
CPF Cliente: ${data.cpf || 'N/A'}
-----------------------------------------
ITENS DO PEDIDO:
${data.items.map(i => `- ${i.quantity}x ${i.name} (R$ ${i.unitPrice.toFixed(2)})`).join('\n')}
-----------------------------------------
Pagamento: ${data.payment} ${data.installments ? `(${data.installments}x)` : ''}
Observações: ${data.notes}
=========================================
Gerado via App CanalOficial
      `.trim();

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orcamento_${data.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    // AJUSTE DE LAYOUT: Removido 'max-w-md' e adicionado 'w-full md:max-w-6xl' para desktop
    <div className="h-screen bg-white shadow-2xl overflow-hidden font-sans text-gray-800 w-full md:max-w-6xl mx-auto border-x border-gray-100 flex flex-col">
        {currentScreen === 'login' && (
            <div className="h-full relative w-full">
                <AuthScreen onLogin={handleLogin} businessProfile={businessProfile} onClientLogin={handleClientStart} />
                <div className="absolute bottom-6 left-0 right-0 text-center"><button onClick={() => setCurrentScreen('client_landing')} className="text-xs text-gray-400 underline">Modo Demo Cliente</button></div>
            </div>
        )}
        {currentScreen === 'client_landing' && <ClientLandingScreen businessProfile={businessProfile} onStartChat={handleClientStart} onGoToCatalog={handleClientGoToCatalog} />}
        {currentScreen === 'client_catalog' && <ClientCatalogScreen catalog={catalog} onSendOrder={handleSendOrder} setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'pro_catalog' && <ProCatalogScreen catalog={catalog} setCatalog={setCatalog} setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'home' && <HomeScreen currentUser={currentUser} workStatus={workStatus} setWorkStatus={setWorkStatus} setBreakReturn={setBreakReturn} businessProfile={businessProfile} messages={messages} setCurrentScreen={setCurrentScreen} handleLogout={handleLogout} unreadCount={unreadCount} clientDb={clientDb} />}
        {currentScreen === 'chat' && <ChatScreen messages={messages} currentUser={currentUser} businessProfile={businessProfile} clientDb={clientDb} sendMessage={sendMessage} downloadCombinadoPDF={downloadCombinadoPDF} setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'settings' && <SettingsScreen currentUser={currentUser} businessProfile={businessProfile} setBusinessProfile={setBusinessProfile} blockMessagesOffline={blockMessagesOffline} setBlockMessagesOffline={setBlockMessagesOffline} setCurrentScreen={setCurrentScreen} />}
        {currentScreen === 'agreements' && <AgreementsScreen messages={messages} setCurrentScreen={setCurrentScreen} downloadCombinadoPDF={downloadCombinadoPDF} />}
    </div>
  );
}
