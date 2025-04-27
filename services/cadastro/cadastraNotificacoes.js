import  pool  from "../conexao.js";
export async function cadastraNotificacao(nome, assunto, tipo, id) {
    const conexao = await pool.getConnection();
    let resposta;
    try {
        [resposta] = await conexao.execute('INSERT INTO Notificacoes (nome, assunto, tipo, Usuario_id) VALUES (?, ?, ?, ?)',
            [nome, assunto, tipo, id]);
    } catch (error) {
        conexao.release();
        return error

    }
    conexao.release();
    return resposta
}