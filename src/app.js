import React, { useState, useEffect } from 'react';
import { MessageSquare, ShieldCheck, Phone, Lock, ArrowRight } from 'lucide-react';

// Seus componentes existentes
import ClientLandingScreen from './components/ClientLandingScreen';
import ClientCatalogScreen from './components/ClientCatalogScreen';
import ProCatalogScreen from './components/ProCatalogScreen';
import HomeScreen from './components/HomeScreen';
import ChatScreen from './components/ChatScreen';
import SettingsScreen from './components/SettingsScreen';
import AgreementsScreen from './components/AgreementsScreen';

const API_URL = 'http://localhost:5000'; 

// --- LOGIN POR CELULAR (DESIGN CORPORATIVO) ---
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 14 || password.length < 6) {
        alert("Preencha o celular corretamente.");
        return;
    }
    setLoading(true);

    const endpoint = isLoginView ? '/login' : '/register';

    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            if (isLoginView) {
                onLogin(data.user);
            } else {
                alert("Cadastro realizado! Faça login.");
                setIsLoginView(true);
            }
        } else {
            alert(data.error || "Erro na operação.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-slate-50 font-sans">
      <div className="text-center mb-10 z-10 animate-fade-in-down">
        <div className="bg-[#1e3a8a] p-4 rounded-2xl inline-flex mb-6 shadow-lg">
            <ShieldCheck size={40} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
          Atendimento Seguro
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-medium">
          Acesso Corporativo
        </p>
      </div>

      <div className="w-full max-w-[400px] bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="h-1.5 w-full bg-[#1e3a8a]"></div>
        <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 text-center mb-8">
                {isLoginView ? 'Acesso ao Painel' : 'Novo Cadastro'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Celular</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Phone size={18} />
                        </div>
                        <input
                            type="tel"
                            placeholder="(99) 99999-9999"
                            value={phone}
                            onChange={handlePhoneChange}
                            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase">Senha</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock size={18} />
                        </div>
                        <input
                            type="password"
                            placeholder="••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3.5 rounded-lg text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 transition-all mt-2
                    ${loading ? 'bg-slate-400' : 'bg-orange-500 hover:bg-orange-600'}`}
                >
                    {loading ? 'Validando...' : (isLoginView ? 'ENTRAR' : 'CADASTRAR')}
                    {!loading && <ArrowRight size={18} />}
                </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-100">
                <button 
                    onClick={() => setIsLoginView(!isLoginView)}
                    className="text-[#1e3a8a] font-bold hover:underline text-xs"
                >
                    {isLoginView ? 'Criar conta corporativa' : 'Voltar para login'}
                </button>
            </div>
        </div>
      </div>
      <p className="mt-8 text-slate-400 text-[10px] font-medium">© 2024 System v3.2 Enterprise</p>
    </div>
  );
};

// --- MOCK DATA ---
const DEFAULT_PRO_USER = { id: 'pro1', name: 'Carlos Vendas', role: 'profissional', email: 'carlos@canal.com', phone: '(11) 99999-8888' };
const DEFAULT_CLIENT_USER = { id: 'cli1', name: 'Maria Cliente', role: 'cliente', phone: '(11) 98765-4321' };
const INITIAL_BUSINESS_PROFILE = { name: "Carlos Soluções", welcomeMessage: "" };
const INITIAL_CATALOG = [{ id: '1', title: 'Item Exemplo', price: 100 }];

export default function App() {
  const [proDb, setProDb] = useState(DEFAULT_PRO_USER); 
  const [clientDb, setClientDb] = useState(DEFAULT_CLIENT_USER); 
  const [businessProfile, setBusinessProfile] = useState(INITIAL_BUSINESS_PROFILE);
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [messages, setMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [workStatus, setWorkStatus] = useState('open');
  // CORREÇÃO: Usando destructuring ignorando o primeiro elemento para evitar warning de 'unused var'
  const [, setBreakReturn] = useState(''); 
  const [blockMessagesOffline, setBlockMessagesOffline] = useState(false); 
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [unreadCount] = useState(0); 

  const currentUser = currentUserId === 'pro1' ? proDb : (currentUserId === 'cli1' ? clientDb : null);
  const isProLoggedIn = currentUserId === 'pro1';

  useEffect(() => {
    fetch(`${API_URL}/settings/2`).then(res => res.json())
      .then(data => { if(data.business_name) setBusinessProfile(prev => ({...prev, name: data.business_name})); })
      .catch(err => console.log("Sem backend ainda ou erro de conexão"));
  }, []);

  const handleLogin = (userData) => { 
      if(userData) setProDb(prev => ({...prev, ...userData}));
      setCurrentUserId('pro1'); 
      setCurrentScreen('home'); 
  };
  
  const handleClientStart = (name, phone) => { 
      setClientDb(prev => ({...prev, name, phone}));
      setCurrentUserId('cli1'); 
      setCurrentScreen('chat'); 
  };
  
  const handleClientGoToCatalog = (name, phone) => { 
      setClientDb(prev => ({...prev, name, phone}));
      setCurrentUserId('cli1'); 
      setCurrentScreen('client_catalog'); 
  };
  
  const handleSendOrder = (cart) => { 
      const msg = {id: Date.now(), content: `Pedido Enviado! (${cart.length} itens)`, type: 'text', senderId: 'cli1'};
      setMessages(prev => [...prev, msg]);
      setCurrentScreen('chat'); 
  };

  const handleLogout = () => { setCurrentUserId(null); setCurrentScreen('login'); };
  
  const sendMessage = async (content, type='text') => {
      setMessages(prev => [...prev, {id: Date.now(), content, type, senderId: currentUser.id}]);
  };
  
  const downloadCombinadoPDF = () => { alert("Baixando PDF..."); }; 

  const renderScreen = () => {
      switch(currentScreen) {
          case 'home': return <HomeScreen currentUser={currentUser} workStatus={workStatus} setWorkStatus={setWorkStatus} setBreakReturn={setBreakReturn} businessProfile={businessProfile} messages={messages} setCurrentScreen={setCurrentScreen} handleLogout={handleLogout} unreadCount={unreadCount} clientDb={clientDb} />;
          case 'chat': return <ChatScreen messages={messages} currentUser={currentUser} businessProfile={businessProfile} sendMessage={sendMessage} downloadCombinadoPDF={downloadCombinadoPDF} setCurrentScreen={setCurrentScreen} />;
          case 'settings': return <SettingsScreen currentUser={currentUser} businessProfile={businessProfile} setBusinessProfile={setBusinessProfile} setBlockMessagesOffline={setBlockMessagesOffline} blockMessagesOffline={blockMessagesOffline} setCurrentScreen={setCurrentScreen} />;
          // CORREÇÃO: Propriedade duplicada removida
          case 'agreements': return <AgreementsScreen messages={messages} setCurrentScreen={setCurrentScreen} downloadCombinadoPDF={downloadCombinadoPDF} />;
          case 'pro_catalog': return <ProCatalogScreen catalog={catalog} setCatalog={setCatalog} setCurrentScreen={setCurrentScreen} />;
          
          case 'client_landing': return <ClientLandingScreen businessProfile={businessProfile} onStartChat={handleClientStart} onGoToCatalog={handleClientGoToCatalog} />;
          case 'client_catalog': return <ClientCatalogScreen catalog={catalog} onSendOrder={handleSendOrder} setCurrentScreen={setCurrentScreen} />;
          
          default: return null;
      }
  };

  if (!isProLoggedIn) {
      return (
          <div className="fixed inset-0 w-full bg-slate-100 flex items-center justify-center md:static md:h-screen md:p-6">
             {currentScreen === 'login' ? (
                 <div className="w-full h-full flex flex-col items-center justify-center">
                    <LoginInternal onLogin={handleLogin} />
                    <button onClick={() => setCurrentScreen('client_landing')} className="mt-6 text-slate-400 hover:text-[#1e3a8a] transition-colors text-xs font-medium">
                        Acesso Cliente (Simulação)
                    </button>
                 </div>
             ) : (
                <div className="w-full h-full md:max-w-[480px] bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
                    {renderScreen()}
                </div>
             )} 
          </div>
      );
  }

  // --- LAYOUT PRINCIPAL (ESTILO CORPORATIVO) ---
  return (
    <div className="fixed inset-0 bg-slate-50 flex overflow-hidden font-sans text-slate-800">
        <div className={`flex-col bg-white border-r border-slate-200 z-20 shadow-sm
            ${currentScreen === 'home' ? 'flex w-full' : 'hidden md:flex'} 
            md:w-80 lg:w-[360px] transition-all duration-300`}>
             <HomeScreen currentUser={currentUser} workStatus={workStatus} setWorkStatus={setWorkStatus} setBreakReturn={setBreakReturn} businessProfile={businessProfile} messages={messages} setCurrentScreen={setCurrentScreen} handleLogout={handleLogout} unreadCount={unreadCount} clientDb={clientDb} />
        </div>

        <div className={`flex-1 bg-slate-50 relative flex-col h-full 
            ${currentScreen === 'home' ? 'hidden md:flex' : 'flex w-full'}`}>
            
            {currentScreen === 'home' ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-4">
                        <MessageSquare size={32} className="text-slate-300"/> 
                    </div>
                    <h3 className="text-base font-bold text-slate-600 mb-1">Pronto para atender</h3>
                    <p className="text-sm">Selecione um cliente no menu esquerdo.</p>
                </div>
            ) : (
                <div className="h-full w-full max-w-6xl mx-auto bg-white shadow-sm border-x border-slate-200 flex flex-col overflow-hidden">
                    {renderScreen()}
                </div>
            )}
        </div>
    </div>
  );
}