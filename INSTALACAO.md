# Guia de Instalação e Execução Local - ESM Forum
 
Instruções para configurar o ambiente e executar localmente o backend e o frontend do projeto ESM Forum.
 
---
 
## 1. Pré-requisitos e Ambiente
 
Para rodar o projeto localmente, foram utilizadas as seguintes ferramentas:
 
- **Sistema Operacional:** macOS
- **Node.js:** v22.x e npm
- **Git:** Autenticação configurada via chave SSH
- **Editor:** Visual Studio Code
 
---
 
## 2. Clonagem dos Repositórios
 
Foi realizado o fork dos repositórios originais para a conta pessoal no GitHub e a clonagem local via SSH:
 
```bash
# Backend
git clone git@github.com:ffchazz/esmforum.git
 
# Frontend
git clone git@github.com:ffchazz/esmforum-react.git
```
 
Estrutura de pastas resultante:
```text
projeto-final-es1/
├── esmforum/          # Backend (Node.js, Express, SQLite)
├── esmforum-react/    # Frontend (React)
├── INSTALACAO.md
├── PROCESSO.md
└── DESIGN_SIMPLES.md
```
 
---
 
## 3. Executando o Backend
 
O backend utiliza Node.js, Express e banco de dados SQLite embutido.
 
1. Acesse o diretório do backend:
   ```bash
   cd esmforum
   ```
 
2. Instale as dependências:
   ```bash
   npm install
   ```
 
3. Inicie o servidor:
   ```bash
   npm start
   ```
 
O servidor backend inicializa escutando por padrão na porta `5000` (conforme definido em `server.js`). Este terminal deve permanecer aberto em execução para atender às requisições da API.
 
---
 
## 4. Executando o Frontend
 
O frontend é uma SPA construída em React.
 
1. Em uma segunda aba de terminal, acesse a pasta do frontend:
   ```bash
   cd esmforum-react
   ```
 
2. Instale as dependências:
   ```bash
   npm install
   ```
 
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
 
A aplicação React inicializa na porta padrão `3000` e abre automaticamente no navegador em `http://localhost:3000`.
 
---
 
## 5. Verificação do Funcionamento
 
Com ambos os terminais em execução:
- Ao abrir `http://localhost:3000`, a interface web carrega a listagem inicial de perguntas buscando os dados na API (`http://localhost:5000/`).
- O envio de novas perguntas pela interface persiste os dados no SQLite e atualiza a listagem.
 
---
 
## 6. Links dos Repositórios
 
- **Backend:** https://github.com/ffchazz/esmforum
- **Frontend:** https://github.com/ffchazz/esmforum-react