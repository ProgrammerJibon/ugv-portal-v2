import mysql from "mysql2/promise";

export const isServer = true;

function createPool() {
    return mysql.createPool({
        host: isServer ? "103.191.50.6" : "localhost",
        user: isServer ? "jibonco1_user_code_arena" : "root",
        password: isServer ? "Wci=asrL?Fs4" : "",
        database: "jibonco1_code_arena",
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
            if (global._mysqlPool) {
                await global._mysqlPool.end();
            }
        } catch (_) { }
        global._mysqlPool = createPool();
        return global._mysqlPool;
    }
}
