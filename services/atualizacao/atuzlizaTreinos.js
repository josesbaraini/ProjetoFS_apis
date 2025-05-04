import pool from "../conexao.js"


export async function atualizaTreino(id, campos) {
    const conexao = await pool.getConnection();
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(', ');
    const valores = Object.values(campos);
    const query = `UPDATE Treinos SET ${colunas} where id =?`
    valores.push(id)
    const [resposta] = await conexao.execute(query, valores)
    conexao.release()
    return resposta
};