import  pool  from '../connection.js';

export class ExecuteQueryClass {
    async executaQuery(query, values = []) {
        const conexao = await pool.getConnection();
        try {
            const rows = await conexao.execute(query, values);
            return rows;
        } finally {
            conexao.release();
        }
    }
}