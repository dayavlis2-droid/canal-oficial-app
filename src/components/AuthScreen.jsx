import React, { useState } from 'react';
import { Briefcase, Smartphone, Lock, Eye, EyeOff, Check } from 'lucide-react';

const AuthScreen = ({ onLogin, businessProfile }) => {
    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register_phone' | 'register_verify' | 'register_password' | 'register_success'
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [smsCode, setSmsCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        if (!phone || !password) {
            alert("Preencha todos os campos.");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            onLogin('profissional');
        }, 1000);
    };

    const handleSendSms = (e) => { e.preventDefault(); if(!phone){alert("Digite o telefone"); return;} setIsLoading(true); setTimeout(() => { setIsLoading(false); setAuthMode('register_verify'); }, 1500); };
    const handleVerifySms = (e) => { e.preventDefault(); if(!smsCode){alert("Digite o código"); return;} setIsLoading(true); setTimeout(() => { setIsLoading(false); setAuthMode('register_password'); }, 1000); };
    const handleCreateAccount = (e) => { e.preventDefault(); if(!newPassword){alert("Digite a senha"); return;} setIsLoading(true); setTimeout(() => { setIsLoading(false); setAuthMode('register_success'); }, 1000); };
    const handleGoToLogin = () => { setAuthMode('login'); setPhone(''); setPassword(''); };

    return (
        <div className="flex flex-col h-full bg-white justify-center p-8">
            <div className="flex flex-col items-center mb-10">
                <div className="w-24 h-24 bg-[#005C99] rounded-3xl flex items-center justify-center shadow-2xl mb-4"><Briefcase className="text-white" size={48} /></div>
                <h1 className="text-3xl font-bold text-[#005C99]">CanalOficial</h1>
                <p className="text-gray-400 text-sm">Seu canal oficial de atendimento</p>
            </div>
            {authMode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="relative"><Smartphone className="absolute left-3 top-4 h-5 w-5 text-gray-400"/><input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="w-full pl-10 p-4 border rounded-2xl bg-gray-50" placeholder="Telefone"/></div>
                    <div className="relative"><Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400"/><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} className="w-full pl-10 p-4 border rounded-2xl bg-gray-50" placeholder="Senha"/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-4 text-gray-400">{showPassword?<EyeOff/>:<Eye/>}</button></div>
                    <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#005C99] text-white rounded-2xl font-bold">{isLoading ? "Entrando..." : "ENTRAR"}</button>
                    <p className="text-center text-sm text-gray-500">Não tem uma conta? <button type="button" onClick={()=>setAuthMode('register_phone')} className="text-[#005C99] font-bold">Cadastre-se</button></p>
                </form>
            )}
             {authMode !== 'login' && (
                 <div className="text-center">
                     {authMode === 'register_success' ? (
                         <>
                            <Check className="mx-auto text-green-500 mb-4" size={48}/>
                            <h3 className="text-xl font-bold mb-4">Sucesso!</h3>
                            <button onClick={handleGoToLogin} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold">Ir para Login</button>
                         </>
                     ) : (
                         <div className="space-y-4">
                             <h3 className="font-bold text-lg">Cadastro (Simulado)</h3>
                             {authMode === 'register_phone' && <input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full p-4 border rounded-2xl" placeholder="Telefone"/>}
                             {authMode === 'register_verify' && <input value={smsCode} onChange={e=>setSmsCode(e.target.value)} className="w-full p-4 border rounded-2xl text-center tracking-widest" placeholder="0000"/>}
                             {authMode === 'register_password' && <><input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full p-4 border rounded-2xl" placeholder="Nova Senha"/><input type="password" value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)} className="w-full p-4 border rounded-2xl" placeholder="Confirmar Senha"/></>}
                             <button onClick={authMode === 'register_phone' ? handleSendSms : authMode === 'register_verify' ? handleVerifySms : handleCreateAccount} className="w-full py-4 bg-[#005C99] text-white rounded-2xl font-bold">AVANÇAR</button>
                             <button onClick={handleGoToLogin} className="text-sm text-gray-400">Voltar</button>
                         </div>
                     )}
                 </div>
             )}
        </div>
    );
};

export default AuthScreen;