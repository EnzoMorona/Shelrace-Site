import { supabase } from './supabase.js';

async function obterCarrinho() {
    const user = await supabase.auth.getUser();

    if (!user.data?.user) {
        return [];
    }

    const { data, error } = await supabase
        .from("carrinho")
        .select("quantity, products(*)") // Pega a quantidade e todos os dados da tabela 'products'
        .eq("user_id", user.data.user.id);
        

    if (error) {
        console.error("Erro ao buscar carrinho:", error.message);
        return [];
    }
    console.log(data)
    return data;  // Retorna os produtos
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
        exibirCarrinho();
    }
}

async function somaDoCarrinho() {
    const carrinho = await obterCarrinho();
    var price = 0

    carrinho.forEach(item => {
        price = price + (item.products.price * item.quantity)
    })

    return price;
}

async function exibirCarrinho() {
    const carrinho = await obterCarrinho();
    const preco = await somaDoCarrinho();
    const listaCarrinho = document.getElementById("listaCarrinho");
    const precoCarrinho = document.getElementById("precoCarrinho");
    
    listaCarrinho.innerHTML = `
        <tr>
        <th>Produto</th>
        <th>Quantidade</th>
        <th>Valor</th>
        </tr>
    `;

    carrinho.forEach(item => {
        listaCarrinho.innerHTML += `
            <tr>
                <td>
                    <div class="info-carrinho">
                        <img src="${item.products.image_url[0]}">

                        <div>
                            <a href="visu.html?id=${item.products.id}"><p>${item.products.name}</p></a>
                            <small>${item.products.price}</small>
                            <br>
                            <a href="#" class="remover" data-produto-id="${item.products.id}">Remover</a>
                        </div>
                    </div>
                </td>
                <td>
                    <p>${item.quantity}</p>
                </td>
                <td>${item.products.price}</td>
            </tr>
        `;
    });

    precoCarrinho.innerHTML = `                
                <tr>
                    <td>Sub-Total</td>
                    <td>R$ ${preco}</td>
                </tr>

                <tr>
                    <td>Frete</td>
                    <td>R$ ???</td>
                </tr>

                <tr>
                    <td>Total</td>
                    <td>R$ ???</td>
                </tr>
    `;

    document.querySelectorAll('.remover').forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            const produtoId = this.getAttribute('data-produto-id');
            exibirCarrinho();
            removerDoCarrinho(produtoId);
        });
    });
}
exibirCarrinho();

