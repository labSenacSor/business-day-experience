// E-mails dos responsáveis pela auditoria das vendas realizadas
const destinatario1 = 'adilson.gandrade@sp.senac.br';
const destinatario2 = 'jeff.rfsimoes@sp.senac.br';
const URL_CUPOM_FISCAL = `${window.location.origin}/cupomfiscal?`;

let produtos;
let livroCaixa;


window.addEventListener('DOMContentLoaded', () => {
	document.getElementById("destinatarios").innerHTML = destinatario1 + '<br>' + destinatario2;
	livroCaixa = loadStorage("livroCaixa");
	produtos = loadStorage("produtos");
	updateStorage()
	let modal = new bootstrap.Modal(document.querySelector('#modalTutorial'));
	modal.show();
});


// Funções para Carregar / Salvar local Storage
// Inserir e remover items no local Storage 
function loadStorage(name) {
	return JSON.parse(localStorage.getItem(name)) ?? []
}

function saveStorage(name, db) {
	localStorage.setItem(name, JSON.stringify(db));
}

function insertItem(db, item) {
	db.push(item);
}

function deletItem(db, index) {
	db.splice(index, 1);
}

function updateStorage() {
	saveStorage("produtos", produtos);
	produtos = loadStorage("produtos");
	saveStorage("livroCaixa", livroCaixa);
	livroCaixa = loadStorage("livroCaixa");

	listarProdutos(produtos);
	setDisplayValues(livroCaixa);
	listarVendas(livroCaixa);
}


// Manipulaçao de Modal
function fecharModal(modalName) {
	let modal = document.getElementById(modalName);
	let bootstrapModal = bootstrap.Modal.getOrCreateInstance(modal);
	bootstrapModal.hide();
}


// CADASTRAR PRODUTOS PARA VENDA
function cadastrarProduto() {
	let elementoProduto = document.querySelector("#idNomeProduto");
	let nome = elementoProduto.value.trim()
	if (nome === "") {
		return alert("Preencha os Campos!")
	}
	if (produtos.indexOf(nome) != -1) {
		return alert("produto já registrado")
	}
	insertItem(produtos, nome);
	elementoProduto.value = "";
	fecharModal("modalCadastroProduto");
	updateStorage();
}


function listarProdutos(storage) {
	let modalListaProdutos = document.querySelector('#modalListaProdutos');
	modalListaProdutos.innerHTML = "";
	storage.forEach((item, index) => {
		modalListaProdutos.innerHTML += `
		<div class="d-flex my-1">
			<button class="btn btn-success flex-fill mx-2" data-bs-toggle="modal" data-bs-target="#modalRegistroVenda" onclick="selecionadoProdutoVenda('${item}')">${item}</button>
			<button onclick="removerProduto(${index})" class="btn btn-danger"><i class="bi bi-trash"></i></button>
		</div>`
	});
}

function removerProduto(index){
	deletItem(produtos, index);
	updateStorage();
}

function selecionadoProdutoVenda(nomeProduto){
	let descricao = document.querySelector("#descricao");
	descricao.value = nomeProduto;
}


function registrarVenda(){
	let descricao = document.querySelector("#descricao");
	let valor = document.querySelector("#valor");
	let tipoCadastro = document.querySelector("#tipoCadastro");

	if (descricao.value === "" || valor.value === "") {
		return alert("Preencha os Campos!")
	}
	insertItem(livroCaixa, 
		{
			desc: descricao.value,
			valor: Math.abs(valor.value).toFixed(2),
			tipo: tipoCadastro.value,
		});
	updateStorage();
}


// Geração de QrCode
function gerarQRCode(){
	let nomeProduto = document.querySelector("#descricao").value.replaceAll(' ', '%20');
	let valorProduto = document.querySelector("#valor").value.replaceAll(' ', '%20');

	if (valorProduto === ''){
		return alert('Insira um Valor !')
	}

	let url = `${URL_CUPOM_FISCAL}desc=${nomeProduto}&preco=${valorProduto}`;

	let bntGerarQRCode = document.querySelector("#bntGerarQRCode");
	bntGerarQRCode.style.display = "None";

	let btnCadastrar = document.querySelector("#btnCadastrar");
	btnCadastrar.className = "btn btn-success";

	let qrcode = document.createElement("div");
	qrcode.id = 'qrcode';
	qrcode.className = "d-flex container flex-column justify-content-center align-items-center mt-2";
	new QRCode(qrcode, url);

	let teste = document.querySelector("#teste");
	teste.appendChild(qrcode);
}


// Limpar Modal de Cadastro de Venda ao fechar
document.getElementById('modalRegistroVenda').addEventListener(
	'hidden.bs.modal', function () {
		let descricao = document.querySelector("#descricao");
		descricao.value = "";

		let valor = document.querySelector("#valor");
		valor.value = "";

		let tipoCadastro = document.querySelector("#tipoCadastro");
		tipoCadastro.value = "Venda";

		let bntGerarQRCode = document.querySelector("#bntGerarQRCode");
		bntGerarQRCode.style.display = "block";

		let qrcode = document.querySelector("#qrcode");
		qrcode.remove();

		let btnCadastrar = document.querySelector("#btnCadastrar");
		btnCadastrar.className = "btn btn-success d-none";
	}
);


function listarVendas(storage) {
	let tabela = document.querySelector("#tabelaVendas");
	tabela.innerHTML = "";
	storage.forEach((item, index) => {
		let tr = document.createElement("tr");
		tr.innerHTML = `
		<th scope="row">${index + 1}</th>
		<td>${item.desc}</td>
		<td>R$ ${item.valor}</td>
		<td class="columnAction d-flex flex-row justify-content-between">
			${item.tipo === "Venda"
				? `<i class="bi bi-arrow-up-circle-fill text-success"></i>
				<button onclick="selecionarEstorno('${item.desc}','${item.valor}')" data-bs-toggle="modal" data-bs-target="#modalRegistroEstorno" class="btn btn-warning px-1 py-0 " title="Gerar Estorno"><i class="bi bi-trash"></i></button>`
				: '<i class="bi bi-arrow-down-circle-fill text-danger"></i>'
			}
		</td>`;
		tabela.appendChild(tr);
	});
}

function selecionarEstorno(descricao, valor){
	let descricaoEstorno = document.querySelector("#descricaoEstorno");
	let valorEstorno = document.querySelector("#valorEstorno");
	descricaoEstorno.value = descricao;
	valorEstorno.value = valor;
}

function registrarEstorno(){
	let descricaoEstorno = document.querySelector("#descricaoEstorno");
	let valorEstorno = document.querySelector("#valorEstorno");
	let tipoCadastro = "Estorno";
	
	insertItem(livroCaixa, 
		{
			desc: descricaoEstorno.value,
			valor: Math.abs(valorEstorno.value).toFixed(2),
			tipo: tipoCadastro,
		});
	updateStorage();
}


function setDisplayValues(storage) {
	let totalEntrada = storage.filter((item) => item.tipo === "Venda").map((transaction) => Number(transaction.valor));
	let totalSaida = storage.filter((item) => item.tipo === "Estorno").map((transaction) => Number(transaction.valor));

	totalEntrada = Math.abs(totalEntrada.reduce((acc, cur) => acc + cur, 0)).toFixed(2);
	totalSaida = Math.abs(totalSaida.reduce((acc, cur) => acc + cur, 0)).toFixed(2);

	let saldoCaixa = (totalEntrada - totalSaida).toFixed(2);

	let entrada = document.querySelector("#entradaValue");
	entrada.innerHTML = totalEntrada;

	let saida = document.querySelector("#saidaValue");
	saida.innerHTML = totalSaida;

	let total = document.querySelector("#totalValue");
	total.innerHTML = saldoCaixa;
}


// NO BLOCO ABAIXO DE CÓDIGO ESTA TUDO PARA FECHAR O LIVRO CAIXA
// GERAÇÃO DO CSV
// DONWLOAD DO ARQUIVO
// DIRECIONAR PARA O E-MAIL
function criarCSV(data) {
	csvRows = [];
	csvRows.push(["ID", "Descricao", "Valor", "Tipo"].join(';'));
	data.forEach((item, index) => {
		csvRows.push([index, item["desc"], item["valor"].toString().replace(".", ","), item["tipo"]].join(';'))
	});
	return csvRows.join('\n')
}

function downloadArquivo(data) {
	let blob = new Blob([data], { type: 'text/csv' });
	let url = window.URL.createObjectURL(blob)
	let a = document.createElement('a')
	a.setAttribute('href', url)
	a.setAttribute('download', 'Livro Caixa.csv');
	a.click()
}

function fecharLivroCaixa() {
	let csv = criarCSV(livroCaixa);
	downloadArquivo(csv);
	setTimeout(enviarEmail, 6000);
}

function enviarEmail() {
	let mailTo = `
	mailto:${destinatario1}
	?cc=${destinatario2}
	&subject=${encodeURIComponent("Livro Caixa - Bussiness Day")}
	&body=${encodeURIComponent("Coloque informaçoes da sua turma e produto;serviço")}`;
	window.location.href = mailTo;
}
