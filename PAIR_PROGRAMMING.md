# Planejamento de Pair Programming - ESM Forum
 
Como este projeto está sendo desenvolvido individualmente, este documento descreve como a prática de Pair Programming seria aplicada caso o trabalho fosse feito em dupla à distância.
 
---
 
## 1. Estratégia de Pareamento
 
A ideia seria parear principalmente nas partes onde ter duas pessoas pensando juntas evita erros e retrabalho:
 
- **Lógica de negócio e banco de dados:** Desenvolver em conjunto as regras no `modelo.js` (como validar para não permitir votos repetidos na história de votação ou montar os filtros de busca no SQLite).
- **Integração do frontend com o backend:** Conectar as requisições do React com as rotas do Express (`server.js`), testando se os dados chegam e atualizam a tela corretamente.
- **Tarefas feitas individualmente:** Ajustes simples de layout no CSS/Bootstrap ou escrita de documentação poderiam ser feitos individualmente, sem necessidade de pareamento contínuo.
 
---
 
## 2. Ferramentas Utilizadas
 
Para o trabalho remoto em dupla, seriam usadas:
 
- **VS Code Live Share:** Permite que os dois desenvolvedores editem o mesmo código ao mesmo tempo, compartilhem o terminal e acessem o servidor local (redirecionando as portas 5000 do backend e 3000 do frontend).
- **Discord ou Google Meet:** Para chamada de voz contínua durante o código e compartilhamento de tela pontual para discutir ideias e testar a interface.
- **Git e GitHub:** Commits frequentes no repositório, usando a tag `Co-authored-by` para registrar a participação dos dois no histórico.
 
---
 
## 3. Divisão de Papéis e Rotação
 
A dinâmica seguiria a divisão padrão do XP:
 
- **Driver (Piloto):** Fica com o teclado, focado em digitar o código, cuidar da sintaxe e fazer a função rodar.
- **Navigator (Navegador):** Acompanha o raciocínio, prestando atenção na regra geral, sugerindo soluções, conferindo se os critérios da história foram atendidos e apontando erros antes mesmo de rodar o código.
 
### Rotação dos papéis:
- **Por tempo (30 minutos):** Alternar quem está no teclado a cada 30 minutos para evitar cansaço de quem pilota e manter o copiloto sempre ativo e engajado.
- **Por tarefa:** Ao concluir uma parte (por exemplo, terminou de criar a rota no `server.js`), quem estava como navegador assume o teclado para implementar a função correspondente no `modelo.js`.