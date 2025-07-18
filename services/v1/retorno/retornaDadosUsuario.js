import pool from "../../connection.js";

export async function retornaDadosBasicos(id) {
    const conexao = await pool.getConnection();
    const query = "SELECT db.*, u.nome, u.email, u.telefone, created_at, data_nascimento FROM Dados_basicos db INNER JOIN Usuarios u ON db.Usuario_id = u.id WHERE db.Usuario_id = ?;";
    const resultado_query = await conexao.execute(query, [id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function retornaDadosAvancados(id) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Dados_avancados WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query, [id]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta;
}