# Implementação com Princípios SOLID - ESM Forum
 
Este documento descreve a implementação da funcionalidade de **Sistema de Votação em Perguntas (US-01)** no backend do ESM Forum, demonstrando a aplicação prática dos princípios **SRP**, **DIP** e **OCP**.
 
---
 
## 1. Funcionalidade Implementada
 
Foi implementado o mecanismo de votação em perguntas (upvote/downvote):
- **Novo voto:** Registra a intenção do usuário (+1 para upvote ou -1 para downvote) e atualiza o saldo consolidado da pergunta.
- **Inversão de voto:** Se o usuário já votou downvote e clica em upvote (ou vice-versa), o sistema recalcula o saldo aplicando a variação de 2 pontos.
- **Cancelamento de voto:** Se o usuário clicar no mesmo botão do voto atual, o voto é anulado e o ponto é subtraído do saldo.
- **Persistência:** Tabela `votos` criada no SQLite garantindo unicidade por par `(id_pergunta, id_usuario)`.
 
---
 
## 2. Aplicação dos Princípios SOLID
 
A implementação foi estruturada para não sobrecarregar o `server.js` nem o `modelo.js`, dividindo o código em módulos com papéis bem delimitados:
 
### a) Single Responsibility Principle (SRP)
Cada classe e módulo possui uma responsabilidade única:
 
1. **Camada de Acesso a Dados (`repositorioVotos.js`):**  
   Responsável estritamente pelas consultas SQL na tabela `votos` do SQLite:
   ```javascript
   class RepositorioVotos {
     buscarVoto(id_pergunta, id_usuario) { ... }
     inserirVoto(id_pergunta, id_usuario, tipo) { ... }
     atualizarVoto(id_pergunta, id_usuario, novoTipo) { ... }
     removerVoto(id_pergunta, id_usuario) { ... }
     obterSaldoVotos(id_pergunta) { ... }
   }
   ```
 
2. **Camada de Regras de Negócio (`votacaoService.js`):**  
   Focada exclusivamente na lógica de votação (decidir se insere, cancela ou inverte o voto), sem conter nenhuma linha de SQL:
   ```javascript
   class VotacaoService {
     votar(id_pergunta, id_usuario, tipoVoto) {
       const votoExistente = this.repositorio.buscarVoto(id_pergunta, id_usuario);
       if (!votoExistente) { /* registra novo */ }
       if (votoExistente.tipo === tipoVoto) { /* cancela voto */ }
       /* inverte voto */
     }
   }
   ```
 
3. **Camada HTTP (`server.js`):**  
   Cuida apenas do recebimento da requisição HTTP e envio da resposta JSON:
   ```javascript
   app.post('/perguntas/:id/voto', (req, res) => {
     const resultado = votacaoService.votar(id_pergunta, id_usuario, tipo);
     res.json(resultado);
   });
   ```
 
---
 
### b) Dependency Inversion Principle (DIP)
O serviço de votação de alto nível (`VotacaoService`) não cria nem depende diretamente do SQLite ou do arquivo `bd_utils.js`. Em vez disso, ele recebe o repositório como dependência injetada no construtor:
 
```javascript
// votacaoService.js
class VotacaoService {
  constructor(repositorioVotos) {
    if (!repositorioVotos) {
      throw new Error('Um repositório de votos válido deve ser fornecido.');
    }
    this.repositorio = repositorioVotos; // Depende da abstração injetada
  }
}
```
 
No `server.js`, faz-se a injeção da implementação concreta:
```javascript
// server.js
const repositorioVotos = new RepositorioVotos();
const votacaoService = new VotacaoService(repositorioVotos);
```
 
*Benefício:* Permite que em testes de unidade possamos injetar um repositório simulado em memória (`RepositorioMemoria`) sem tocar no banco SQLite real.
 
---
 
### c) Open/Closed Principle (OCP)
O serviço foi desenhado para estar aberto para extensão, mas fechado para modificação. Os tipos e pesos dos votos são tratados através de uma estrutura padronizada e extensível:
 
```javascript
// votacaoService.js
const TIPOS_VOTO = Object.freeze({
  UPVOTE: 1,
  DOWNVOTE: -1
});
```
 
*Benefício:* Se no futuro forem criadas novas modalidades de avaliação no fórum (por exemplo, voto com peso dobrado para moderadores ou voto com pontuação customizada), o fluxo central de `votar()` aceita o valor numérico sem necessidade de alterar as verificações internas do método.
 
---
 
## 3. Validação da Execução
 
A funcionalidade foi validada localmente via requisição HTTP:
 
```bash
curl -X POST http://localhost:5000/perguntas/1/voto \
  -H "Content-Type: application/json" \
  -d '{"id_usuario": 1, "tipo": 1}'
```
 
**Resposta obtida:**
```json
{
  "status": "registrado",
  "tipo": 1,
  "saldo_votos": 1
}
```