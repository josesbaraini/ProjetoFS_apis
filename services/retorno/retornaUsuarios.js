import pool from "../conexao.js";

async function executaQuery(conexao,query) {
    const resultado_query = await conexao.execute(query)
    const resposta = resultado_query[0]
    return resposta    
}

export async function retornaParaLogin(email) {
    const conexao = await pool.getConnection();
    const query = "SELECT id, email, senha from Usuarios WHERE email = ?"
    const resultado_query = await conexao.execute(query,[email])
    const resposta = resultado_query[0][0]
    return resposta
}

export async function retornaUsuarios()
{
    const conexao = await pool.getConnection();
    const query = 'SELECT * FROM Usuarios';
    const usuarios = executaQuery(conexao, query);
    conexao.release();
    return usuarios;
}

export async function retornaUsuarioId(id) {
    const conexao = await pool.getConnection();
    const query = 'SELECT * FROM Usuarios WHERE id = ?';
    const usuarios = await conexao.execute(query,[id])
    conexao.release();
    return usuarios[0];  
}