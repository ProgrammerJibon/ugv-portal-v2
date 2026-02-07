async function tableExists(connection, table) {
    const [rows] = await connection.execute("SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?", [table]);
    return rows.length > 0;
}

async function createUser(connection) {
    if (await tableExists(connection, "users")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS users (
        id int(11) NOT NULL AUTO_INCREMENT,
        
        user_id varchar(64) NOT NULL,
        password varchar(255) NOT NULL,
        user_type varchar(32) NOT NULL,
        
        name varchar(255) NOT NULL,
        email_address varchar(255) NOT NULL,
        phone_number varchar(32) NOT NULL,
        address varchar(1024) DEFAULT NULL,
        date_of_birth varchar(32) DEFAULT NULL,
        gender varchar(16) DEFAULT NULL,
        blood_group varchar(16) DEFAULT NULL,
        religion varchar(32) DEFAULT NULL,
        student_nid varchar(64) DEFAULT NULL,

        faculty_id varchar(32) DEFAULT NULL,
        designation varchar(64) DEFAULT NULL,
        joining_date varchar(32) DEFAULT NULL,
        program_type varchar(16) DEFAULT NULL,
        current_semester varchar(2) DEFAULT "1",
        section varchar(2) DEFAULT NULL,

        program varchar(64) DEFAULT NULL,
        session varchar(32) DEFAULT NULL,
        father_name varchar(255) DEFAULT NULL,
        mother_name varchar(255) DEFAULT NULL,
        guardian_phone varchar(32) DEFAULT NULL,
        guardian_nid varchar(64) DEFAULT NULL,

        PRIMARY KEY (id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`;
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

async function createCourseMaterialTable(connection) {
    if (await tableExists(connection, "course_materials")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS course_materials (
        id INT(11) NOT NULL AUTO_INCREMENT,
        subject_id INT(11) NOT NULL, -- Foreign Key to subjects
        teacher_id INT(11) NOT NULL, -- Foreign Key to users
        
        title VARCHAR(255) NOT NULL,
        description VARCHAR(1024) DEFAULT NULL,
        file_path VARCHAR(512) NOT NULL,
        file_type VARCHAR(16) NOT NULL, -- 'pdf', 'docx', 'mp4'
        file_size VARCHAR(32) NOT NULL, -- Storing as string e.g. "2.5 MB"
        upload_date VARCHAR(32) NOT NULL, -- Storing date as string
        
        PRIMARY KEY (id)
        ) ENGINE=InnoDB`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createStudentsMarksTable(connection) {
    if (await tableExists(connection, "student_marks")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS student_marks (
        id INT(11) NOT NULL AUTO_INCREMENT,
        student_user_id VARCHAR(64) NOT NULL, 
        session_id VARCHAR(11) NOT NULL,
        program_id VARCHAR(11) NOT NULL,
        subject_id VARCHAR(11) NOT NULL,
        teacher_id VARCHAR(11) NOT NULL,
        semester VARCHAR(16) NOT NULL,
        
        mark_attendance VARCHAR(5) DEFAULT 0,
        mark_quiz VARCHAR(5) DEFAULT 0,
        mark_assignment VARCHAR(5) DEFAULT 0,
        mark_mid VARCHAR(5) DEFAULT 0,
        mark_final VARCHAR(5) DEFAULT 0,
        
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
        mark_attendance VARCHAR(4) NOT NULL DEFAULT '15',
        mark_quize VARCHAR(4) NOT NULL DEFAULT '15',
        mark_assignment VARCHAR(4) NOT NULL DEFAULT '15',
        mark_mid VARCHAR(4) NOT NULL DEFAULT '45',
        mark_final VARCHAR(4) NOT NULL DEFAULT '60',
        credit VARCHAR(2) NOT NULL DEFAULT '3',
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
        mark_open VARCHAR(2) NOT NULL,
        PRIMARY KEY (id)
        ) ENGINE=InnoDB`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createTeacherReviewsTable(connection) {
    if (await tableExists(connection, "teacher_reviews")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS teacher_reviews (
        id INT(11) NOT NULL AUTO_INCREMENT,
        student_user_id VARCHAR(64) NOT NULL,
        teacher_id VARCHAR(11) NOT NULL,
        session_id VARCHAR(11) NOT NULL,
        program_id VARCHAR(11) NOT NULL,
        semester VARCHAR(16) NOT NULL,
        subject_id VARCHAR(11) NOT NULL,
        rating VARCHAR(4) NOT NULL,
        comment VARCHAR(1024) DEFAULT NULL,
        created_at VARCHAR(32) NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createPaymentsTable(connection) {
    if (await tableExists(connection, "payments")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS payments (
        id INT(11) NOT NULL AUTO_INCREMENT,
        student_user_id VARCHAR(64) NOT NULL,
        session VARCHAR(32) NOT NULL,
        fee_type VARCHAR(64) NOT NULL,
        amount VARCHAR(10) NOT NULL,
        payment_method VARCHAR(16) NOT NULL,
        trx_id VARCHAR(64) DEFAULT NULL,
        remarks VARCHAR(512) DEFAULT NULL,
        payment_date VARCHAR(32) NOT NULL,
        created_by VARCHAR(11) NOT NULL, -- Accountant ID
        PRIMARY KEY (id)
        ) ENGINE=InnoDB;`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createFinancialTable(connection) {
    if (await tableExists(connection, "financials")) return true;
    const sql = `CREATE TABLE IF NOT EXISTS student_financials (
        id INT(11) NOT NULL AUTO_INCREMENT,
        student_user_id VARCHAR(64) NOT NULL,
        total_due VARCHAR(10) DEFAULT '0.00',
        last_payment_date VARCHAR(32) DEFAULT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
        && await createStudentsMarksTable(connection)
        && await createCourseMaterialTable(connection)
        && await createTeacherReviewsTable(connection)
        && await createPaymentsTable(connection)
        && await createFinancialTable(connection)
        && await createAssignedSubjectsTeacherTable(connection)
        && await createSMSSentTable(connection);
};
