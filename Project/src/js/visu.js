import { supabase } from './supabase.js';



//Pegar a ID que veio junto com a URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");


async function carregarProdutoVisu() {

    if (!productId) {
        document.getElementById("produtoDetalhes").innerHTML = "<p>Produto não encontrado.</p>";
        return;
    }

    //Pegando o produto com o ID correspondente ao que estava na URL
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

    if (error || !data) {
        document.getElementById("produtoDetalhes").innerHTML = "<p>Erro ao carregar produto.</p>";
        console.error("Erro:", error);
        return;
    }



    let sizeHtml = "";

    if (Array.isArray(data.size)) {
        sizeHtml = data.size.map(size => 
            `<option value="${size}">${size}</option>`
        ).join(""); // Junta todas as imagens em uma única string
    }else {
        // Caso seja uma string única, exibe apenas uma imagem
        sizeHtml = `<option value="${data.size}">${data.size}</option>`;
    }

    let imageHtml = "";

    //verifica se imagem_url e uma array, se sim e tiver mais de 1 imagem, ira fazer repetir pulando a primeira e colocando todas dentro do img src
    //e as juntando logo depois e colocando dentro da div
    if (Array.isArray(data.image_url) && data.image_url.length > 1) {
        const otherHtml = data.image_url.slice(1).map(image => 
            `<img src="${image}" alt="" width="100%" class="produtoSec">`
        ).join(""); // Junta todas as imagens em uma única string

        imageHtml = `<img src="${data.image_url[0]}" alt="" id="produtoImg">
                     <div class="img-linha">${otherHtml}</div>`;
    }else {
        // Caso seja uma string única, exibe apenas uma imagem
        imageHtml = `<img src="${data.image_url}" alt="" width="100%" id="produtoImg">`;
    }

    //add a visualicao do produto
    document.getElementById('visuProduto').innerHTML = `
        <p>Produto da Loja Teste</p>
                <h1>${data.name}</h1>
                <h4>R$${data.price},00</h4>
                <form action="" method="post">
                    <select name="" id="selectTamanho">
                        <option value="">Selecione o Tamanho</option>
                        ${sizeHtml}
                    </select>
                    <input type="number" name="" id="quantity" value="1" max="${data.stock}">
                    <button type="submit" class="btn" id="submitButton">Adicionar no Carrinho</button>
                </form>

            <h3>Descricao</h3>
            <p>${data.description}</p>
    `;

    async function adicionarAoCarrinho() {
    
        const user = await supabase.auth.getUser();
        if (!user.data?.user) {
            alert("Você precisa estar logado para adicionar ao carrinho.");
            return;
        }
    
        const tamanho = document.getElementById("selectTamanho").value;
        const quantity = document.getElementById("quantity").value;

        console.log(tamanho)
        console.log(quantity)
        console.log(user.data.user.id)
    
        if (!tamanho) {
            alert("Por favor, selecione um tamanho.");
            return;
        }
    
        const { data, error } = await supabase
            .from("carrinho")
            .insert([{ 
                user_id: user.data.user.id, 
                product_id: productId, 
                quantity: quantity,
                size: tamanho
            }]);
    
        if (error) {
            console.error("Erro ao adicionar ao carrinho:", error.message);
        } else {
            alert("Produto adicionado ao carrinho!");
        }
    }

    document.getElementById('visuImagens').innerHTML = imageHtml

    // Adiciona evento para trocar a imagem ao clicar nas miniaturas
    document.querySelectorAll(".produtoSec").forEach(img => {
        img.addEventListener("click", function () {

            //toda vez que clicar, pega o src atual da imagem principal e salva ela pra fazer a troca de imagens
            const produtoImg = document.getElementById("produtoImg");
            const firstProd = produtoImg.src;
            const secondProd = this.src;

            produtoImg.src = secondProd;
            this.src = firstProd;
        });
    });

    document.getElementById("submitButton").addEventListener("click", async function(event) {
        event.preventDefault();
        await adicionarAoCarrinho();
    });
}
carregarProdutoVisu();






