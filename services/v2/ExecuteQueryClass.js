import  pool  from '../connection.js';

export class ExecuteQueryClass {
    async executaQuery(query, params = []) {
        const conexao = await pool.getConnection();
        try {
            const [rows] = await conexao.execute(query, params);
            return rows;
        } finally {
            conexao.release();
        }
    }
}