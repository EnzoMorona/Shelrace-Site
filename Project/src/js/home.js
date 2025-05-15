import { supabase } from './supabase.js';

async function carregarProdutos() {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    if (error) {
        console.error("Erro ao buscar produtos:", error.message);
        return;
    }

    const destaque = document.getElementById("mostrarItensDestaque");
    const novos = document.getElementById("mostrarItensNovos");
    const categorias = {
        "Macacao": { 
            container: document.getElementById("containerMacacao"),
            lista: document.getElementById("mostrarItensMacacao")
        },
        "Capacete":{
            container: document.getElementById("containerCapacete"),
            lista: document.getElementById("mostrarItensCapacete")
        },
        "Luvas":{
            container: document.getElementById("containerLuvas"),
            lista: document.getElementById("mostrarItensLuvas")
        },
        "Botas":{ 
            container: document.getElementById("containerBotas"),
            lista: document.getElementById("mostrarItensBotas")
        },
    };

    data.forEach((produto, index) => {
        const produtoHTML = `
            <div class="col-4">
                <a href="visu.html?id=${produto.id}">
                <img src="${produto.image_url[0]}">
                </a>
                <h4>${produto.name}</h4>
                
                <p>R$ ${produto.price},00</p>
            </div>
        `;

        const container = categorias[produto.category];
        if (container) {
            container.lista.innerHTML += produtoHTML;
            container.container.style.display = "block";
        }

        if (produto.featured == 1){
            destaque.innerHTML += produtoHTML;
        }
        
        if (index < 4) {
        novos.innerHTML += produtoHTML;
        }
    });
}

carregarProdutos()
