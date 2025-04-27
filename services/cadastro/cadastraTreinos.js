import pool from "../conexao.js";
import { cadastraPassos } from "./cadastraPassos.js";

export async function cadastraTreinos(dados) {

  const conexao = await pool.getConnection();
  let resposta = [];
  try {
    const [treinosR] = await conexao.execute("INSERT INTO Treinos(nome,descricao,anotacoes,Usuario_id) values (? , ? , ? , ? )",
      [dados.nome, dados.descricao, dados.anotacoes, dados.usuario_id]);
    resposta.push(treinosR);
    
    const treinosP = await cadastraPassos(treinosR.insertId, dados.passos);
    resposta.push(treinosP);
    

  } catch (error) {
    conexao.release();
    return error
  }

  conexao.release();
  return resposta
}

