

var MenuItens = document.getElementById("MenuItens");
var produtoImg = document.getElementById("produtoImg");
var produtoSec = document.getElementById("produtoSec");

MenuItens.style.maxHeight = "0px";

function menucelular(){
    if (MenuItens.style.maxHeight == "0px"){
        MenuItens.style.maxHeight = "200px";
    }else{
        MenuItens.style.maxHeight = "0px";
    }
};

produtoSec[0].onclick = function(){
    produtoImg.src = produtoSec[0].src;
}

produtoSec[1].onclick = function(){
    produtoImg.src = produtoSec[1].src;
}

produtoSec[2].onclick = function(){
    produtoImg.src = produtoSec[2].src;
}

produtoSec[3].onclick = function(){
    produtoImg.src = produtoSec[3].src;
}

