// OCP: Estrutura extensível de tipos de voto
const TIPOS_VOTO = Object.freeze({
  UPVOTE: 1,
  DOWNVOTE: -1
});
 
class VotacaoService {
  // DIP: Recebe a abstração do repositório por injeção de dependência
  constructor(repositorioVotos) {
    if (!repositorioVotos) {
      throw new Error('Um repositório de votos válido deve ser fornecido.');
    }
    this.repositorio = repositorioVotos;
  }
 
  // SRP: Método focado estritamente na regra de negócio da votação
  votar(id_pergunta, id_usuario, tipoVoto) {
    if (!id_pergunta || !id_usuario || typeof tipoVoto !== 'number') {
      throw new Error('Parâmetros de votação inválidos.');
    }
 
    const votoExistente = this.repositorio.buscarVoto(id_pergunta, id_usuario);
 
    // Caso 1: Primeiro voto do usuário nesta pergunta
    if (!votoExistente) {
      this.repositorio.inserirVoto(id_pergunta, id_usuario, tipoVoto);
      const saldo = this.repositorio.obterSaldoVotos(id_pergunta);
      return { status: 'registrado', tipo: tipoVoto, saldo_votos: saldo };
    }
 
    // Caso 2: Clicou no mesmo botão (cancelar / desfazer voto)
    if (votoExistente.tipo === tipoVoto) {
      this.repositorio.removerVoto(id_pergunta, id_usuario);
      const saldo = this.repositorio.obterSaldoVotos(id_pergunta);
      return { status: 'cancelado', tipo: 0, saldo_votos: saldo };
    }
 
    // Caso 3: Clicou no botão oposto (inverter voto: de +1 para -1 ou vice-versa)
    this.repositorio.atualizarVoto(id_pergunta, id_usuario, tipoVoto);
    const saldo = this.repositorio.obterSaldoVotos(id_pergunta);
    return { status: 'invertido', tipo: tipoVoto, saldo_votos: saldo };
  }
 
  obterSaldo(id_pergunta) {
    return this.repositorio.obterSaldoVotos(id_pergunta);
  }
}
 
module.exports = { VotacaoService, TIPOS_VOTO };