import pool from "../conexao.js";

export async function excluiTreinoId(Id) {
    const conexao = await pool.getConnection();
    const query = "DELETE FROM Treinos WHERE id = ?";
    const resultado_query = await conexao.execute(query, [Id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta;
}

export async function excluiTreinos(Id) {
    const conexao = await pool.getConnection();
    const query = "DELETE FROM Treinos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query, [Id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta;
}
