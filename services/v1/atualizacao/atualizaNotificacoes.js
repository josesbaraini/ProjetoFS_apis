import pool from "../../connection.js";


export async function marcaNotificacaoLida(id) {
    const conexao = await pool.getConnection();
    const query = `UPDATE Notificacoes SET lida = true where id = ?`
    const [resposta] = await conexao.execute(query, [id])
    conexao.release()
    return resposta
};