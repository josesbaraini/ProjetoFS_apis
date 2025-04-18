import pool from "../conexao.js";

export async function retornaEventosId(id) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Eventos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query,[id]);
    const resposta = resultado_query[0];
    return resposta;
}