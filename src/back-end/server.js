const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const methodOverride = require('method-override');
const path = require('path');

const app = express();
const db = new sqlite3.Database('./database.db');

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Listar usuários
app.get('/', (req, res) => {
db.all('SELECT * FROM usuarios', (err, rows) => {
if (err) return res.send('Erro ao buscar usuários');
res.render('index', { usuarios: rows });
});
});

// Inserir novo usuário
app.post('/usuarios', (req, res) => {
const {
nome_completo, apelido, telefone, data_nascimento, email, senha,
cep, rua, cidade, estado, pais,
formacao, salario, redes_sociais, jogos_favoritos, profissao
} = req.body;

db.run(`
    INSERT INTO usuarios (
      nome_completo, apelido, telefone, data_nascimento,
      email, senha, cep, rua, cidade, estado, pais,
      formacao, salario, redes_sociais, jogos_favoritos, profissao
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, (err) => {
    if (err) {
      console.error("❌ Erro ao inserir:", err.message);
    } else {
      console.log("✅ Usuário inserido com sucesso!");
    }
  });
});

// Excluir usuário
app.delete('/usuarios/:id', (req, res) => {
db.run('DELETE FROM usuarios WHERE id = ?', [req.params.id], err => {
if (err) return res.send('Erro ao excluir');
res.redirect('/');
});
});

// Iniciar servidor
app.listen(3000, () => {
console.log('Servidor rodando em http://localhost:3000');
});