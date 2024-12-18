import { supabase } from './supabase.js';


async function checkSession() {
    // Verificar se há uma sessão ativa
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
        // Redirecionar para a página de login caso não esteja logado
        console.error('Sessão expirada ou inexistente:', error?.message);
        window.location.href = 'minha-conta.html';
        return;
    }

    console.log('Usuário logado:', session.user);
}

// Chamar a função para proteger a página
checkSession();