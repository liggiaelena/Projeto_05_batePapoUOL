


//escolhaNome();
iniciarSala();
let menssagens="";
let nome= "euuu";

function escolhaNome() {
   nome = prompt("Por favor para se cadastrar digite seu nome:");
    verificarNome();
}
function verificarNome(){
    let promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants',{nome});
    promise.then(iniciarSala);
    promise.catch(quandoErro);   
}

function quandoErro(erro){
    console.log(erro.response);
    if(erro.response.status === 400){
       nome = prompt("Esse nome já foi escolhido, por favor digite outro:");
       console.log(erro)
    }

    verificarNome(nome);
}

function iniciarSala(){
    const promise = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");
    console.log("oi")
    promise.then(carregarMenssagens);
    promise.catch(quandoErro);
}

function carregarMenssagens(menssagens){
    let corpo = document.querySelector(".corpo");
     menssagem = corpo.innerHTML;
 
     for(let i=0; i<menssagens.data.length; i++){
         let tipo = menssagens.data[i].type;
        construirMenssagem(menssagens,tipo,i); 
     }

     corpo.innerHTML = menssagem;
     corpo.lastChild.scrollIntoView();
     
 }

function construirMenssagem(menssagens,tipo,i){
         let deQuem = menssagens.data[i].from;
         let paraQuem = menssagens.data[i].to;
         let texto = menssagens.data[i].text;
         let horario = menssagens.data[i].time;
    if (tipo === "status"){
        menssagem += `<div class="caixa ${tipo}"><span class="horario">(${horario})</span><strong>${deQuem}</strong>${texto}</div>`    
    }

    if(tipo === "message"){
        menssagem += `<div class="caixa ${tipo}"><span class="horario">(${horario})</span><strong>${deQuem}</strong> para <strong>${paraQuem}</strong>: ${texto}</div>`  
    }

    if(tipo === "private_message"){
        menssagem += `<div class="caixa ${tipo}"><span class="horario">(${horario})</span><strong>${deQuem}</strong> reservadamente para <strong>${paraQuem}</strong>: ${texto}</div>`    
    }
}


function enviarMenssagem(){
    let textoInput = document.querySelector("input").value;
    let corpo = document.querySelector(".corpo");
    let menssagem = corpo.innerHTML;
    let data = new Date();
    let hora = data.getHours(); 
    let min = data.getMinutes();        
    let seg = data.getSeconds(); 
    let horario = `(${hora}:${min}:${seg})`;

    menssagem += `<div class="caixa message"><span class="horario">${horario}</span><strong>${nome}</strong> para <strong>Todos</strong>: ${textoInput}</div>`;

    corpo.innerHTML = menssagem;
    corpo.lastChild.scrollIntoView();
    textoInput = ""; 
}