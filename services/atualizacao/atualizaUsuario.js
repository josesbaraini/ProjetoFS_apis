import pool from "../conexao.js";

export async function atualizaDadosBasicos(id, campos) {
    const conexao = await pool.getConnection();
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(', ');
    const valores = Object.values(campos);
    const query = `UPDATE Dados_basicos SET ${colunas} where Usuario_id =?`
    valores.push(id)
    const [resposta] = await conexao.execute(query, valores)
    conexao.release()
    return  resposta
}

export async function atualizaDadosAvancados(id, campos) {
    const conexao = await pool.getConnection();
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(', ');
    const valores = Object.values(campos);
    const query = `UPDATE Dados_avancados SET ${colunas} where Usuario_id =?`
    valores.push(id)
    const [resposta] = await conexao.execute(query, valores)
    conexao.release()
    return  resposta
}

export async function atualizaUsuario(id, campos) {
    const conexao = await pool.getConnection();
    const colunas = Object.keys(campos).map(campo => `${campo} = ?`).join(', ');
    const valores = Object.values(campos);
    const query = `UPDATE Usuarios SET ${colunas} where id =?`
    valores.push(id)
    const [resposta] = await conexao.execute(query, valores)
    conexao.release()
    return  resposta
}

export async function atualizaFotoPerfil(id, caminho) {
    const conexao = await pool.getConnection();
    const query = `UPDATE Usuarios SET fotoPerfil = ? where id = ?`
    const [resposta] = await conexao.execute(query, [caminho, id])
    conexao.release()
    return resposta
}