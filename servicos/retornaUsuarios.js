import pool from "./conexao.js";

async function executaQuary(conexao,query) {
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