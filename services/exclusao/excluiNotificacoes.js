import pool from "../conexao.js";

export async function excluiNotificacoesId(id) {
    const conexao = await pool.getConnection();
    const query = "DELETE FROM Notificacoes WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query,[id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta;
}