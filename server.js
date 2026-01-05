require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// 1. Configurações Iniciais
const app = express();
app.use(cors());
app.use(express.json());

// 2. Conexão com o Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota de Teste (Raiz)
app.get('/', (req, res) => {
  res.send('🚀 Servidor Backend do Canal Oficial rodando!');
});

// ==========================================
// 🔐 ÁREA DE AUTENTICAÇÃO (Login/Cadastro)
// ==========================================

app.post('/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password }])
      .select();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: 'Usuário criado!', user: data[0] });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno.' });
  }
});

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('password', password)
      .single();

    if (error || !data) return res.status(401).json({ error: 'Dados incorretos.' });
    res.json({ message: 'Login realizado!', user: data });
  } catch (err) {
    res.status(500).json({ error: 'Erro no login.' });
  }
});

// ==========================================
// 💬 ÁREA DE CHAT (Mensagens)
// ==========================================

// Buscar mensagens
app.get('/messages/:contactId', async (req, res) => {
  const { contactId } = req.params;
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar mensagem
app.post('/messages', async (req, res) => {
  console.log("📨 Recebendo mensagem:", req.body);
  const { content, sender, contact_id } = req.body;
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ content, sender, contact_id }])
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    console.error("Erro ao salvar:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ⚙️ ÁREA DE CONFIGURAÇÕES (Perfil da Empresa) - NOVO
// ==========================================

// 1. Buscar configurações do usuário
app.get('/settings/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Se der erro 'PGRST116' significa que não achou nada (normal no primeiro acesso)
    if (error && error.code !== 'PGRST116') throw error;
    
    // Retorna os dados ou um objeto vazio se não tiver nada ainda
    res.json(data || {}); 
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Salvar ou Atualizar configurações
app.put('/settings/:userId', async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body; // Pega todos os dados do formulário

  try {
    // Verifica se já existe configuração para este usuário
    const { data: existing } = await supabase
      .from('business_settings')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;
    
    if (existing) {
      // Se já existe, ATUALIZA (Update)
      result = await supabase
        .from('business_settings')
        .update(updateData)
        .eq('user_id', userId);
    } else {
      // Se não existe, CRIA NOVO (Insert)
      // Importante: Adicionamos o user_id no objeto para salvar
      result = await supabase
        .from('business_settings')
        .insert([{ ...updateData, user_id: userId }]);
    }

    if (result.error) throw result.error;
    res.json({ message: 'Configurações salvas com sucesso!' });

  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 🚀 INICIALIZAÇÃO DO SERVIDOR
// ==========================================
const PORT = process.env.PORT || 5000; // Importante: usa a porta do Render ou 5000
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando na porta ${PORT}`);
});