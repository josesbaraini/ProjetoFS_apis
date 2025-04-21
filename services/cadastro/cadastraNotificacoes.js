import  pool  from "../conexao.js";
export async function cadastraNotificacao(nome, assunto, tipo, data, situacao, id) {
    const conexao = await pool.getConnection();
    let resposta;
    try {
        resposta = await conexao.execute('INSERT INTO Notificacoes (nome, assunto, tipo, hora, lida, Usuario_id) VALUES (?, ?, ?, ?, ?, ?)',
            [nome, assunto, tipo, data, situacao, id]);
    } catch (error) {
        conexao.release();
        return error

    }
    conexao.release();
    return resposta
}