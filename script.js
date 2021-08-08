


escolhaNome();

function escolhaNome() {
   let nome = prompt("Por favor para se cadastrar digite seu nome:");
    verificarNome(nome);
}
function verificarNome(nome){
    let promise = axios.post('https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants',{nome});
    promise.then(iniciarSala);
    //promise.catch(quandoErro);   
}

function quandoErro(erro){
    console.log(erro.response);
    let nome;
    if(erro.response.status === 400){
       nome = prompt("Esse nome já foi escolhido, por favor digite outro:");
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
    let menssagem = corpo.innerHTML;

    for(let i=0; i<menssagens.data.length; i++){
        console.log("hey")
        let tipo = menssagens.data[i].type;
        let deQuem = menssagens.data[i].from;
        let paraQuem = menssagens.data[i].to;
        let texto = menssagens.data[i].text;
        let horario = menssagens.data[i].time;
        
        menssagem += `<div class="caixa ${tipo}"><span class="horario">(${horario})</span><span class="nome">${deQuem}</span>para<span class="nome">${paraQuem}</span>: ${texto}</div>`;
    }
    corpo.innerHTML = menssagem;
}

function enviarMenssagem(){
    let textoInput = document.querySelector("input").value;
    let corpo = document.querySelector(".corpo");
    let menssagem = corpo.innerHTML;

    menssagem += `<div class="caixa message">
    ${textoInput}
    </div>`;

    corpo.innerHTML = menssagem;
    textoInput = ""; 
}