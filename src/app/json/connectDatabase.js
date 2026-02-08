import mysql from "mysql2/promise";

function createPool() {
    return mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 3,
        queueLimit: 0,
        connectTimeout: 10000
    });
}

if (!global._mysqlPool) {
    global._mysqlPool = createPool();
}

export async function connectDatabase() {
    try {
        const pool = global._mysqlPool;
        const conn = await pool.getConnection();
        await conn.execute("SELECT 1");
        conn.release();
        return pool;
    } catch (e) {
        try {
            await global._mysqlPool.end();
        } catch (_) { }
        global._mysqlPool = createPool();
        return global._mysqlPool;
    }
}
