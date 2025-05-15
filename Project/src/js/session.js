import { supabase } from './supabase.js';

async function updateAuthButtons() {
    // Verificar sessão ativa
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();

    const loginButton = document.getElementById('login-button');
    const usuarioButton = document.getElementById('usuario-button');
    const logoutButton = document.getElementById('logout-button');
    const addButton = document.getElementById('add-button');
    const addButtonA = addButton.querySelector('a')
    const usuarioButtonA = usuarioButton.querySelector('a')

    if (session) {
        // usuário logado: remove botão de login e exibe botão de logout
        logoutButton.classList.remove('hidden')
        usuarioButton.classList.remove('hidden')
        addButton.classList.remove('hidden')

        const { data, error } = await supabase
        .from("users") // Nome da sua tabela de usuários
        .select("name, role")
        .eq("id", user.id)
        .single();
        console.log(data.role)

        if (error || !data || data.role !== "admin") {
            // Se não for adm, esconde o link
            addButtonA.href = "#";
            
            console.error("Erro ao buscar informações do usuário:" + error);
        }

    } else {
        // Usuário não logado: remove botão de logout,usuario e exibe botão de login
        loginButton.classList.remove('hidden')
        addButtonA.href = "#";
        usuarioButtonA.href = "#";
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