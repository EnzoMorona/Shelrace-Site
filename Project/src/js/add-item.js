import { supabase } from './supabase.js';


document.getElementById("formAddItem").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("addNome").value;
    const descricao = document.getElementById("addDescricao").value;
    const preco = parseFloat(document.getElementById("addPreco").value);
    const estoque = parseInt(document.getElementById("addEstoque").value);
    const tamanho = document.getElementById("addTamanho").value;
    const categoria = document.getElementById("addCategoria").value;
    const imagens = document.getElementById("addImage").files;//text array no supabase para permitir a inclusao da lista [] de URL

    //caso o numero de imagens seja igual a zero
    if (imagens.length === 0) {
        alert("Selecione pelo menos uma imagem!");
        return;
    }

    function tamanhoSelecionados() {
        const selectedOptions = document.querySelectorAll('input[name="tamanhos"]:checked');
        return Array.from(selectedOptions).map(option => option.value);
    }
    const tamanhos = tamanhoSelecionados();

    //Lista qual sera armazenada os multiplos links de imagens
    let urlsImagens = [];

    //i igual a 0, se i for menor que a quantidade de imagens, adicionar +1 no i, continua a repetir o comando dentro do for ate ser igual o numero de fotos
    for (let i = 0; i < imagens.length; i++) {
        const file = imagens[i];
        const fileName = `${Date.now()}-${file.name}`;

        const { data, error } = await supabase
            .storage
            .from("imagens-produtos")  // Nome do bucket no Supabase
            .upload(fileName, file);

        if (error) {
            console.error("Erro ao enviar imagem:", error.message);
            alert("Erro ao fazer upload da imagem.");
            return;
        }

        // Obtendo URL publica, ele abre o bucket onde as imagens estao salvas, procura pelo nome do arquivo delas e pega a URL publica
        const { data: publicUrl } = supabase
            .storage
            .from("imagens-produtos")
            .getPublicUrl(fileName);

        
        urlsImagens.push(publicUrl.publicUrl);
    }


    const { data, error } = await supabase.from("products").insert([
        { name: nome, description: descricao, price: preco, stock: estoque, size: tamanhos, category: categoria, image_url: urlsImagens },
    ]);

    if (error) {
        console.error("Erro ao adicionar produto:", error.message);
    } else {
        console.log("Produto adicionado:", data);
        carregarProdutos();
    }
});


//carrega os produtos adicionados em uma lista
async function carregarProdutos() {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
        console.error("Erro ao buscar produtos:", error.message);
        return;
    }

    const lista = document.getElementById("listaProdutos");
    lista.innerHTML = "";

    data.forEach((produto) => {

        let imagensHtml = "";
        // Verifica se há imagens e cria elementos <img> para cada uma
        if (Array.isArray(produto.image_url)) {
            imagensHtml = produto.image_url.map(url => 
                `<img src="${url}" width="100" style="margin: 5px;">`
            ).join(""); // Junta todas as imagens em uma única string
        } else {
            // Caso seja uma string única, exibe apenas uma imagem
            imagensHtml = `<img src="${produto.image_url}" width="100">`;
        }

        lista.innerHTML += `
            <div>
                <h3>${produto.name}</h3>
                <p>${produto.description}</p>
                <p>Preço: R$ ${produto.price}</p>
                <p>Estoque: ${produto.stock}</p>
                <p>Tamanho: ${produto.size}</p>
                <p>Categoria: ${produto.category}</p>
                <div>${imagensHtml}</div> <!-- Insere todas as imagens -->
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


document.getElementById("addImage").addEventListener("change", function () {
    if (this.files.length > 5) {
        alert("Você pode enviar no máximo 5 imagens.");
        this.value = ""; // Reseta o input
    }
    document.getElementById("fileCount").innerText = `${this.files.length}/5 imagens selecionadas`;
});


//PRECO
//NOME
//TAMANHO
//QUANTIDADE
//DESCRICAO
//IMAGEM
//CATEGORIA