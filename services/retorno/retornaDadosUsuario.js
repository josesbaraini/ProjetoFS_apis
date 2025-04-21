import pool from "../conexao.js";

export async function retornaDadosBasicos(id) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Dados_basicos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query,[id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function retornaDadosAvancados(id) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Dados_avancados WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query,[id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta;
}