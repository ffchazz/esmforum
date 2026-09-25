# Análise dos Princípios SOLID no Backend - ESM Forum
 
Este documento analisa o código-fonte atual do backend do ESM Forum (`server.js` e `modelo.js`), identificando trechos que respeitam e trechos que violam os princípios de design orientado a objetos **SOLID**.
 
---
 
## 1. Pontos Positivos (Trechos que Seguem o SOLID)
 
### a) Inversão de Dependência (DIP) na injeção do banco em `modelo.js`
O `modelo.js` possui um mecanismo para trocar o módulo de banco de dados em tempo de execução:
 
```javascript
// modelo.js
var bd = require('./bd/bd_utils.js');
 
function reconfig_bd(mock_bd) {
  bd = mock_bd;
}
```
 
*Princípio atendido:* **DIP (Dependency Inversion Principle)**.  
*Por que segue:* O modelo depende de uma referência variável (`bd`) e disponibiliza uma função para substituí-la por um mock durante os testes de unidade. Isso evita que o modelo fique rigidamente preso ao banco de dados SQLite real, permitindo injetar um dublê de teste sem alterar o código das funções de negócio.
 
---
 
### b) Responsabilidade Única (SRP) nas funções de consulta do `modelo.js`
As funções de busca de dados no `modelo.js` são focadas e granulares:
 
```javascript
// modelo.js
function get_pergunta(id_pergunta) {
  return bd.query('select * from perguntas where id_pergunta = ?', [id_pergunta]);
}
 
function get_respostas(id_pergunta) {
  return bd.queryAll('select * from respostas where id_pergunta = ?', [id_pergunta]);
}
```
 
*Princípio atendido:* **SRP (Single Responsibility Principle)**.  
*Por que segue:* Cada função tem um único motivo para mudar e executa apenas uma tarefa bem delimitada. `get_pergunta` cuida exclusivamente de carregar uma pergunta por ID, enquanto `get_respostas` carrega as respostas vinculadas, sem misturar lógica de apresentação HTTP ou regras de escrita.
 
---
 
### c) Separação de Responsabilidades (SRP) entre Servidor e Modelo
Existe uma fronteira nítida entre o `server.js` e o `modelo.js`:
 
```javascript
// server.js
app.post('/perguntas', (req, res) => {
  try {
    const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
    res.json({id_pergunta: id_pergunta});
  }
  catch(erro) {
    res.status(500).json(erro.message);
  }
});
```
 
*Princípio atendido:* **SRP (Single Responsibility Principle)**.  
*Por que segue:* O arquivo `server.js` foca apenas na camada de comunicação HTTP (interpretar o `req.body`, definir status code e serializar o JSON de resposta). Já as regras de negócio e consultas SQL ficam isoladas no `modelo.js`, evitando que a rota faça acesso direto ao SQLite.
 
---
 
## 2. Oportunidades de Melhoria (Trechos que Violam o SOLID)
 
### a) Violação de Responsabilidade Única (SRP) no `server.js`
Atualmente, o arquivo `server.js` acumula múltiplas funções que deveriam estar separadas:
 
```javascript
// server.js concentra tudo no mesmo arquivo:
const app = express();
// 1. Configura middlewares e CORS
app.use((req, res, next) => { ... });
 
// 2. Controla rotas de perguntas
app.get('/', ...);
app.post('/perguntas', ...);
 
// 3. Controla rotas de respostas
app.get('/respostas/:id_pergunta', ...);
app.post('/respostas', ...);
 
// 4. Inicializa o servidor HTTP na porta 5000
app.listen(port, ...);
```
 
*Princípio violado:* **SRP (Single Responsibility Principle)**.  
*Problema:* O arquivo tem múltiplos motivos para mudar: alterações na configuração do servidor, mudanças nas rotas de perguntas ou alterações nos endpoints de respostas.  
*Como melhorar:* Separar os endpoints em arquivos de rotas dedicados usando `express.Router()` (por exemplo, `routes/perguntas.js` e `routes/respostas.js`), mantendo o `server.js` focado estritamente na inicialização do servidor e middlewares globais.
 
---
 
### b) Violação do Princípio Aberto/Fechado (OCP) e Inversão de Dependência (DIP) no `modelo.js`
As funções de `modelo.js` estão fortemente acopladas a comandos SQL escritos diretamente no corpo das funções:
 
```javascript
// modelo.js
function cadastrar_pergunta(texto) {
  const params = [texto, 1];
  const result = bd.exec('INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta', params);
  return result.lastInsertRowid;
}
```
 
*Princípios violados:* **OCP (Open/Closed Principle)** e **DIP (Dependency Inversion Principle)**.  
*Problema:* Se for necessário trocar o banco SQLite por outro banco relacional (ex: PostgreSQL) ou por armazenamento em memória, será necessário abrir o arquivo `modelo.js` e alterar o código SQL de todas as funções (o módulo não está fechado para modificação). Além disso, o modelo depende diretamente da implementação concreta de `bd_utils.js`.  
*Como melhorar:* Criar uma camada de abstração de Repositório (`RepositorioDados`). O modelo receberia uma interface abstrata de repositório com métodos como `salvarPergunta(pergunta)` e `buscarPerguntaPorId(id)`. Assim, para trocar de banco bastaria plugar uma nova classe concreta de repositório, sem alterar uma única linha da lógica de negócio em `modelo.js`.