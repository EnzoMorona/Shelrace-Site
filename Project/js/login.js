var entrarPainel = document.getElementById("entrarPainel");
var siteCadastro = document.getElementById("siteCadastro");
var indicador = document.getElementById("indicador");

MenuItens.style.maxHeight = "0px";

function menucelular(){
    if (MenuItens.style.maxHeight == "0px"){
        MenuItens.style.maxHeight = "200px";
    }else{
        MenuItens.style.maxHeight = "0px";
    }
};


function Cadastro(){
    siteCadastro.style.transform = "translateX(0px)";
    indicador.style.transform = "translateX(100px)";
    entrarPainel.style.transform = "translateX(-300px)";
}


function Entrar(){
    siteCadastro.style.transform = "translateX(300px)";
    indicador.style.transform = "translateX(0px)";
    entrarPainel.style.transform = "translateX(0px)";
}