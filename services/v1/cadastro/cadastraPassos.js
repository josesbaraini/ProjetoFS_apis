import pool from "../../connection.js";

export async function cadastraPassos(id, passos) {
    const conexao = await pool.getConnection();
    let resposta = [];

    try {
        for (const passo of passos) {
            const [passoR] = await conexao.execute("INSERT INTO Passos(nome,repeticoes,peso,series,Treino_id) values (? ,? ,? ,? ,? );",
                [passo.nome, passo.repeticoes, passo.peso, passo.series, id]);
            resposta.push(passoR)
        }



    } catch (error) {
        conexao.release();
        return error
    }

    conexao.release();
    return resposta
}

