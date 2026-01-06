import React, { useState } from 'react';
import { ShieldCheck, Phone, Lock, ArrowRight } from 'lucide-react';

const LoginNovo = ({ onLogin }) => {
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
      <div className="text-center mb-8">
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
            © 2024 Canal Oficial App v2.0
        </p>
      </div>
    </div>
  );
};

export default LoginNovo;