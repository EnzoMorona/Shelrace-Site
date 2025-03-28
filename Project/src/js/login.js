import { supabase } from './supabase.js';

//VER, CASO O EMAIL FIQUE SEM SER CONFIRMADO POOR UM TEMPO, FAZER OQUE DEPOIS?

var entrarPainel = document.getElementById("siteLogin");
var siteCadastro = document.getElementById("siteCadastro");
var indicador = document.getElementById("indicador");

entrarPainel.style.transition = "none";
entrarPainel.style.transform = "translateX(-300px)";
MenuItens.style.maxHeight = "0px";
window.Entrar = Entrar;
window.Cadastro = Cadastro;
window.menucelular = menucelular;


function menucelular() {
    if (MenuItens.style.maxHeight == "0px"){
        MenuItens.style.maxHeight = "200px";
    }else{
        MenuItens.style.maxHeight = "0px";
    }
};


function Cadastro() {
    siteCadastro.style.transform = "translateX(0px)";
    indicador.style.transform = "translateX(100px)";
    entrarPainel.style.transform = "translateX(-300px)";
}


function Entrar() {
    entrarPainel.style.transition = "transform 1s";
    siteCadastro.style.transform = "translateX(300px)";
    indicador.style.transform = "translateX(0px)";
    entrarPainel.style.transform = "translateX(0px)";
}



// CADASTRO DO USUARIO

//NAO ESQUECER DE CRIPTOGRAFAR A SENHA!!!


const form_cadastro = document.getElementById("siteCadastro");

form_cadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form_cadastro.nome.value;
    const email = form_cadastro.cadastroEmail.value;
    const password = form_cadastro.cadastroSenha.value;

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    });

    if (signUpError) {
        alert('Erro ao cadastrar: ' + error.message);
        return;
    }

    const userId = signUpData.user.id; // ID do usuário gerado pelo Supabase
    const { data: insertData, error: insertError } = await supabase
        .from('user') // Nome da tabela
        .insert([
            { id: userId, name: name, email: email, password: password } // Dados a serem inseridos
        ]);

    if (insertError) {
        alert('Erro ao salvar dados adicionais: ' + insertError.message);
        return;
    }

    alert('Cadastro realizado com sucesso! Verifique seu email.');
    
});


// LOGIN DO USUARIO

const form_login = document.getElementById("siteLogin");

form_login.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = form_login.loginEmail.value;
    const password = form_login.loginSenha.value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        alert('Erro ao fazer login: ' + error.message);

        if(error.message === 'Email not confirmed'){

            const { emailError } = await supabase.auth.signInWithOtp({ email: email });

            if (emailError) {
                alert('Erro:' + emailError.message);
            } else {
                alert( "E-mail de verificação reenviado com sucesso!");
            }
        }
    } else {
        alert('Login realizado com sucesso!');
        console.log('Token de acesso:', data.session.access_token);
        window.location.reload();
    }
});


// VERIFICACAO DE LOGIN

async function checkSession() {
    // Verificar se há uma sessão ativa
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || session) {
        // Redirecionar para a página de login caso não esteja logado
        console.error('Voce ja esta logado:', error?.message);
        window.location.href = 'home.html';
        return;
    }

    console.log('Usuário logado:', session.user);
}

// Chamar a função para proteger a página
checkSession();



