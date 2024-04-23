// Elementos

const cupomFiscal = document.querySelector("#cupomFiscal");
const cupomErro = document.querySelector("#cupomErro");

const cnpjEmpresa = document.querySelector("#cnpjEmpresa");

const dataAtual = document.querySelector("#dataAtual")
const descricaoProduto = document.querySelector("#descricaoProduto");
const valorProduto = document.querySelector("#valorProduto");
const valorProduto1 = document.querySelector("#valorProduto1");

const CNPJ = "12.345.678/0001-99";


var produtosRegistrados = localStorage.getItem('produtosRegistrados') ? JSON.parse(localStorage.getItem('produtosRegistrados')) : [];
var data = `${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`;
var urlParams = new URLSearchParams(window.location.search);
var produto = urlParams.get('desc');
var valor = urlParams.get('preco');


function callEndPoint(descricao, valor){
    let xhr = new XMLHttpRequest();
    let url = `https://professoradilson.com.br/bd/index.php?nome_do_produto=${descricao}&valor_do_produto=${valor}`
    xhr.open("GET", url);
    xhr.send();
}


if ((produto != null) && (!produtosRegistrados.includes(produto))) {
    callEndPoint(produto, valor);

    cupomFiscal.style.display = "block";
    cupomErro.style.display = "none";

    produtosRegistrados.push(produto);
    localStorage.setItem('produtosRegistrados', JSON.stringify(produtosRegistrados));
    cnpjEmpresa.innerHTML = CNPJ;
    dataAtual.innerHTML = data;
    descricaoProduto.innerHTML = produto;
    valorProduto.innerHTML = "R$ " + valor;
    valorProduto1.innerHTML = valor;
}
