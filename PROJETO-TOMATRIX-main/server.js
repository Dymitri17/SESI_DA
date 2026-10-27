const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const registrarSequencia = require("./public/sequencia-api.js");

// Cria e conecta ao banco de dados em arquivo local automático
const db = new sqlite3.Database("./tomatrix.db");

// Estufas fixas do sistema.
const ESTUFAS = [
  { cultura: "tomate", nome: "Estufa de Tomate" },
  { cultura: "alface", nome: "Estufa de Alface" },
  { cultura: "agriao", nome: "Estufa de Agrião" },
];

function criarTabelas() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // 1. Cria tabela canteiros
      db.run(`
        CREATE TABLE IF NOT EXISTS canteiros (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          cultura TEXT UNIQUE
        )
      `);

      // 2. Cria tabela leituras
      db.run(`
        CREATE TABLE IF NOT EXISTS leituras (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          canteiro_id INTEGER NOT NULL,
          quando TEXT NOT NULL,
          valores TEXT NOT NULL,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (canteiro_id) REFERENCES canteiros(id) ON DELETE CASCADE
        )
      `);

      // Insere as estufas iniciais uma por uma de forma simples
      ESTUFAS.forEach((estufa) => {
        db.run(
          `INSERT INTO canteiros (nome, cultura) VALUES (?, ?) 
           ON CONFLICT(cultura) DO UPDATE SET nome = excluded.nome`,
          [estufa.name || estufa.nome, estufa.cultura]
        );
      });
      
      resolve();
    });
  });
}

criarTabelas()
  .then(() => console.log("Banco de dados SQLite inicializado com sucesso!"))
  .catch((erro) => console.error("Erro ao criar tabelas:", erro));

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ROTAS DA API ADAPTADAS PARA SQLITE

app.get("/api/canteiros", (req, res) => {
  db.all("SELECT * FROM canteiros", [], (err, canteiros) => {
    if (err) return res.status(500).json({ error: err.message });
    
    db.all("SELECT * FROM leituras ORDER BY criado_em ASC", [], (err, leiturasRows) => {
      if (err) return res.status(500).json({ error: err.message });

      const resposta = canteiros.map((c) => {
        return {
          id: c.id,
          nome: c.nome,
          cultura: c.cultura,
          leituras: leiturasRows
            .filter((l) => l.canteiro_id === c.id)
            .map((l) => {
              let valoresParsed;
              try { valoresParsed = JSON.parse(l.valores); } catch(e) { valoresParsed = l.valores; }
              return {
                id: l.id,
                quando: l.quando,
                valores: valoresParsed,
                criadoEm: l.criado_em
              };
            })
        };
      });
      res.json(resposta);
    });
  });
});

app.post("/api/canteiros/:id/leituras", (req, res) => {
  const { quando, valores } = req.body;
  const canteiro_id = req.params.id;
  const valoresString = typeof valores === 'object' ? JSON.stringify(valores) : valores;

  db.run(
    "INSERT INTO leituras (canteiro_id, quando, valores) VALUES (?, ?, ?)",
    [canteiro_id, quando, valoresString],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, quando, valores });
    }
  );
});

app.delete("/api/leituras/:id", (req, res) => {
  db.run("DELETE FROM leituras WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(204);
  });
});

app.delete("/api/canteiros/:id/leituras", (req, res) => {
  db.run("DELETE FROM leituras WHERE canteiro_id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.sendStatus(204);
  });
});

// Mock simples para o pool do pg não quebrar o script de sequencia externo
const poolMock = { query: (q, p) => new Promise((res) => res({ rows: [] })) };
registrarSequencia(app, poolMock);

app.listen(3000, () => console.log("Rodando em http://localhost:3000"));
