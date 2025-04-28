import pool from "../conexao.js";

export async function excluiDadosBasicos(id) {
    const conexao = await pool.getConnection();
    const query = "DELETE FROM Dados_basicos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query,[id]);
    const [resposta] = resultado_query;
    conexao.release();
    return resposta
}

export async function excluiDadosAvancados(id) {
    const conexao = await pool.getConnection();
    const query = "DELETE FROM Dados_avancados WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query,[id]);
    const [resposta] = resultado_query;
    conexao.release();
    return resposta;
}