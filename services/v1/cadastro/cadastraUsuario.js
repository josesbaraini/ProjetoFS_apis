import pool from "../../connection.js";

export async function cadastraUsuario(nome, email, senha, telefone) {
    const conexao = await pool.getConnection();
    let resposta;
    try {
        if (telefone) {
            resposta = await conexao.execute('INSERT INTO Usuarios (nome, email, senha, telefone) VALUES (?, ?, ?, ?)', [nome, email, senha, telefone]);
        } else {
            resposta = await conexao.execute('INSERT INTO Usuarios (nome, email, senha) VALUES (?, ?, ?)', [nome, email, senha])
        }

    } catch (error) {
        conexao.release();
        throw error

    }


    conexao.release();
    return resposta

}