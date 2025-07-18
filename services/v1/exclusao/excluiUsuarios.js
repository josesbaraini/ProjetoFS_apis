import pool from "../../connection.js";


export async function excluiUsuarioId(id) {
    const conexao = await pool.getConnection();
    const query = 'DELETE FROM Usuarios WHERE id = ?';
    const usuarios = await conexao.execute(query, [id])
    conexao.release();
    return usuarios[0];
}