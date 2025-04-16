import pool from "../conexao.js";

export async function retornaTodosTreinos() {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Treinos";
    const resultado_query = await conexao.execute(query);
    const resposta = resultado_query[0];
    return resposta
}
export async function retornaTreinos(userId) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Treinos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query, [userId]);
    const resposta = resultado_query[0];
    return resposta
}
export async function retornaTreinosNome(userId,nome) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Treinos WHERE Usuario_id = ? AND nome LIKE ?";
    const resultado_query = await conexao.execute(query, [userId,`${nome}%`]);
    const resposta = resultado_query[0];
    return resposta
}

export async function retornaTreinosOrdenados(userId,ordem) {
    const conexao = await pool.getConnection();
    
    if (ordem.toUpperCase() === "ASC"){
        
        ordem = 'nome ASC';
    }else if(ordem.toUpperCase() === "MOD"){
        ordem = "modificacao_em DESC"
    }
    else {
        ordem = "id";
    }
    const query = `SELECT * FROM Treinos WHERE Usuario_id = ? ORDER BY ${ordem}`;
    const resultado_query = await conexao.execute(query, [userId]);
    const resposta = resultado_query[0];
    return resposta
}