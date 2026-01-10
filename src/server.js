require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json()); // Substituto moderno do body-parser

// --- CONEXÃO COM O SUPABASE (REAL) ---
// Certifique-se que o arquivo .env tem SUPABASE_URL e SUPABASE_KEY
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 🚀 ROTAS DA API (Conectadas ao Banco)
// ==========================================

// 1. ROTA DE CADASTRO (Cria usuário com TELEFONE)
app.post('/register', async (req, res) => {
    const { phone, password, name } = req.body;

    // Validação básica
    if (!phone || !password) {
        return res.status(400).json({ error: "Celular e senha são obrigatórios." });
    }

    // A. Verifica se o celular já existe
    const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

    if (existing) {
        return res.status(400).json({ error: "Este número já possui cadastro." });
    }

    // B. Cria o usuário no Banco
    const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
            phone: phone,       // Salva o CELULAR
            password: password, // Em produção, use criptografia (bcrypt)
            name: name || 'Novo Usuário',
            role: 'profissional'
        }])
        .select()
        .single();

    if (error) {
        console.error("Erro no Supabase:", error);
        return res.status(500).json({ error: "Erro ao criar usuário no banco." });
    }

    // C. Cria a configuração inicial da empresa automaticamente
    await supabase.from('business_settings').insert([{ user_id: newUser.id }]);

    console.log(`✅ Novo usuário cadastrado: ${phone}`);
    res.status(201).json({ success: true, user: newUser });
});

// 2. ROTA DE LOGIN (Busca por TELEFONE)
app.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    console.log(`🔑 Tentativa de login: ${phone}`);

    // Busca usuário pelo TELEFONE
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

    // Verifica se achou e se a senha bate
    if (error || !user || user.password !== password) {
        console.log("❌ Login falhou: Dados incorretos");
        return res.status(401).json({ error: "Celular ou senha incorretos." });
    }

    console.log("✅ Login realizado com sucesso!");
    res.json({ success: true, user: user });
});

// 3. ROTA DE CONFIGURAÇÕES (Perfil)
app.get('/settings/:userId', async (req, res) => {
    const { userId } = req.params;
    const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error) return res.json({}); // Retorna vazio se não achar
    res.json(data);
});

app.put('/settings/:userId', async (req, res) => {
    const { userId } = req.params;
    const updates = req.body;

    // Atualiza ou cria (Upsert)
    const { error } = await supabase
        .from('business_settings')
        .upsert({ user_id: userId, ...updates });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, message: "Perfil salvo!" });
});

// 4. ROTAS DE MENSAGENS (Chat Real)
app.get('/messages', async (req, res) => {
    const { data } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });
    
    res.json(data || []);
});

app.post('/messages', async (req, res) => {
    const { content, sender, contact_id, user_id } = req.body;
    
    const { error } = await supabase
        .from('messages')
        .insert([{ content, sender, contact_id, user_id }]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
});

// ==========================================
// 🏁 INICIALIZAÇÃO
// ==========================================
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`✅ SERVIDOR REAL (SUPABASE) RODANDO NA PORTA ${PORT}`);
    console.log(`📱 MODO: Login por TELEFONE Ativado`);
    console.log(`==================================================\n`);
});