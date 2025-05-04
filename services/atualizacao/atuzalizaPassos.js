import pool from "../conexao.js";

export async function atualizaPasso(id, campos) {
    const conexao = await pool.getConnection();
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(', ');
    const valores = Object.values(campos);
    const query = `UPDATE Passos SET ${colunas} where id =?`
    valores.push(id)
    const [resposta] = await conexao.execute(query, valores)
    conexao.release()
    return resposta
};

export async function atualizaPassos(passos) {
    const conexao = await pool.getConnection();
    try {
        const respostas = []
        for (const passo of passos) {
            const { id: passoId, ...campos } = passo
            const colunas = Object.keys(campos).map(campos => `${campos} = ?`).join(', ');
            const valores = Object.values(campos);
            const query = `UPDATE Passos SET ${colunas} where id =?`
            valores.push(passoId)
            const [resposta] = await conexao.execute(query, valores)
            respostas.push(resposta)
        };
        return respostas
    } finally {
        conexao.release();
    }


}
