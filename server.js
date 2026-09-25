const express = require('express');
const modelo = require('./modelo.js');
const RepositorioVotos = require('../repositorioVotos.js');
const { VotacaoService } = require('./votacaoService.js');
 
const app = express();
app.use(express.json());
 
// Injeção de dependência (DIP): VotacaoService recebe a instância do repositório
const repositorioVotos = new RepositorioVotos();
const votacaoService = new VotacaoService(repositorioVotos);
 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
 
app.get('/', (req, res) => {
  try {
    const perguntas = modelo.listar_perguntas();
    res.send(perguntas);
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
 
app.post('/perguntas', (req, res) => {
  try {
    const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
    res.json({id_pergunta: id_pergunta});
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
 
app.get('/respostas/:id_pergunta', (req, res) => {
  const id_pergunta = req.params.id_pergunta;
  const pergunta = modelo.get_pergunta(id_pergunta);
  const respostas = modelo.get_respostas(id_pergunta);
  try {
    res.json({
      pergunta: pergunta,
      respostas: respostas
    });
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
 
app.post('/respostas', (req, res) => {
  try {
    const id_pergunta = req.body.id_pergunta;
    const resposta = req.body.resposta;
    const id_resposta = modelo.cadastrar_resposta(id_pergunta, resposta);
    res.json({id_resposta: id_resposta});
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
 
// Nova rota: Sistema de Votação em Perguntas (US-01 - Aplicando SOLID)
app.post('/perguntas/:id/voto', (req, res) => {
  try {
    const id_pergunta = parseInt(req.params.id, 10);
    const id_usuario = req.body.id_usuario || 1;
    const tipo = parseInt(req.body.tipo, 10);
 
    const resultado = votacaoService.votar(id_pergunta, id_usuario, tipo);
    res.json(resultado);
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});
 
// Nova rota auxiliar: Obter saldo de votos de uma pergunta
app.get('/perguntas/:id/votos', (req, res) => {
  try {
    const id_pergunta = parseInt(req.params.id, 10);
    const saldo = votacaoService.obterSaldo(id_pergunta);
    res.json({ id_pergunta, saldo_votos: saldo });
  } catch (erro) {
    res.status(400).json({ erro: erro.message });
  }
});
 
// espera e trata requisições de clientes
const port = 5000;
app.listen(port, 'localhost', () => {
  console.log(`ESM Forum rodando em ${port}`);
});