async function tableExists(connection, table) {
    const [rows] = await connection.execute("SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?", [table]);
    return rows.length > 0;
}

async function createUser(connection) {
    if (await tableExists(connection, "users")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(64) NOT NULL,
        user_type varchar(32) NOT NULL,
        email_address varchar(1024) NOT NULL,
        phone_number varchar(16) NOT NULL,
        faculty_id varchar(11) NOT NULL,
        designation varchar(32) NOT NULL,
        user_id varchar(16) NOT NULL,
        password varchar(32) NOT NULL,
        joining_date varchar(32) NOT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createCookies(connection) {
    if (await tableExists(connection, "cookies")) return true;
    const sql = `CREATE TABLE cookies (
        id int(11) NOT NULL AUTO_INCREMENT,
        cookie varchar(1024),
        user_id varchar(1024),
        time varchar(32) DEFAULT '0',
        ip varchar(32) DEFAULT '0',
        user_agent varchar(1024) DEFAULT '0',
        status varchar(32) DEFAULT 'ACTIVE',
        expiry varchar(32) DEFAULT '0',
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createMajorsTable(connection) {
    if (await tableExists(connection, "majors")) return true;
    const sql = `CREATE TABLE majors (
  id INT(11) NOT NULL AUTO_INCREMENT,
  degree_type VARCHAR(64) NOT NULL,
  program_name VARCHAR(255) NOT NULL,
  program_short_name VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
) ENGINE = InnoDB`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createSessionsTable(connection) {
    if (await tableExists(connection, "sessions")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS sessions (
        id INT(11) NOT NULL AUTO_INCREMENT,
        session_year VARCHAR(4) NOT NULL,
        session_season VARCHAR(32) NOT NULL,
        short_code VARCHAR(16) NOT NULL,
        status VARCHAR(16) DEFAULT 'ACTIVE',
        PRIMARY KEY (id)
        ) ENGINE=InnoDB`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createSubjectsTable(connection) {
    if (await tableExists(connection, "subjects")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS subjects (
        id INT(11) NOT NULL AUTO_INCREMENT,
        program_id VARCHAR(11) NOT NULL,
        semester VARCHAR(16) NOT NULL,
        subject_name VARCHAR(255) NOT NULL,
        subject_code VARCHAR(32) NOT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB`;
    const [q] = await connection.execute(sql);
    return !!q;
}


async function createSMSSentTable(connection) {
    if (await tableExists(connection, "sms_sents")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS sms_sents (
        id int(255) NOT NULL AUTO_INCREMENT,
        phone varchar(64) NOT NULL DEFAULT '',
        user_id varchar(255) NOT NULL,
        body longtext NOT NULL,
        time varchar(16) NOT NULL DEFAULT '0',
        charged varchar(8) NOT NULL DEFAULT '0.50',
        ip varchar(1024) NOT NULL,
        status varchar(32) NOT NULL,
        error longtext NOT NULL,
        response longtext NOT NULL,
        request_id varchar(255) NOT NULL,
        sms_server varchar(1024) NOT NULL,
        PRIMARY KEY (id)
    )`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createAssignedSubjectsTeacherTable(connection) {
    if (await tableExists(connection, "assigned_teachers")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS assigned_teachers (
        id INT(11) NOT NULL AUTO_INCREMENT,
        session_id INT(11) NOT NULL,
        program_id INT(11) NOT NULL,
        semester VARCHAR(16) NOT NULL,
        subject_id INT(11) NOT NULL,
        teacher_id INT(11) NOT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB`;
    const [q] = await connection.execute(sql);
    return !!q;
}



export default async (connection) => {
    return await createUser(connection)
        && await createCookies(connection)
        && await createMajorsTable(connection)
        && await createSubjectsTable(connection)
        && await createSessionsTable(connection)
        && await createAssignedSubjectsTeacherTable(connection)
        && await createSMSSentTable(connection);
};
