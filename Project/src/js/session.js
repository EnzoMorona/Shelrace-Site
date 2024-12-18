import { supabase } from './supabase.js';

async function updateAuthButtons() {
    // Verificar sessão ativa
    const { data: { session } } = await supabase.auth.getSession();

    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    if (session) {
        // Usuário logado: remove botão de login e exibe botão de logout
        if (loginButton) loginButton.remove(); // Remove o botão de login
        if (!logoutButton.parentNode) {
            const menu = document.getElementById('MenuItens');
            menu.appendChild(logoutButton); // Adiciona o botão de logout, se ainda não estiver
        }
    } else {
        // Usuário não logado: remove botão de logout e exibe botão de login
        if (logoutButton) logoutButton.remove(); // Remove o botão de logout
        if (!loginButton.parentNode) {
            const menu = document.getElementById('MenuItens');
            menu.appendChild(loginButton); // Adiciona o botão de login, se ainda não estiver
        }
    }
}

// Função para logout
async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error('Erro ao fazer logout:', error.message);
        return;
    }

    alert('Você foi desconectado.');
    window.location.reload(); // Recarregar a página para atualizar os botões
}

// Adicionar evento ao botão de logout
document.getElementById('logout-button').addEventListener('click', logout);

// Chamar a função para atualizar os botões ao carregar a página
updateAuthButtons();