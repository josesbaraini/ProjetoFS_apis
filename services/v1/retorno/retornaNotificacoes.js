import pool from "../../connection.js";

export async function retornaNotificacoesId(id) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Notificacoes WHERE Usuario_id = ? ORDER BY hora DESC";
    const resultado_query = await conexao.execute(query, [id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta;
}