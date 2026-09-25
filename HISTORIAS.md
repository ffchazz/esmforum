# Histórias de Usuário - ESM Forum
 
Este documento apresenta 3 histórias de usuário selecionadas para o ESM Forum, detalhando seus critérios de aceitação e a justificativa da priorização adotada.
 
---
 
## História 1: Sistema de Votação em Perguntas
 
**Como** usuário do fórum,  
**Eu quero** votar positivamente (upvote) ou negativamente (downvote) em perguntas,  
**Para** destacar as perguntas mais úteis e filtrar o conteúdo relevante para a comunidade.
 
**Critérios de Aceitação:**
- [ ] Cada pergunta deve exibir botões visíveis de upvote e downvote, além do saldo de votos consolidado.
- [ ] Cada usuário pode votar apenas uma única vez na mesma pergunta.
- [ ] O usuário pode alterar seu voto (mudar de upvote para downvote e vice-versa) ou cancelar o voto ao clicar novamente no mesmo botão.
- [ ] O saldo consolidado de votos deve ser persistido no banco de dados SQLite e refletido na interface.
 
---
 
## História 2: Busca de Perguntas por Palavra-chave
 
**Como** usuário do fórum que busca tirar uma dúvida,  
**Eu quero** pesquisar perguntas antigas usando palavras-chave,  
**Para** encontrar respostas rapidamente sem precisar criar uma pergunta repetida.
 
**Critérios de Aceitação:**
- [ ] A barra de navegação/topo da página deve conter um campo de texto para pesquisa.
- [ ] A busca deve consultar termos contidos tanto no título quanto no texto da pergunta.
- [ ] A consulta não deve diferenciar letras maiúsculas de minúsculas (*case-insensitive*).
- [ ] Se nenhum resultado corresponder ao termo pesquisado, a interface deve exibir uma mensagem avisando que nada foi encontrado.
 
---
 
## História 3: Categorização de Perguntas por Tags
 
**Como** leitor ou autor de perguntas no fórum,  
**Eu quero** adicionar e filtrar perguntas por categorias ou tags (ex: tecnologia, carreira, geral),  
**Para** navegar e encontrar com facilidade assuntos específicos da minha área de interesse.
 
**Critérios de Aceitação:**
- [ ] O formulário de publicação de pergunta deve permitir selecionar ou digitar tags.
- [ ] As tags vinculadas devem ser exibidas visualmente junto de cada pergunta na listagem.
- [ ] Ao clicar em uma tag na listagem, o fórum deve filtrar e exibir apenas as perguntas com aquela tag.
- [ ] A associação entre perguntas e tags deve ser armazenada no banco de dados.
 
---
 
## Priorização e Justificativa
 
A ordem de prioridade definida para as 3 histórias é:
 
1. **1º lugar — História 1 (Sistema de Votação):**  
   É a funcionalidade central de um fórum de perguntas e respostas. Sem mecanismo de votos, o sistema não tem como destacar boas discussões nem rebaixar tópicos sem utilidade. Por definir a dinâmica principal da comunidade, entra como prioridade máxima.
 
2. **2º lugar — História 2 (Busca por Palavra-chave):**  
   Fica logo em seguida porque resolve o problema mais comum de fóruns: a criação contínua de dúvidas repetidas. Ter uma busca rápida permite que o usuário encontre soluções imediatas, poupando tempo tanto de quem pergunta quanto de quem responde.
 
3. **3º lugar — História 3 (Categorização por Tags):**  
   Embora seja muito útil para organizar o fórum por temas, ela funciona como um complemento da busca e só tem valor perceptível quando o volume de postagens já começa a crescer. Por isso, fica para ser entregue após a votação e a busca já estarem funcionando.
 