

let nome;
escolhaNome();
atualizarPaginaeStatus();
let mensagens="";
let mensagem;

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
    console.log("oi")
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
   // textoInput = ""; <--- nao ta funcionando
}

function usuarioOffline(){
    window.location.reload();
}

function abrirContatos(){
    const container = document.querySelector(".sidebar");
    console.log(container);
    container.classList.remove("escondida");
    

}