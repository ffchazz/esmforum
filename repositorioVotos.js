const bd = require('./esmforum/bd/bd_utils.js');
 
// Garante que a tabela de votos exista no SQLite
bd.exec(`
  CREATE TABLE IF NOT EXISTS votos (
    id_voto INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pergunta INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    tipo INTEGER NOT NULL,
    data_voto DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(id_pergunta, id_usuario)
  );
`, []);
 
class RepositorioVotos {
  buscarVoto(id_pergunta, id_usuario) {
    return bd.query(
      'SELECT * FROM votos WHERE id_pergunta = ? AND id_usuario = ?',
      [id_pergunta, id_usuario]
    );
  }
 
  inserirVoto(id_pergunta, id_usuario, tipo) {
    return bd.exec(
      'INSERT INTO votos (id_pergunta, id_usuario, tipo) VALUES (?, ?, ?)',
      [id_pergunta, id_usuario, tipo]
    );
  }
 
  atualizarVoto(id_pergunta, id_usuario, novoTipo) {
    return bd.exec(
      'UPDATE votos SET tipo = ?, data_voto = CURRENT_TIMESTAMP WHERE id_pergunta = ? AND id_usuario = ?',
      [novoTipo, id_pergunta, id_usuario]
    );
  }
 
  removerVoto(id_pergunta, id_usuario) {
    return bd.exec(
      'DELETE FROM votos WHERE id_pergunta = ? AND id_usuario = ?',
      [id_pergunta, id_usuario]
    );
  }
 
  obterSaldoVotos(id_pergunta) {
    const resultado = bd.query(
      'SELECT COALESCE(SUM(tipo), 0) AS saldo FROM votos WHERE id_pergunta = ?',
      [id_pergunta]
    );
    return resultado ? resultado.saldo : 0;
  }
}
 
module.exports = RepositorioVotos;