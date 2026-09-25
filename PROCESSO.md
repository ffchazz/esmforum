# Planejamento do Processo Ágil - ESM Forum
 
Link do GitHub Projects: https://github.com/users/ffchazz/projects/2
 
---
 
## 1. Escolha do Processo: Kanban
 
Para gerenciar o desenvolvimento das funcionalidades, optei por usar **Kanban** em vez de Scrum.
 
O motivo principal é o contexto do projeto: como estou trabalhando sozinho na extensão de um sistema que já existe, o Scrum traria uma burocracia desnecessária. O Scrum exige rituais como reuniões diárias (dailies), planejamento rígido de sprints de 2 a 4 semanas e retrospectivas, coisas que só fazem sentido para coordenar times grandes.
 
O Kanban é muito mais prático e eficiente aqui porque funciona por **fluxo contínuo**. Em vez de ficar preso a um pacote fechado de tempo, eu organizo as tarefas por prioridade, puxo uma funcionalidade por vez para desenvolver, testo e entrego. Isso ajuda a manter o foco e evita tentar mexer em várias partes do código ao mesmo tempo.
 
---
 
## 2. Estrutura do Quadro
 
Organizei o board no GitHub Projects em 5 colunas para refletir o ciclo de vida real das tarefas:
 
- **Backlog:** Fila com as funcionalidades mapeadas que ainda vão aguardar sua vez.
- **Todo:** Tarefas prioritárias que já estão refinadas e prontas para começar a codificar.
- **In Progress:** O que estou programando no momento (mantendo o limite de trabalhar em uma coisa por vez).
- **Review / QA:** Etapa para revisar o código e rodar testes antes de considerar pronto.
- **Done:** Funcionalidades finalizadas e integradas.
 
---
 
## 3. Priorização das Funcionalidades
 
Ordenei as 5 demandas solicitadas pelo cliente de acordo com o valor que elas entregam para o usuário:
 
### Na coluna `Todo` (Prioridade Alta - Próximas a fazer):
1. **US-01: Sistema de votação em perguntas (upvote/downvote)**  
   É a funcionalidade central de qualquer fórum colaborativo. Sem votos, perguntas boas e ruins ficam no mesmo nível. Ela foi para o topo porque define a dinâmica principal da comunidade.
2. **US-02: Busca de perguntas por palavra-chave**  
   Essencial para a usabilidade básica do site. Sem uma busca, os usuários não conseguem achar dúvidas antigas e acabam criando várias perguntas repetidas sobre o mesmo assunto.
 
### Na coluna `Backlog` (Aguardando as primeiras terminarem):
3. **US-03: Categorização de perguntas por tags**  
   Ajuda a organizar as dúvidas por assunto (tecnologia, carreira, etc.), mas funciona como um complemento da busca. Por isso, fica para uma segunda etapa.
4. **US-04: Perfil de usuário com histórico de perguntas e respostas**  
   É legal para ver o histórico individual, mas o fórum funciona perfeitamente sem isso no início. Só faz sentido construir depois que as pessoas já estiverem postando e votando.
5. **US-05: Notificação de novas respostas**  
   Ficou por último porque só gera utilidade real quando o fórum já tem usuários ativos respondendo com frequência. Desenvolver isso agora seria desperdício de tempo frente às outras necessidades.