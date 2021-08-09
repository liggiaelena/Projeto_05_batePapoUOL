let nome;
escolhaNome();
pegarListaParticipantes();
atualizarPaginaeStatus();
let nomeEscolhido;
let mensagens="";
let mensagem;
let listaParticipantes = [];
let escolhaMensagem = "";

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
        mensagem += `<div class="caixa ${tipo}"><p class="horario">(${horario})&nbsp;</p><strong>${deQuem}:</strong>&nbsp;${texto}</div>`    
    }

    if(tipo === "message"){
        mensagem += `<p class="caixa ${tipo}"><span class="horario">&nbsp;(${horario})&nbsp;</span><strong>${deQuem}</strong>&nbsp;para&nbsp;<strong>${paraQuem}:</strong>&nbsp;${texto}</p>`  
    }

    if(tipo === "private_message"){
        mensagem += `<p class="caixa ${tipo}"><span class="horario">&nbsp;(${horario})&nbsp;</span><strong>${deQuem}</strong>&nbsp;reservadamente para&nbsp;<strong>${paraQuem}:&nbsp;</strong>${texto}</p>`    
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
    if(escolhaMensagem === "privada"){
        minhaMenssagem.type = "private_message";
        minhaMenssagem.to = nomeEscolhido;
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
    listaParticipantes = [];
    for(let i=0; i<lista.data.length; i++){
        listaParticipantes.push(lista.data[i].name);
    }
    gerarNomesHtml();
}
function gerarNomesHtml(){
    let contatos = document.querySelector(".contatos");
    limparHtml(contatos);

    let auxiliador = contatos.innerHTML ;

    for(let i=0; i<listaParticipantes.length; i++){
       auxiliador += `<div class="caixinha" onclick="escolhido(this)">
       <span class="temporaria"><ion-icon name="person-circle"></ion-icon><p>${listaParticipantes[i]}</p></span>
       <ion-icon name="checkmark-outline" class="checkmark escondida"></ion-icon>
     </div>`
    }
    contatos.innerHTML = auxiliador;
    auxiliador ="";
    alguemFoiEscolhido();
}

function limparHtml(contatos){
    let temporaria = document.querySelector(".temporaria");
    
    if(temporaria !== null){
        contatos.innerHTML = `<div class="caixinha" onclick="escolhido(this)">
        <span><ion-icon name="people"></ion-icon><p>Todos</p></span>
        <ion-icon name="checkmark-outline" class="checkmark escondida"></ion-icon>
      </div>`;
    }
}

function abrirContatos(){
    const sidebar = document.querySelector(".sidebar");
    const vidro = document.querySelector(".vidro");
    vidro.classList.toggle("transparente");
    sidebar.classList.toggle("escondida");
}

function escolhido(elemento){
    
    let pai = elemento.parentNode;
    limparEscolhidos(pai);

    let checkmark = elemento.querySelector(".escondida")
    checkmark.classList.add("escolhido");
    checkmark.classList.remove("escondida");

    menssagemPrivadaHtml();
}

function limparEscolhidos(pai){
    let escolhido = pai.querySelector(".escolhido");
   
    if(escolhido !== null){
        escolhido.classList.remove("escolhido");
        escolhido.classList.add("escondida")
    }
}
 
function menssagemPrivadaHtml(){
    let maneiraEscolhida = identificarEscolhidos();

    let fundo = document.querySelector(".fundo");
    let auxiliador = `<div>
            <input type="text" placeholder="Escreva aqui...">
            <ion-icon name="paper-plane-outline" onclick="enviarMenssagem()"></ion-icon>
          </div>`;

        if(maneiraEscolhida){
            auxiliador += `<div>Enviando para&nbsp;${nomeEscolhido}&nbsp;(reservadamente)</div>`;
        }  
    fundo.innerHTML = auxiliador;
}

function identificarEscolhidos(){
    let contatos = document.querySelector(".contatos");
    let caixinha1 = contatos.querySelector(".escolhido").parentNode;
      nomeEscolhido = caixinha1.querySelector("p").innerHTML;

    let tipoMensagem = document.querySelector(".tipo-mensagem");
    let caixinha2 = tipoMensagem.querySelector(".escolhido").parentNode;
    let maneiraEscolhida = caixinha2.id;
    
    if(maneiraEscolhida === "reservado"){
        escolhaMensagem = "privada";
        return true;
    }
    else{
        return false;
    }
}

function alguemFoiEscolhido(){
    let contatos = document.querySelector(".contatos");
    let marcado;
    for(let i=0; i<listaParticipantes.length; i++){
        if(nomeEscolhido === listaParticipantes[i]){
            let caixinha = contatos.children[i+1];
            marcado = caixinha.querySelector(".checkmark");
        }
    }
        marcado.classList.add("escolhido");
        marcado.classList.remove("escondida");
}