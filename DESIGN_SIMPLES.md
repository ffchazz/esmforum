# Análise de Design Simples e YAGNI - Backend ESM Forum
 
Análise do código do backend (`server.js` e `modelo.js`) com foco em **Design Simples** e no princípio **YAGNI** (*You Aren't Gonna Need It*).
 
---
 
## 1. Estrutura Atual
 
O backend foi feito de forma bem compacta:
- `server.js`: configura o Express e expõe as rotas da API na porta 5000.
- `modelo.js`: concentra as regras e as consultas SQL ao SQLite.
 
Em vez de criar uma pasta `routes/` separada com vários arquivos para apenas 4 endpoints, tudo foi mantido junto. Para o tamanho atual do projeto, isso evita complexidade desnecessária.
 
---
 
## 2. Pontos Positivos (O que segue Design Simples e YAGNI)
 
### a) Consultas SQL diretas sem ORM
O projeto não adiciona bibliotecas pesadas de ORM (como Sequelize ou TypeORM). Ele usa SQL puro através do módulo `bd_utils.js`:
 
```javascript
function cadastrar_pergunta(texto) {
  const params = [texto, 1];
  const result = bd.exec('INSERT INTO perguntas (texto, id_usuario) VALUES(?, ?) RETURNING id_pergunta', params);
  return result.lastInsertRowid;
}
```
 
Isso segue o YAGNI porque resolve o problema com 3 linhas simples. Criar modelos complexos, migrations e abstrações de banco seria exagero para a necessidade atual.
 
### b) Injeção de dependência simples para testes
Para permitir testes de unidade com banco "mockado", foi criada uma função direta de 3 linhas:
 
```javascript
function reconfig_bd(mock_bd) {
  bd = mock_bd;
}
```
 
Em vez de instalar frameworks de injeção de dependência, uma simples reatribuição de variável resolve o problema de testabilidade.
 
### c) Rotas sem intermediários desnecessários
No `server.js`, os endpoints chamam o modelo e já retornam o JSON:
 
```javascript
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
 
Não existem camadas intermediárias ou serviços vazios apenas para repassar dados.
 
---
 
## 3. Oportunidades de Simplificação e Melhoria
 
### a) Problema N+1 em `listar_perguntas()`
Na listagem de perguntas, o código busca todas as perguntas e depois faz um loop chamando o banco mais uma vez para cada uma delas para contar as respostas:
 
```javascript
function listar_perguntas() {
  const perguntas = bd.queryAll('select * from perguntas', []);
  perguntas.forEach(pergunta => pergunta['num_respostas'] = get_num_respostas(pergunta['id_pergunta']));
  return perguntas;
}
```
 
Se existirem 50 perguntas, serão feitas 51 consultas. Isso pode ser simplificado usando uma única consulta SQL com `LEFT JOIN` e `COUNT`:
 
```sql
SELECT p.id_pergunta, p.texto, p.id_usuario, COUNT(r.id_resposta) as num_respostas
FROM perguntas p
LEFT JOIN respostas r ON p.id_pergunta = r.id_pergunta
GROUP BY p.id_pergunta;
```
 
Isso elimina o loop manual no JavaScript e reduz tudo a uma única chamada ao banco.
 
### b) Repetição de `try/catch` e inconsistência no `server.js`
Todas as rotas repetem o mesmo bloco de tratamento de erro:
 
```javascript
catch(erro) {
  res.status(500).json(erro.message);
}
```
 
Além disso, na rota de listar respostas, as consultas ao modelo ficaram fora do bloco `try`:
 
```javascript
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
```
 
Se `modelo.get_pergunta` falhar, o erro não é capturado pelo `catch`. A solução mais simples seria adotar um middleware global de erro no Express, evitando duplicar `try/catch` em todas as rotas.
 
### c) Organização das rotas para as novas funcionalidades
Ter todas as rotas dentro do `server.js` funcionava com 4 endpoints. Como o sistema vai receber mais 5 funcionalidades (votação, busca, tags, perfil e notificações), vale a pena separar os endpoints em arquivos de rotas usando `express.Router()`, deixando o `server.js` apenas com a subida do servidor.