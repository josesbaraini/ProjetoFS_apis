import pool from "../../connection.js";

export async function cadastraDadosBasicos(id) {
    const conexao = await pool.getConnection();
    let resposta;
    try {
        resposta = await conexao.execute('INSERT INTO Dados_basicos (Usuario_id) VALUES (?)',
            [id]);
    } catch (error) {

        conexao.release();
        return error

    }
    conexao.release();
    return resposta
}

export async function cadastraDadosAvancados(id) {
    const conexao = await pool.getConnection();
    let resposta;
    try {
        resposta = await conexao.execute('INSERT INTO Dados_avancados (Usuario_id) VALUES (?)',
            [id]);
    } catch (error) {

        conexao.release();
        return error

    }
    conexao.release();
    return resposta
}