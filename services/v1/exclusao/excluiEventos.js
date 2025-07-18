import pool from "../../connection.js";

export async function excluiEventosId(id) {
    const conexao = await pool.getConnection();
    const query = "DELETE FROM Eventos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query, [id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta;
}