import React, { useState, useEffect } from 'react';
import { MessageSquare, ShieldCheck, Phone, Lock, ArrowRight } from 'lucide-react';

// Importando componentes que já existem e funcionam
import ClientLandingScreen from './components/ClientLandingScreen';
import ClientCatalogScreen from './components/ClientCatalogScreen';
import ProCatalogScreen from './components/ProCatalogScreen';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import SettingsScreen from './components/SettingsScreen';
import AgreementsScreen from './components/AgreementsScreen';

// --- COMPONENTE DE LOGIN INTERNO (Para evitar erros de arquivo) ---
const LoginInternal = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    setPhone(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 14 || password.length < 6) {
        alert("Preencha os dados corretamente.");
        return;
    }
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        onLogin(); 
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#2b5876] to-[#4e4376]">
      <div className="text-center mb-8 animate-fade-in-down">
        <div className="bg-white/10 p-4 rounded-full inline-block backdrop-blur-sm mb-4 border border-white/20 shadow-lg">
            <ShieldCheck size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white drop-shadow-md">Atendimento Seguro</h1>
        <p className="text-blue-100 mt-2 text-sm md:text-base font-light">
          Seu canal oficial de atendimento ao cliente
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                {isLoginView ? 'Bem-vindo!' : 'Crie sua conta'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600 pl-1">Celular</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Phone size={20} />
                        </div>
                        <input
                            type="tel"
                            placeholder="(99) 99999-9999"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600 pl-1">Senha</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 hover:bg-white"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all 
                    ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}`}
                >
                    {loading ? 'Entrando...' : (isLoginView ? 'Entrar Agora' : 'Cadastrar')}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </form>

            <div className="mt-6 text-center border-t border-gray-100 pt-4">
                <button 
                    onClick={() => setIsLoginView(!isLoginView)}
                    className="text-blue-600 font-bold hover:text-blue-800 text-sm"
                >
                    {isLoginView ? 'Não tem conta? Cadastre-se' : 'Já tenho conta? Entrar'}
                </button>
            </div>
        </div>
      </div>
      
      <div className="mt-8 text-center opacity-70">
        <p className="text-blue-200 text-[10px] mt-1">
            © 2024 Canal Oficial App v3.0 (Integrado)
        </p>
      </div>
    </div>
  );
};
// --- FIM DO COMPONENTE DE LOGIN ---

// --- DADOS FIXOS ---
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
  
  // MODO CLIENTE / LOGIN
  if (!isProLoggedIn) {
      return (
          <div className="fixed inset-0 w-full bg-gray-50 flex items-center justify-center md:static md:h-screen md:p-4">
              <div className="w-full h-full flex flex-col bg-white md:max-w-md md:h-[85vh] md:shadow-xl md:rounded-2xl md:border border-gray-100 overflow-hidden relative">
                  
                  {/* Container Flexível para o Conteúdo */}
                  <div className="flex-1 overflow-hidden relative flex flex-col">
                    {currentScreen === 'login' && (
                        <div className="h-full relative flex flex-col overflow-y-auto">
                            
                            {/* AQUI ESTÁ O SEGREDO: Usamos o componente interno */}
                            <LoginInternal onLogin={handleLogin} />

                            <div className="py-4 text-center shrink-0 bg-white absolute bottom-0 w-full">
                                <button onClick={() => setCurrentScreen('client_landing')} className="text-xs text-gray-400 underline">
                                    Modo Demo Cliente
                                </button>
                            </div>
                        </div>
                    )}
                    {currentScreen === 'client_landing' && <ClientLandingScreen businessProfile={businessProfile} onStartChat={handleClientStart} onGoToCatalog={handleClientGoToCatalog} />}
                    {currentScreen === 'client_catalog' && <ClientCatalogScreen catalog={catalog} onSendOrder={handleSendOrder} setCurrentScreen={setCurrentScreen} />}
                    {(currentUserId && currentUserId !== 'pro1' && currentScreen === 'chat') && 
                        <ChatScreen messages={messages} currentUser={currentUser} businessProfile={businessProfile} clientDb={clientDb} sendMessage={sendMessage} downloadCombinadoPDF={downloadCombinadoPDF} setCurrentScreen={setCurrentScreen} />
                    }
                  </div>
              </div>
          </div>
      );
  }

  // Layout Profissional (Full Screen Desktop / Mobile)
  return (
    <div className="fixed inset-0 bg-slate-100 flex overflow-hidden">
        <div className={`
            flex-col bg-white border-r border-gray-200 z-10 transition-all duration-300
            ${currentScreen === 'home' ? 'flex w-full' : 'hidden md:flex'} 
            md:w-1/3 lg:w-1/4 md:min-w-[320px] h-full
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
            flex-1 bg-slate-50 relative flex-col h-full
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
                <div className="h-full w-full max-w-5xl mx-auto bg-white shadow-sm md:border-x border-gray-100 md:my-0 flex flex-col overflow-hidden">
                    {renderScreen()}
                </div>
            )}
        </div>
    </div>
  );
}
