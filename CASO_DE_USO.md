# Caso de Uso Detalhado - ESM Forum
 
Detalhamento formal do caso de uso da funcionalidade de votação em perguntas (**US-01**).
 
---
 
## Caso de Uso: UC01 - Votar em Pergunta
 
**Atores:**  
- Usuário do Fórum (membro autenticado ou identificado da comunidade)
 
**Pré-condições:**  
1. O backend e o frontend da aplicação estão em execução e comunicando-se normalmente.
2. A pergunta alvo do voto existe e está cadastrada no banco de dados SQLite.
 
---
 
### Fluxo Principal (Registro de novo voto)
 
1. O usuário acessa a página do fórum e visualiza a listagem de perguntas.
2. O sistema exibe, ao lado de cada pergunta, os botões de voto positivo (upvote), voto negativo (downvote) e o saldo atual de votos.
3. O usuário clica no botão de voto desejado (upvote ou downvote) em uma pergunta.
4. O frontend envia uma requisição HTTP (`POST /perguntas/:id/voto`) informando o ID da pergunta, a identificação do usuário e o tipo do voto (+1 ou -1).
5. O backend valida a existência da pergunta e consulta se o usuário já possui voto registrado para aquele item.
6. O backend verifica que o usuário ainda não votou nessa pergunta.
7. O backend persiste o novo voto na tabela de votos e recalcula a pontuação consolidada da pergunta no SQLite.
8. O backend retorna status `200 OK` com o saldo atualizado e a confirmação do registro.
9. O frontend atualiza o contador numérico de votos na tela e destaca visualmente o botão selecionado.
 
---
 
### Fluxos Alternativos
 
#### Fluxo Alternativo A: Alternância de voto (Inversão)
- **5a.** No passo 6 do fluxo principal, o backend detecta que o usuário já havia votado nessa pergunta, mas com a opção contrária (ex: tinha votado *downvote* e agora clicou em *upvote*).
- **5b.** O sistema cancela o efeito do voto antigo e aplica o efeito do novo voto, atualizando a pontuação consolidada da pergunta (variação de 2 pontos).
- **5c.** O sistema atualiza o registro do voto no banco de dados com o novo sentido.
- **5d.** O fluxo retorna ao passo 8 do fluxo principal.
 
#### Fluxo Alternativo B: Cancelamento de voto (Desfazer)
- **5a.** No passo 6 do fluxo principal, o backend detecta que o usuário clicou no mesmo botão do voto que já estava ativo (ex: clicou em *upvote* tendo já votado *upvote* anteriormente).
- **5b.** O sistema remove o registro de voto do usuário do banco de dados.
- **5c.** O saldo de votos da pergunta é recalculado retirando o ponto anterior.
- **5d.** O sistema devolve o novo saldo e o frontend desmarca o destaque visual do botão.
- **5e.** O caso de uso é finalizado com o voto anulado.
 
#### Fluxo Alternativo C: Pergunta inexistente ou inválida
- **5a.** No passo 5 do fluxo principal, o backend não encontra a pergunta correspondente ao ID informado.
- **5b.** O sistema encerra a operação e retorna o código de erro HTTP `404 Not Found`.
- **5c.** O frontend exibe uma mensagem avisando que a pergunta não foi encontrada e mantém o estado anterior da tela.
- **5d.** O caso de uso é encerrado sem alterações no banco de dados.
 
---
 
**Pós-condições:**  
- O saldo consolidado de votos da pergunta é recalculado e persistido no SQLite.
- A interface web reflete o novo saldo numérico e o estado de seleção do usuário.