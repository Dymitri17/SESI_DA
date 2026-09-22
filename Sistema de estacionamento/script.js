const limiteVagas = 12;
let veiculos = JSON.parse(localStorage.getItem("veiculos")) || [];

const lista = document.getElementById("lista");
const vagas = document.getElementById("vagas");
const mensagem = document.getElementById("mensagem");

document.getElementById("btnAdicionar")
  .addEventListener("click", adicionarVeiculo);

// Mostrar mensagem bonita
function mostrarMensagem(texto, tipo) {
  mensagem.textContent = texto;
  mensagem.className = "mensagem " + tipo;
  mensagem.style.display = "block";

  setTimeout(() => {
    mensagem.style.display = "none";
  }, 3000);
}

// Adicionar veículo
function adicionarVeiculo() {
  const placa = document.getElementById("placa").value.trim();
  const nome = document.getElementById("nome").value.trim();

  if (!placa || !nome) {
    mostrarMensagem("Preencha todos os campos!", "erro");
    return;
  }

  if (veiculos.length >= limiteVagas) {
    mostrarMensagem("Estacionamento cheio!", "erro");
    return;
  }

  if (veiculos.some(v => v.placa === placa)) {
    mostrarMensagem("Placa já cadastrada!", "erro");
    return;
  }

  const novo = {
    placa,
    nome,
    entrada: Date.now()
  };

  veiculos.push(novo);
  salvar();
  atualizarInterface();

  mostrarMensagem("Veículo adicionado!", "sucesso");
}

// Remover veículo
function removerVeiculo(index) {
  const veiculo = veiculos[index];
  const tempo = calcularTempo(veiculo.entrada);

  mostrarMensagem(`Tempo total: ${tempo}`, "sucesso");

  veiculos.splice(index, 1);
  salvar();
  atualizarInterface();
}

// Calcular tempo
function calcularTempo(inicio) {
  const diff = Date.now() - inicio;
  const minutos = Math.floor(diff / 60000);
  return minutos + " min";
}

// Atualizar tela
function atualizarInterface() {
  lista.innerHTML = "";

  veiculos.forEach((v, i) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${v.placa}</td>
      <td>${v.nome}</td>
      <td>${new Date(v.entrada).toLocaleTimeString()}</td>
      <td>${calcularTempo(v.entrada)}</td>
      <td><button onclick="removerVeiculo(${i})">Remover</button></td>
    `;

    lista.appendChild(tr);
  });

  vagas.textContent = `Vagas: ${veiculos.length} / ${limiteVagas}`;
}

// Salvar no localStorage
function salvar() {
  localStorage.setItem("veiculos", JSON.stringify(veiculos));
}

// Atualiza automaticamente o tempo a cada minuto
setInterval(atualizarInterface, 60000);

// Carregar ao iniciar
atualizarInterface();
