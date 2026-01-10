const supabase = require('../config/supabaseClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { phone, password, name, role } = req.body;

    try {
        // 1. Verificar se usuário já existe
        const { data: existingUser } = await supabase
            .from('users')
            .select('*')
            .eq('phone', phone)
            .single();

        if (existingUser) {
            return res.status(400).json({ error: 'Telefone já cadastrado' });
        }

        // 2. Criptografar senha
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 3. Salvar no banco
        const { data, error } = await supabase
            .from('users')
            .insert([{ phone, password_hash: passwordHash, name, role: role || 'cliente' }])
            .select();

        if (error) throw error;

        res.status(201).json({ message: 'Usuário criado com sucesso!', user: data[0] });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { phone, password } = req.body;

    try {
        // 1. Buscar usuário
        const { data: user } = await supabase
            .from('users')
            .select('*')
            .eq('phone', phone)
            .single();

        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

        // 2. Conferir senha
        const validPass = await bcrypt.compare(password, user.password_hash);
        if (!validPass) return res.status(401).json({ error: 'Senha incorreta' });

        // 3. Gerar Token (Crachá de acesso)
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user.id, name: user.name, role: user.role, phone: user.phone } });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};