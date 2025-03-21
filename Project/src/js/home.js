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