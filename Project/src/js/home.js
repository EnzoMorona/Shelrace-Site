import { supabase } from './supabase.js';

async function carregarProdutos() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
        console.error("Erro ao buscar produtos:", error.message);
        return;
    }

    const lista = document.getElementById("mostrarItens");
    lista.innerHTML = "";

    data.forEach((produto) => {
        lista.innerHTML += `
            <div class="col-4">
                <a href="visu.html?id=${produto.id}">
                <img src="${produto.image_url[0]}">
                </a>
                <h4>${produto.name}</h4>
                
                <p>R$ ${produto.price},00</p>
            </div>
        `;
    });
}

carregarProdutos()


document.addEventListener("DOMContentLoaded", async function () {
    
    const linkAdmin = document.getElementById("linkAdmin");

    // Conectar ao Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Se não estiver logado, remove o link
        linkAdmin.style.display = "none"; 
        return;
    }

    // Buscar os dados do usuário na tabela do Supabase
    const { data, error } = await supabase
        .from("users") // Nome da sua tabela de usuários
        .select("name, role")
        .eq("id", user.id)
        .single();
        console.log(data.role)

    if (error || !data || data.role !== "admin") {
        // Se não for adm, esconde o link
        linkAdmin.style.display = "none";
        linkAdmin.href = "#";
        console.error("Erro ao buscar informações do usuário:" + error.message);
        
    }
});