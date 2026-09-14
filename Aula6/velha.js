let j1 = "", j2 = "";
let vez = "X";
let jogo = ["","","","","","","","",""];
let jogadas = 0;
let ativo = true;

let pontos1 = 0;
let pontos2 = 0;

function iniciar() {
  j1 = document.getElementById("j1").value;
  j2 = document.getElementById("j2").value;

  jogo = ["","","","","","","","",""];
  vez = "X";
  jogadas = 0;
  ativo = true;

  document.querySelectorAll(".casa").forEach(c => {
    c.classList.remove("x","o");
  });

  atualizarPlacar(); // 🔥 mostra o placar

  document.getElementById("msg").innerText = "Vez de " + j1;
  document.getElementById("info").innerText = "Jogadas: 0";
}

function jogar(p) {
  if (!ativo || jogo[p] !== "") return;

  jogo[p] = vez;
  jogadas++;

  let casa = document.querySelectorAll(".casa")[p];
  casa.classList.add(vez === "X" ? "x" : "o");

  // ✅ VERIFICA SE GANHOU
  if (ganhou()) {

    // 🔥 SOMA PONTO
    if (vez === "X") {
      pontos1++;
    } else {
      pontos2++;
    }

    document.getElementById("msg").innerText =
      (vez === "X" ? j1 : j2) + " venceu!";

    atualizarPlacar(); // 🔥 ATUALIZA PLACAR

    ativo = false;
    return;
  }

  // empate
  if (jogadas === 9) {
    document.getElementById("msg").innerText = "Empate!";
    ativo = false;
    return;
  }

  // troca jogador
  vez = (vez === "X") ? "O" : "X";

  document.getElementById("msg").innerText =
    "Vez de " + (vez === "X" ? j1 : j2);

  document.getElementById("info").innerText =
    "Jogadas: " + jogadas;
}

function atualizarPlacar() {
  document.getElementById("placar").innerText =
    "Placar: " + j1 + " (" + pontos1 + ") x " + j2 + " (" + pontos2 + ")";
}

function limparPlacar() {
  pontos1 = 0;
  pontos2 = 0;
  atualizarPlacar();
}

function ganhou() {
  let c = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  return c.some(a =>
    jogo[a[0]] !== "" &&
    jogo[a[0]] === jogo[a[1]] &&
    jogo[a[1]] === jogo[a[2]]
  );
}