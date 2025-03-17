import { supabase } from './supabase.js';

document.getElementById("formAddItem").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("addNome").value;
    const descricao = document.getElementById("addDescricao").value;
    const preco = parseFloat(document.getElementById("addPreco").value);
    const estoque = parseInt(document.getElementById("addEstoque").value);
    const imagemUrl = document.getElementById("addImage").value;

    const { data, error } = await supabase.from("products").insert([
        { name: nome, description: descricao, price: preco, stock: estoque, image_url: imagemUrl },
    ]);

    if (error) {
        console.error("Erro ao adicionar produto:", error.message);
    } else {
        console.log("Produto adicionado:", data);
        carregarProdutos();
    }
});

async function carregarProdutos() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
        console.error("Erro ao buscar produtos:", error.message);
        return;
    }

    const lista = document.getElementById("listaProdutos");
    lista.innerHTML = "";

    data.forEach((produto) => {
        lista.innerHTML += `
            <div>
                <h3>${produto.name}</h3>
                <p>${produto.description}</p>
                <p>Preço: R$ ${produto.price}</p>
                <p>Estoque: ${produto.stock}</p>
                <img src="${produto.image_url}" width="100">
                <button onclick="excluirProduto('${produto.id}')">Excluir</button>
            </div>
        `;
    });
}

async function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
        const { error } = await supabase.from("products").delete().eq("id", id).select();
    
        if (error) {
            console.error("Erro ao excluir produto:", error.message);
        } else {
            console.log("Produto excluído com sucesso!");
            carregarProdutos();
        }
    }
}

window.excluirProduto = excluirProduto;
carregarProdutos();
