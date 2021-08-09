

let nome;
escolhaNome();
atualizarPaginaeStatus();
let mensagens="";
let mensagem;
let listaParticipantes = [];

function escolhaNome() {
   nome = prompt("Por favor para se cadastrar digite seu nome:");
    verificarNome();
}
function verificarNome(){
    let promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants',{name:nome});
    promise.then(iniciarSala);
    promise.catch(quandoErro);   
}

function quandoErro(erro){

    if(erro.response.status === 400){
       nome = prompt("Esse nome já foi escolhido, por favor digite outro:");
       console.log(erro)
    }

    verificarNome();
}

function iniciarSala(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
    
    promise.then(carregarMensagens);
    promise.catch(quandoErro);
}

function carregarMensagens(mensagens){
    let corpo = document.querySelector(".corpo");
     mensagem = corpo.innerHTML;
 
     for(let i=0; i<mensagens.data.length; i++){
         let tipo = mensagens.data[i].type;
        construirMenssagem(mensagens,tipo,i); 
     }

     corpo.innerHTML = mensagem;
     corpo.lastChild.scrollIntoView();

 }

function construirMenssagem(mensagens,tipo,i){
         let deQuem = mensagens.data[i].from;
         let paraQuem = mensagens.data[i].to;
         let texto = mensagens.data[i].text;
         let horario = mensagens.data[i].time;
    if (tipo === "status"){
        mensagem += `<div class="caixa ${tipo}"><p class="horario">(${horario}) </p><strong>${deQuem}:</strong>${texto}</div>`    
    }

    if(tipo === "message"){
        mensagem += `<p class="caixa ${tipo}"><span class="horario">(${horario})</span><strong>${deQuem}</strong> para <strong>${paraQuem}: </strong>${texto}</p>`  
    }

    if(tipo === "private_message"){
        mensagem += `<p class="caixa ${tipo}"><span class="horario">(${horario})</span><strong>${deQuem}</strong> reservadamente para <strong>${paraQuem}: </strong>${texto}</p>`    
    }
}

function atualizarPaginaeStatus(){
    setInterval(iniciarSala, 3000);
    setInterval(usuarioOnline, 5000);
    setInterval(pegarListaParticipantes, 10000)
}

function usuarioOnline(){
    axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status",{name:nome})
    
}

function enviarMenssagem(){
    let textoInput = document.querySelector("input").value;

    let minhaMenssagem = {
        from: nome,
        to: "Todos",
        text: textoInput,
        type: "message"
    }

    const promisse = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages",minhaMenssagem);

    promisse.then(iniciarSala);
    promisse.catch(usuarioOffline); 
   
}

function usuarioOffline(){
    window.location.reload();
}


function pegarListaParticipantes(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants");

    promise.then(quemEstaOn);
}
function quemEstaOn(lista){
    for(let i=0; i<lista.data.length; i++){
        listaParticipantes.push(lista.data[i].name);
    }
    gerarNomesHtml();
}
function gerarNomesHtml(){
    let contatos = document.querySelector(".contatos");
    let temporaria = document.querySelector(".temporaria");
    if(temporaria !== null){
        limparLista(contatos);
        console.log("com contatos")
    }
    console.log("mudando os contatos")
    let auxiliador = contatos.innerHTML ;

    for(let i=0; i<listaParticipantes.length; i++){
       auxiliador += `<span class="temporaria"><ion-icon name="person-circle"></ion-icon>${listaParticipantes[i]}</span>`
    }
    contatos.innerHTML = auxiliador;
    auxiliador ="";
}

function limparLista(contatos){
console.log("emtrei")
    for(let i=0; i<listaParticipantes.length; i++){
        console.log("entrei de vdd")
        let temporaria = contatos.querySelector(".temporaria");
        contatos.removeChild(temporaria); //Ta dando erro
    }
    listaParticipantes = [];
}
function abrirContatos(){
    const sidebar = document.querySelector(".sidebar");
    const vidro = document.querySelector(".vidro");
    vidro.classList.toggle("transparente");
    sidebar.classList.toggle("escondida");
    
}