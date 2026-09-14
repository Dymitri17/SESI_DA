let j1="", j2="";
let contraRobo=false;
let usarTempo=false;

let tempo=30;
let timer;

let tabuleiro;
let selecionado=null;
let vez="branco";

// iniciar jogo
function iniciar(){
  j1 = document.getElementById("j1").value || "Jogador 1";
  j2 = document.getElementById("j2").value || "Jogador 2";

  contraRobo = document.getElementById("robo").checked;
  usarTempo = document.getElementById("tempo").checked;

  tabuleiro = [
  ["♜","♞","♝","♛","♚","♝","♞","♜"],
  ["♟","♟","♟","♟","♟","♟","♟","♟"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["♙","♙","♙","♙","♙","♙","♙","♙"],
  ["♖","♘","♗","♕","♔","♗","♘","♖"]
  ];

  vez="branco";
  selecionado=null;

  document.getElementById("msg").innerText="Vez de "+j1;

  if(usarTempo){
    tempo=30;
    iniciarTempo();
  } else {
    clearInterval(timer);
    document.getElementById("tempoTxt").innerText="";
  }

  desenhar();
}

// desenhar tabuleiro
function desenhar(){
  let t=document.getElementById("tabuleiro");
  t.innerHTML="";

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let c=document.createElement("div");
      c.className="casa "+((i+j)%2==0?"branco":"preto");
      c.innerText=tabuleiro[i][j];

      c.onclick=function(){clicar(i,j);};

      t.appendChild(c);
    }
  }
}

// clique jogador
function clicar(i,j){
  if(vez==="preto" && contraRobo) return;

  if(selecionado){
    tabuleiro[i][j]=tabuleiro[selecionado.i][selecionado.j];
    tabuleiro[selecionado.i][selecionado.j]="";
    selecionado=null;

    trocarTurno();
    desenhar();

    if(contraRobo && vez==="preto"){
      setTimeout(jogadaRobo,500);
    }

  } else if(tabuleiro[i][j]!=""){
    selecionado={i,j};
  }
}

// troca turno
function trocarTurno(){
  vez = (vez==="branco") ? "preto" : "branco";
  tempo=30;

  document.getElementById("msg").innerText =
    "Vez de " + (vez==="branco"?j1:j2);
}

// tempo
function iniciarTempo(){
  clearInterval(timer);
  timer = setInterval(()=>{
    tempo--;
    document.getElementById("tempoTxt").innerText="Tempo: "+tempo+"s";

    if(tempo<=0){
      trocarTurno();
    }
  },1000);
}

// 🤖 ROBÔ MELHORADO
function jogadaRobo(){
  let movimentos=[];

  for(let i=0;i<8;i++){
    for(let j=0;j<8;j++){
      let p = tabuleiro[i][j];

      // só peças pretas
      if(p !== "" && p === p.toLowerCase()){

        let dirs = [
          [1,0],[-1,0],[0,1],[0,-1],
          [1,1],[-1,-1],[1,-1],[-1,1]
        ];

        for(let d of dirs){
          let ni = i + d[0];
          let nj = j + d[1];

          if(ni>=0 && ni<8 && nj>=0 && nj<8){

            let destino = tabuleiro[ni][nj];

            // pode andar ou capturar branco
            if(destino === "" || destino === destino.toUpperCase()){
              movimentos.push({
                de:{i,j},
                para:{i:ni,j:nj},
                captura: destino !== ""
              });
            }
          }
        }
      }
    }
  }

  if(movimentos.length===0) return;

  // prioridade capturar
  let capturas = movimentos.filter(m=>m.captura);

  let escolha = capturas.length>0
    ? capturas[Math.floor(Math.random()*capturas.length)]
    : movimentos[Math.floor(Math.random()*movimentos.length)];

  tabuleiro[escolha.para.i][escolha.para.j] =
    tabuleiro[escolha.de.i][escolha.de.j];

  tabuleiro[escolha.de.i][escolha.de.j] = "";

  trocarTurno();
  desenhar();
}