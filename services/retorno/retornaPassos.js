import pool from "../conexao.js";

export async function retornaTodosPassos() {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Passos";
    const resultado_query = await conexao.execute(query);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}
export async function retornaPassos(treinoId) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Passos WHERE Treino_id = ?";
    const resultado_query = await conexao.execute(query, [treinoId]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}
export async function retornaPassosNome(treinoId,nome) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Passos WHERE Treino_id = ? AND nome LIKE ?";
    const resultado_query = await conexao.execute(query, [treinoId,`${nome}%`]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function retornaPassosOrdenados(treinoId,ordem) {
    const conexao = await pool.getConnection();
    
    if (ordem.toUpperCase() === "ASC"){
        
        ordem = 'nome ASC';
    }else if(ordem.toUpperCase() === "MOD"){
        ordem = "modificacao_em DESC"
    }
    else {
        ordem = "id";
    }
    const query = `SELECT * FROM Passos WHERE Treino_id = ? ORDER BY ${ordem}`;
    const resultado_query = await conexao.execute(query, [treinoId]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}