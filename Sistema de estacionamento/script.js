const TOTAL_VAGAS = 12;
const TARIFA_POR_HORA = 4.0;

let vagas = JSON.parse(localStorage.getItem("estacionamento_vagas")) || [];
let historico = JSON.parse(localStorage.getItem("estacionamento_historico")) || [];
let meuGrafico = null;
let modoGrafico = "horas";

function salvar() {
  localStorage.setItem("estacionamento_vagas", JSON.stringify(vagas));
  localStorage.setItem("estacionamento_historico", JSON.stringify(historico));
}

function adicionarCarro() {
  const placaInput = document.getElementById("placa");
  const modeloInput = document.getElementById("modelo");

  const placa = placaInput.value.trim().toUpperCase();
  const modelo = modeloInput.value.trim();

  if (!placa || !modelo) {
    alert("Por favor, preencha a placa e o modelo do veículo!");
    return;
  }

  if (vagas.length >= TOTAL_VAGAS) {
    alert("Atenção: Estacionamento totalmente lotado!");
    return;
  }

  if (vagas.some(carro => carro.placa === placa)) {
    alert("Erro: Já existe um veículo registrado com esta placa!");
    return;
  }

  vagas.push({
    placa: placa,
    modelo: modelo,
    entrada: Date.now()
  });

  salvar();
  placaInput.value = "";
  modeloInput.value = "";
  renderizar();
}

function removerCarro(placaRemover) {
  const carro = vagas.find(c => c.placa === placaRemover);
  if (!carro) return;

  const agora = Date.now();
  const duracaoMs = agora - carro.entrada;
  const minutosTotais = Math.ceil(duracaoMs / 60000);
  const horas = Math.max(1, Math.ceil(minutosTotais / 60));
  const valorTotal = horas * TARIFA_POR_HORA;

  const confirmacao = confirm(
    `Dar saída ao veículo ${carro.placa}?\n` +
    `Tempo de permanência: ${minutosTotais} min\n` +
    `Valor cobrado: R$ ${valorTotal.toFixed(2)}`
  );

  if (confirmacao) {
    historico.unshift({
      placa: carro.placa,
      modelo: carro.modelo,
      entrada: new Date(carro.entrada).toLocaleString("pt-BR"),
      saida: new Date(agora).toLocaleString("pt-BR"),
      permanencia: `${minutosTotais} min`,
      valor: `R$ ${valorTotal.toFixed(2)}`
    });

    vagas = vagas.filter(c => c.placa !== placaRemover);

    salvar();
    renderizar();
  }
}

function limparHistorico() {
  if (confirm("Tem certeza que deseja limpar todo o histórico de movimentações?")) {
    historico = [];
    salvar();
    renderizar();
  }
}

function formatarTempoPermanencia(tempoEntrada) {
  const minutos = Math.floor((Date.now() - tempoEntrada) / 60000);
  if (minutos < 1) return "Entrou agora";
  return `${minutos} min no pátio`;
}

function alternarModoGrafico(modo) {
  modoGrafico = modo;
  document.getElementById("btn-horas").classList.toggle("active", modo === "horas");
  document.getElementById("btn-valor").classList.toggle("active", modo === "valor");
  atualizarGrafico();
}

function atualizarGrafico() {
  const ctx = document.getElementById("graficoPizza");
  if (!ctx) return;

  const labels = [];
  const dados = [];
  const cores = [
    "#ef4444", "#3b82f6", "#22c55e", "#eab308", 
    "#a855f7", "#ec4899", "#14b8a6", "#f97316",
    "#6366f1", "#84cc16", "#06b6d4", "#64748b"
  ];

  for (let i = 0; i < TOTAL_VAGAS; i++) {
    const carro = vagas[i];
    labels.push(`Vaga ${i + 1}`);

    if (carro) {
      const duracaoMs = Date.now() - carro.entrada;
      const horasFrac = duracaoMs / (1000 * 60 * 60);

      if (modoGrafico === "horas") {
        dados.push(Number(horasFrac.toFixed(2)));
      } else {
        const horasCobradas = Math.max(1, Math.ceil(duracaoMs / 60000 / 60));
        dados.push(horasCobradas * TARIFA_POR_HORA);
      }
    } else {
      dados.push(0);
    }
  }

  if (meuGrafico) {
    meuGrafico.destroy();
  }

  meuGrafico = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [{
        data: dados,
        backgroundColor: cores,
        borderWidth: 1,
        borderColor: "#1e293b"
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#cbd5e1", font: { size: 11 } }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const valor = context.raw;
              if (modoGrafico === "horas") {
                return ` ${context.label}: ${valor} Horas`;
              } else {
                return ` ${context.label}: R$ ${valor.toFixed(2)}`;
              }
            }
          }
        }
      }
    }
  });
}

function renderizar() {
  const patioContainer = document.getElementById("patio");
  const termoBusca = (document.getElementById("busca")?.value || "").trim().toUpperCase();

  if (!patioContainer) return;
  patioContainer.innerHTML = "";

  for (let i = 0; i < TOTAL_VAGAS; i++) {
    const carro = vagas[i];
    const vagaDiv = document.createElement("div");
    vagaDiv.classList.add("vaga");

    if (carro) {
      const atendeFiltro = !termoBusca || carro.placa.includes(termoBusca);

      vagaDiv.classList.add("ocupada");
      if (!atendeFiltro) vagaDiv.style.opacity = "0.3";

      vagaDiv.innerHTML = `
        <span class="numero-vaga">Vaga ${i + 1}</span>
        <div class="placa">${carro.placa}</div>
        <div class="modelo">${carro.modelo}</div>
        <div class="tempo">${formatarTempoPermanencia(carro.entrada)}</div>
        <button class="btn btn-perigo btn-saida" onclick="removerCarro('${carro.placa}')">
          Dar Saída
        </button>
      `;
    } else {
      vagaDiv.innerHTML = `
        <span class="numero-vaga">Vaga ${i + 1}</span>
        <div class="placa" style="color: #22c55e;">LIVRE</div>
        <div class="modelo">Disponível</div>
      `;
    }

    patioContainer.appendChild(vagaDiv);
  }

  const elOcupadas = document.getElementById("ocupadas");
  const elLivres = document.getElementById("livres");

  if (elOcupadas) elOcupadas.textContent = vagas.length;
  if (elLivres) elLivres.textContent = TOTAL_VAGAS - vagas.length;

  const tabelaHistorico = document.getElementById("tabela-historico");
  if (tabelaHistorico) {
    if (historico.length === 0) {
      tabelaHistorico.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b;">Nenhuma movimentação registada.</td></tr>`;
    } else {
      tabelaHistorico.innerHTML = historico.map(item => `
        <tr>
          <td><strong>${item.placa}</strong></td>
          <td>${item.modelo}</td>
          <td>${item.entrada}</td>
          <td>${item.saida}</td>
          <td>${item.permanencia}</td>
          <td style="color: #22c55e; font-weight: bold;">${item.valor}</td>
        </tr>
      `).join("");
    }
  }

  atualizarGrafico();
}

setInterval(() => {
  const relogio = document.getElementById("relogio");
  if (relogio) {
    relogio.textContent = new Date().toLocaleString("pt-BR");
  }
  renderizar();
}, 60000);

setInterval(() => {
  const relogio = document.getElementById("relogio");
  if (relogio) {
    relogio.textContent = new Date().toLocaleString("pt-BR");
  }
}, 1000);

renderizar();
