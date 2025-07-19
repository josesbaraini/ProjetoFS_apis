import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    // Configurações para evitar ECONNRESET
    acquireTimeout: 60000, // 60 segundos para adquirir conexão
    timeout: 60000, // 60 segundos timeout
    reconnect: true, // Reconectar automaticamente
    connectionLimit: 10, // Máximo de conexões no pool
    queueLimit: 0, // Sem limite na fila
    waitForConnections: true, // Esperar por conexões disponíveis
    // Configurações do MySQL
    charset: 'utf8mb4',
    // Configurações de keep-alive
    keepAliveInitialDelay: 0,
    enableKeepAlive: true
});

// Função para testar a conexão com o banco de dados
async function testarConexao() {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');

        // Testa uma query simples
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('✅ Query de teste executada com sucesso:', rows[0]);

        connection.release();
        return true;
    } catch (error) {
        connection.release();
        console.error('❌ Erro ao conectar com o banco de dados:', error.message);
        return false;
    }
}

// Chama a função de teste uma vez quando o módulo é carregado
testarConexao();

export default pool; 