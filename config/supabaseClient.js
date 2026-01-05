const { createClient } = require('@supabase/supabase-js');

// --- ÁREA DE CHAVES ---

// ✅ SUA URL JÁ ESTÁ CORRETA AQUI:
const supabaseUrl = 'https://mhcpktowrrrlqaihamxv.supabase.co'; 

// ⚠️ ATENÇÃO: Vá no site do Supabase, clique no botão de COPIAR ao lado da chave "anon/public"
// e cole DENTRO das aspas abaixo. A chave que você mandou parecia incompleta.
const supabaseKey = 'sb_publishable_gGXxnvpmoRLgLJmXg4Sphw_giyH-SIC'; 

// ---------------------------------------------------

console.log("Tentando conectar ao Supabase...");

if (supabaseKey === 'COLE_SUA_CHAVE_INTEIRA_AQUI') {
    console.error("❌ ERRO: Você esqueceu de colar a chave 'anon' no arquivo!");
} else {
    console.log("✅ Chaves configuradas.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;