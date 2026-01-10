// Exemplo usando Express e Supabase Client
const { createClient } = require('@supabase/supabase-js');

// Certifique-se de que suas variáveis de ambiente estão carregadas
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// --- CONTROLLER DE LOGIN ---
exports.login = async (req, res) => {
  const { email, password } = req.body; // Recebe email e senha

  try {
    // 1. Busca usuário pelo EMAIL
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email) // <--- O PULO DO GATO: buscando por email
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Email não encontrado.' });
    }

    // 2. Verifica a senha (em produção use bcrypt!)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    // 3. Retorna sucesso
    return res.json({ 
      message: 'Logado com sucesso!',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};