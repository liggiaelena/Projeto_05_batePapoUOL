function enviarMenssagem(){
    let textoInput = document.querySelector("input").value;
    document.querySelector("input").reset;
    let corpo = document.querySelector(".corpo");
    let menssagem = corpo.innerHTML;

    menssagem += `<div class="caixa branco">
    ${textoInput}
    </div>`;

    corpo.innerHTML = menssagem;
    textoInput = ""; 
}