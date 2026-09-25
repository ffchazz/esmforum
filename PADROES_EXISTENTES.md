# Padrões de Projeto Existentes no ESM Forum
 
Análise dos padrões de projeto identificados na base de código atual do backend (`server.js`, `modelo.js` e `bd/bd_utils.js`).
 
---
 
## 1. Padrão Facade (Fachada) - Estrutural
 
### Onde está aplicado:
No arquivo `modelo.js`.
 
### Descrição e Funcionamento:
O padrão Facade fornece uma interface simplificada para um subsistema mais complexo. No ESM Forum, o arquivo `modelo.js` atua como uma fachada entre o servidor Express (`server.js`) e as chamadas de baixo nível do SQLite (`bd_utils.js`).
 
Em vez de o `server.js` abrir conexões, tratar parâmetros SQL e manipular cursores de banco, ele apenas chama funções diretas:
 
```javascript
// O server.js interage apenas com a fachada:
const perguntas = modelo.listar_perguntas();
const id_pergunta = modelo.cadastrar_pergunta(req.body.pergunta);
```
 
### Análise de Maturidade:
- **Estado atual:** A implementação cumpre o objetivo de isolar o SQL das rotas HTTP.
- **Oportunidade de melhoria:** Atualmente, a fachada é um módulo único que mistura perguntas, respostas e regras de contagem. À medida que novas funcionalidades entram (como votação e busca), essa fachada deveria ser dividida em serviços ou repositórios específicos por entidade.
 
---
 
## 2. Padrão Singleton - Criacional
 
### Onde está aplicado:
No módulo de banco de dados `bd/bd_utils.js`.
 
### Descrição e Funcionamento:
O Singleton garante que uma classe ou recurso possua apenas uma única instância durante todo o ciclo de vida da aplicação, fornecendo um ponto global de acesso.
 
No Node.js, quando um arquivo faz `require('./bd/bd_utils.js')`, o sistema de módulos armazena em cache o objeto retornado. A conexão física com o arquivo SQLite (`better-sqlite3` / `sqlite3`) é aberta uma única vez na inicialização e reutilizada por todas as rotas do `server.js` e funções do `modelo.js`.
 
### Análise de Maturidade:
- **Estado atual:** Funciona bem graças ao cache nativo do CommonJS (`require`), evitando sobrecarga de abrir e fechar o arquivo SQLite a cada requisição.
- **Oportunidade de melhoria:** A implementação é implícita (depende do comportamento do runtime do Node). Em uma arquitetura orientada a objetos mais rigorosa, poderia ser encapsulada em uma classe com método formal `DatabaseConnection.getInstance()`.
 
---
 
## 3. Padrão Chain of Responsibility (Cadeia de Responsabilidade) - Comportamental
 
### Onde está aplicado:
No fluxo de middlewares e rotas do `server.js`.
 
### Descrição e Funcionamento:
O padrão Chain of Responsibility encadeia manipuladores para processar uma requisição de forma sequencial, onde cada elo da cadeia pode processar a mensagem ou repassá-la para o próximo elo.
 
No `server.js`, a requisição HTTP passa sucessivamente pelos middlewares antes de atingir o endpoint final:
 
```javascript
// 1º elo da cadeia: interpreta payload JSON
app.use(express.json());
 
// 2º elo da cadeia: adiciona cabeçalhos de CORS e delega via next()
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
 
// 3º elo da cadeia: rota específica
app.post('/perguntas', (req, res) => { ... });
```
 
### Análise de Maturidade:
- **Estado atual:** Completo e nativo da arquitetura do Express. Cada middleware possui uma função única e passa o controle adiante através da função `next()`.
- **Oportunidade de melhoria:** Falta um middleware final de captura de erros no fim da cadeia (`app.use((err, req, res, next) => ...)`), o que hoje obriga cada rota a manter seu próprio bloco `try/catch`.