import pool from "../../connection.js";

export async function retornaTodosTreinos() {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Treinos";
    const resultado_query = await conexao.execute(query);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function retornaIdTreinos(userId) {
    const conexao = await pool.getConnection();
    const query = "SELECT id FROM Treinos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query, [userId]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function retornaTreinos(userId) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Treinos WHERE Usuario_id = ?";
    const resultado_query = await conexao.execute(query, [userId]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function retornaTreinosNome(userId, nome) {
    const conexao = await pool.getConnection();
    const query = "SELECT * FROM Treinos WHERE Usuario_id = ? AND nome LIKE ?";
    const resultado_query = await conexao.execute(query, [userId, `${nome}%`]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

export async function retornaTreinosOrdenados(userId, ordem) {
    const conexao = await pool.getConnection();

    let orderClause = "id";

    if (ordem.toUpperCase() === "NOME") {
        orderClause = 'nome ASC';
    } else if (ordem.toUpperCase() === "MODIFICACAO") {
        orderClause = "modificacao_em DESC";
    }

    const query = `SELECT * FROM Treinos WHERE Usuario_id = ? ORDER BY ${orderClause}`;
    const resultado_query = await conexao.execute(query, [userId]);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}

// Nova função que combina pesquisa por nome e ordenação
export async function retornaTreinosComFiltros(userId, nome = null, ordem = null) {
    const conexao = await pool.getConnection();

    let whereClause = "WHERE Usuario_id = ?";
    let orderClause = "";
    let params = [userId];

    // Adiciona filtro por nome se fornecido
    if (nome && nome.trim() !== "") {
        whereClause += " AND nome LIKE ?";
        params.push(`${nome}%`);
    }

    // Adiciona ordenação hierárquica
    if (ordem) {
        const ordens = ordem.split(',').map(o => o.trim().toUpperCase());
        let orderParts = [];

        // Se especificar NOME, ordena por nome primeiro
        if (ordens.includes('NOME')) {
            orderParts.push("nome ASC");
        }

        // Se especificar MODIFICACAO, ordena por data de modificação
        if (ordens.includes('MODIFICACAO')) {
            orderParts.push("modificacao_em DESC");
        }

        // Se não especificar nenhuma ordenação válida, usa ID como padrão
        if (orderParts.length === 0) {
            orderParts.push("modificacao_em ASC");
        }

        orderClause = " ORDER BY " + orderParts.join(", ");
    }

    const query = `SELECT * FROM Treinos ${whereClause}${orderClause}`;

    const resultado_query = await conexao.execute(query, params);
    const resposta = resultado_query[0];
    conexao.release();
    return resposta
}