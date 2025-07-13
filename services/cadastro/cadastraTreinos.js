import pool from "../conexao.js";
import { cadastraPassos } from "./cadastraPassos.js";
import { cadastraEvento } from "./cadastraEventos.js";

export async function cadastraTreinos(dados) {

  const conexao = await pool.getConnection();
  let resposta = [];
  try {
    const [treinosR] = await conexao.execute("INSERT INTO Treinos(nome,descricao, data_treino, repetir, Usuario_id) values (? , ? , ?, ? , ? )",
      [dados.nome, dados.descricao, dados.data_treino, dados.repetir, dados.usuario_id]);
    resposta.push(treinosR);
    
    const treinosP = await cadastraPassos(treinosR.insertId, dados.passos);
    resposta.push(treinosP);
    const evento = await cadastraEvento(dados.nome, dados.descricao, dados.data_treino, dados.usuario_id)
    

  } catch (error) {
    conexao.release();
    return error
  }

  conexao.release();
  console.log(resposta)
  return resposta
}

