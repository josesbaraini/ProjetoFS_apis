import pool from "../../connection.js";
import { retornaIdTreinos } from "../retorno/retornaTreinos.js";

export async function excluiPassos(treinoId) {
    const conexao = await pool.getConnection();
    const query = "DELETE FROM Passos WHERE Treino_id = ?";
    const resultado_query = await conexao.execute(query, [treinoId]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function excluiPassoId(Id) {
    const conexao = await pool.getConnection();
    const query = "DELETE FROM Passos WHERE id = ?";
    const resultado_query = await conexao.execute(query, [Id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function excluiPassoIdUsuario(id) {
    const treinos = await retornaIdTreinos(id);
    const conexao = await pool.getConnection();
    let resposta = [];
    for (const treino of treinos) {
        const query = "DELETE FROM Passos WHERE Treino_id = ?";
        const [resultado_query] = await conexao.execute(query, [treino.id]);
        resposta.push(resultado_query)
    }
    conexao.release();
    return resposta
}
