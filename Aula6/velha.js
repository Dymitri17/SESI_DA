let jogador1 = "";
let jogador2 = "";
let jogadorAtual = "X";
let jogo = ["", "", "", "", "", "", "", "", ""];

function iniciarJogo() {
    jogador1 = document.getElementById("jogador1").value;
    jogador2 = document.getElementById("jogador2").value;

    if (jogador1 === "" || jogador2 === "") {
        alert("Digite o nome dos dois jogadores!");
        return;
    }

    jogo = ["", "", "", "", "", "", "", "", ""];
    jogadorAtual = "X";

    let casas = document.querySelectorAll(".casa");
    casas.forEach(casa => {
    casa.innerHTML = "";
    casa.classList.remove("x", "o");
});
    document.getElementById("mensagem").innerText =
        "Vez de " + jogador1 + " (X)";
}

function jogar(pos) {
    if (jogo[pos] !== "") return;

    jogo[pos] = jogadorAtual;
let casa = document.querySelectorAll(".casa")[pos];

if (jogadorAtual === "X") {
    casa.classList.add("x");
} else {
    casa.classList.add("o");
}

    if (verificarVencedor()) {
        let vencedor = jogadorAtual === "X" ? jogador1 : jogador2;
        document.getElementById("mensagem").innerText =
            vencedor + " venceu!";
        return;
    }

    if (!jogo.includes("")) {
        document.getElementById("mensagem").innerText = "Empate!";
        return;
    }

    jogadorAtual = jogadorAtual === "X" ? "O" : "X";

    document.getElementById("mensagem").innerText =
        "Vez de " + (jogadorAtual === "X" ? jogador1 : jogador2) +
        " (" + jogadorAtual + ")";
}

function verificarVencedor() {
    const combinacoes = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    return combinacoes.some(c =>
        jogo[c[0]] !== "" &&
        jogo[c[0]] === jogo[c[1]] &&
        jogo[c[1]] === jogo[c[2]]
    );
}