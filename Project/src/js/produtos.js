import { supabase } from './supabase.js';

const filtrosAtivos = new Set();
document.getElementById("filtroCategoria").addEventListener("change", carregarProdutos);
document.getElementById("filtroPreco").addEventListener("change", carregarProdutos);
document.getElementById("filtroTamanho").addEventListener("change", carregarProdutos);

async function carregarProdutos() {
    const categoriaSelecionada = document.getElementById("filtroCategoria").value;
    const tamanhoSelecionado = document.getElementById("filtroTamanho").value;
    const precoSelecionado = document.getElementById("filtroPreco").value;
    console.log(categoriaSelecionada)
    filtrosAtivos.clear()

    let query = supabase.from("products").select("*");

    if (categoriaSelecionada) {
        
        query = query.eq("category", categoriaSelecionada);
        filtrosAtivos.add(categoriaSelecionada)
    }
    if (tamanhoSelecionado) {
        query = query.contains("size", [tamanhoSelecionado]);
        filtrosAtivos.add(tamanhoSelecionado)
    }
    if (precoSelecionado == "Menor Preco"){
        query = query.order("price", { ascending: true });  
    }
    if (precoSelecionado == "Maior Preco"){
        query = query.order("price", { ascending: false });  
    }

    
    const { data, error } = await query;

    if (error) {
        console.error("Erro ao buscar produtos:", error.message);
        return;
    }

    const titulo = document.getElementById("Title");
    const categorias = document.getElementById("produtosLista")

    if (filtrosAtivos.size === 0) {
        titulo.textContent = "Todos";
    } else {
        titulo.textContent = Array.from(filtrosAtivos).join(", ");
    }
    categorias.innerHTML = "";

    if(!data || data.length == 0){
        categorias.innerHTML = "<div class='col-4'><p>Nenhum produto encontrado com os filtros selecionados.</p></div>";
        return;
    }

    data.forEach((produto) => {
        const produtoHTML = `
            <div class="col-4">
                <a href="visu.html?id=${produto.id}">
                <img src="${produto.image_url[0]}">
                </a>
                <h4>${produto.name}</h4>
                
                <p>R$ ${produto.price},00</p>
            </div>
        `;


        categorias.innerHTML += produtoHTML;
    });
}

carregarProdutos()
