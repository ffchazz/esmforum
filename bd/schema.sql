create table perguntas (
  id_pergunta       integer      unique  not null  primary key  autoincrement,
  texto             text         not null,
  id_usuario        integer      not null
);
  
create table respostas (
  id_resposta       integer      unique  not null  primary key  autoincrement,
  id_pergunta       integer      not null,
  texto             text         not null
);  

CREATE TABLE IF NOT EXISTS votos (
  id_voto INTEGER PRIMARY KEY AUTOINCREMENT,
  id_pergunta INTEGER NOT NULL,
  id_usuario INTEGER NOT NULL,
  tipo INTEGER NOT NULL
);