import  pool  from "../conexao.js";
export async function cadastraEvento(nome, descricao, data, UsuarioId) {
    const conexao = await pool.getConnection();
    let resposta;
    try {
        resposta = await conexao.execute('INSERT INTO Eventos (nome, descricao, data, Usuario_id) VALUES (?, ?, ?, ?)',
            [nome, descricao, data, UsuarioId]);
            console.log(resposta)
    } catch (error) {
        conexao.release();
        return error

    }
    conexao.release();
    return resposta
}