import { supabase } from './supabase.js';

async function obterCarrinho() {
    const user = await supabase.auth.getUser();

    if (!user.data?.user) {
        return [];
    }

    const { data, error } = await supabase
        .from("carrinho")
        .select("product_id")
        .eq("user_id", user.data.user.id);

    if (error) {
        console.error("Erro ao buscar carrinho:", error.message);
        return [];
    }

    if (data.length > 0) {
        // Pegar os IDs dos produtos do carrinho
        const productIds = data.map(item => item.product_id);
    
        // Consultar a tabela 'products' para pegar todos os produtos com esses IDs
        const { data: produtos, error: produtosError } = await supabase
            .from("products")
            .select("*")  // Seleciona todas as colunas de produtos
            .in("id", productIds);  // Filtra pelos IDs no carrinho
    
        if (produtosError) {
            console.error("Erro ao buscar produtos:", produtosError.message);
            return [];
        }
    
        console.log(produtos); // Aqui você tem todos os produtos com os IDs registrados no carrinho
    
        return produtos;  // Retorna os produtos
    } else {
        console.log("Carrinho vazio.");
        return [];
    }
}

async function removerDoCarrinho(produtoId) {
    const user = await supabase.auth.getUser();

    if (!user.data?.user) {
        alert("Você precisa estar logado.");
        return;
    }

    const { error } = await supabase
        .from("carrinho")
        .delete()
        .eq("user_id", user.data.user.id)
        .eq("product_id", produtoId);

    if (error) {
        console.error("Erro ao remover item do carrinho:", error.message);
    } else {
        alert("Item removido do carrinho!");
    }
}

async function exibirCarrinho() {
    const carrinho = await obterCarrinho();
    const listaCarrinho = document.getElementById("listaCarrinho");

    listaCarrinho.innerHTML = ""; // Limpa antes de adicionar novos itens
    listaCarrinho.innerHTML = `
        <tr>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Valor</th>
        </tr>`;

    carrinho.forEach(item => {
        listaCarrinho.innerHTML += `
            <tr>
                <td>
                    <div class="info-carrinho">
                        <img src="${item.image_url[0]}">

                        <div>
                            <a href="visu.html?id=${item.id}"><p>${item.name}</p></a>
                            <small>${item.price}</small>
                            <br>
                            <a href="#" class="remover" data-produto-id="${item.id}">Remover</a>
                        </div>
                    </div>
                </td>
                <td>
                    <p>${item.stock}</p>
                </td>
                <td>${item.price}</td>
            </tr>
        `;
    });

    document.querySelectorAll('.remover').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            const produtoId = this.getAttribute('data-produto-id');
            removerDoCarrinho(produtoId);
        });
    });
}
exibirCarrinho();
