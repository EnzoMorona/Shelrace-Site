
import { supabase } from './supabase.js';

//DETECTAR QUAL USUARIO ESTA CONECTADO
let logged = null

//FAZER VERIFICACAO DE EMAIL, NAO PODER REPETIR INFORMACOES


//CARREGA OS DADOS DO USUARIO LOGADO NO INPUT
async function carregarDadosUsuario() {
    // Obtém os dados do usuário logado
    const { data: user, error } = await supabase.auth.getUser();


    if (error) {
        console.error("Erro ao buscar usuário:", error.message);
        return;
    }

    if (user) {
        console.log("Usuário logado:", user);

        // Busca os dados adicionais do usuário no banco de dados
        const { data, error: userError } = await supabase
            .from('user') // Nome da tabela no Supabase
            .select('name, email, password')
            .eq('id', user.user.id)
            .single();

        if (userError) {
            console.error("Erro ao buscar informações do usuário:", userError.message);
            return;
        }

        // Preencher os inputs com os dados do usuário
        document.getElementById("dadosNome").value = data.name;
        document.getElementById("dadosEmail").value = data.email;
        document.getElementById("dadosSenha").value = data.password;
        logged = data 
        
    }
}

// Chama a função ao carregar a página
carregarDadosUsuario();

//VE SE TEM ALGUM DADO ALTERADO        
document.getElementById("checarAlt").addEventListener("click", async () => {
  
        

        const novoNome = document.getElementById('dadosNome').value;
        const novoEmail = document.getElementById('dadosEmail').value;
        const novaSenha = document.getElementById('dadosSenha').value;

        let dadosMudaram = false;

        if (novoNome !== logged.name || novoEmail !== logged.email || novaSenha !== logged.password) {
            dadosMudaram = true;
        }

        if (dadosMudaram) {
            const confirmacao = confirm("Deseja salvar as alterações?");
            if (confirmacao) {
                salvarAlteracoes(novoNome, novoEmail, novaSenha);
            }
        } else {
            alert("Nenhuma alteração foi feita.");
        }
});


// SALVA ALTERACOES NO USUARIO
async function salvarAlteracoes(nome, email, senha) {

// Obtém o usuário logado
const { data: user, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        console.error("Erro ao obter usuário logado:", authError?.message);
        return;
    }

    const userId = user.user.id; // Obtém o ID do usuário logado

    // Atualiza os dados no Supabase Auth (opcional)
    const { error: updateAuthError } = await supabase.auth.updateUser({
        email: email,
        data: { full_name: nome, name: nome }
    });

    if (updateAuthError) {
        console.error("Erro ao atualizar Auth:", updateAuthError.message);
        return;
    }

    console.log("Usuário atualizado no Supabase Auth!");

    // Agora atualiza os dados na tabela personalizada
    const { data: updatedData, error: updateDbError } = await supabase
        .from('user') // Nome correto da sua tabela
        .update({ name: nome, email: email })
        .eq('id', userId) // Filtra pelo próprio usuário logado
        .select();  // Retorna os dados atualizados para conferir

    if (updateDbError) {
        console.error("Erro ao atualizar tabela:", updateDbError.message);
        return;
    }

    console.log("Usuário atualizado na tabela personalizada!", updatedData);
}