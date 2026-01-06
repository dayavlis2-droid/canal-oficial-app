import React, { useState } from 'react';
import { ShieldCheck, User, Lock, Phone, ArrowRight } from 'lucide-react';

const AuthScreen = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true); // Alternar entre Login e Cadastro
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- MÁSCARA DE TELEFONE (UX) ---
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Aplica a máscara (99) 99999-9999
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d)(\d{4})$/, '$1-$2');
    setPhone(value);
  };

  // --- SIMULAÇÃO DE LOGIN ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (phone.length < 14 || password.length < 6) {
        alert("Preencha os dados corretamente.");
        return;
    }
    setLoading(true);
    
    // Simula um delay de rede para UX
    setTimeout(() => {
        setLoading(false);
        // Aqui você chamaria sua API real
        // Por enquanto, chama a função do App.js para entrar
        onLogin(); 
    }, 1500);
  };

  const handleForgotPassword = () => {
      if(phone.length < 14) {
          alert("Digite seu telefone para receber o SMS de recuperação.");
          return;
      }
      alert(`Um código de recuperação foi enviado via SMS para ${phone}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#2b5876] to-[#4e4376]">
      
      {/* --- CABEÇALHO --- */}
      <div className="text-center mb-8 animate-fade-in-down">
        <div className="bg-white/10 p-4 rounded-full inline-block backdrop-blur-sm mb-4 border border-white/20 shadow-lg">
            <ShieldCheck size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white drop-shadow-md">Atendimento Seguro</h1>
        <p className="text-blue-100 mt-2 text-sm md:text-base font-light">
          Seu canal oficial de atendimento ao cliente
        </p>
      </div>

      {/* --- CARD CENTRAL --- */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Barra de destaque superior */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <div className="p-8">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    {isLoginView ? 'Bem-vindo!' : 'Crie sua conta'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                    {isLoginView 
                        ? 'Entre com seus dados para continuar.' 
                        : 'Preencha o formulário para acessar.'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Campo Telefone */}
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
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white text-gray-800 font-medium"
                            required
                        />
                    </div>
                </div>

                {/* Campo Senha */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600 pl-1">Senha (9 dígitos)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Lock size={20} />
                        </div>
                        <input
                            type="password"
                            placeholder="•••••••••"
                            maxLength={9}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50 hover:bg-white text-gray-800 font-medium"
                            required
                        />
                    </div>
                </div>

                {/* Botão Entrar */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`
                        w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]
                        ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
                    `}
                >
                    {loading ? 'Processando...' : (isLoginView ? 'Entrar Agora' : 'Cadastrar')}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </form>

            {/* Links de Rodapé */}
            <div className="mt-6 flex flex-col gap-3 text-center text-sm">
                {isLoginView ? (
                    <>
                        <button 
                            onClick={handleForgotPassword}
                            className="text-gray-500 hover:text-blue-600 transition-colors font-medium"
                        >
                            Esqueceu a senha? <span className="underline decoration-dotted">Enviar SMS</span>
                        </button>
                        <div className="border-t border-gray-100 pt-4 mt-2">
                            <p className="text-gray-400 mb-2">Ainda não tem acesso?</p>
                            <button 
                                onClick={() => setIsLoginView(false)}
                                className="text-blue-600 font-bold hover:text-blue-800 uppercase tracking-wide text-xs border border-blue-100 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors w-full"
                            >
                                Criar Conta Grátis
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="pt-2">
                        <button 
                            onClick={() => setIsLoginView(true)}
                            className="text-blue-600 font-bold hover:text-blue-800"
                        >
                            Voltar para o Login
                        </button>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* --- RODAPÉ SEGURO --- */}
      <div className="mt-8 text-center opacity-70">
        <p className="text-white text-xs flex items-center justify-center gap-1">
            <Lock size={12} /> Conexão criptografada de ponta a ponta
        </p>
        <p className="text-blue-200 text-[10px] mt-1">
            © 2024 Canal Oficial App. Todos os direitos reservados.
        </p>
      </div>

    </div>
  );
};

export default AuthScreen;
