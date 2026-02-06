import insertCountries from "./insertCountries";
import insertUniversities from "./insertUniversities";

async function tableExists(connection, table) {
    const [rows] = await connection.execute("SELECT 1 FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?", [table]);
    return rows.length > 0;
}

async function createUser(connection) {
    if (await tableExists(connection, "users")) return true;
    const sql = `CREATE TABLE users (
        id int(11) NOT NULL AUTO_INCREMENT,
        name varchar(256),
        pic varchar(1024),
        phone varchar(32),
        email varchar(1024),
        country_short_code varchar(4) DEFAULT 'BD',
        university_id varchar(11) DEFAULT '0',
        university_student_id varchar(32),
        password varchar(256),
        status varchar(32) DEFAULT 'PENDING',
        req_time varchar(32) DEFAULT '0',
        done_time varchar(32) DEFAULT '0',
        done_by varchar(11),
        user_type varchar(32) DEFAULT 'STUDENT',
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

async function createFootPrints(connection) {
    if (await tableExists(connection, "footprints")) return true;
    const sql = `CREATE TABLE footprints (
        id INT(11) NOT NULL AUTO_INCREMENT,
        possible_user_id VARCHAR(255) DEFAULT '0',
        details LONGTEXT,
        type VARCHAR(64) DEFAULT 'DUMP_LOGS',
        time VARCHAR(32) DEFAULT '0',
        ip VARCHAR(32) DEFAULT '0',
        user_agents VARCHAR(1024) DEFAULT '0',
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createArenaList(connection) {
    if (await tableExists(connection, "arena_list")) return true;
    const sql = `CREATE TABLE arena_list (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(256),
        created_by VARCHAR(11),
        created_on VARCHAR(16),
        country_code VARCHAR(4) DEFAULT 'BD',
        university_id VARCHAR(11) DEFAULT '0',
        batch_no VARCHAR(16),
        pricing VARCHAR(8) DEFAULT '100',
        payment_method VARCHAR(32),
        codes_shown VARCHAR(2) DEFAULT '0',
        payment_acount_number VARCHAR(64),
        status VARCHAR(32) DEFAULT 'ACTIVE',
        comment VARCHAR(1024),
        PRIMARY KEY (id)
    )`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createCountryList(connection) {
    if (await tableExists(connection, "country_list")) return true;
    const sql = `CREATE TABLE country_list (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(256),
        short_code VARCHAR(4),
        flag_url VARCHAR(1024),
        phone_min_length VARCHAR(4) DEFAULT '11',
        phone_max_length VARCHAR(4) DEFAULT '11',
        PRIMARY KEY (id)
    )`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createUniversityList(connection) {
    if (await tableExists(connection, "university_list")) return true;
    const sql = `CREATE TABLE university_list (
        id INT(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(512),
        country_short_code VARCHAR(4) DEFAULT 'BD',
        varsity_type VARCHAR(32) DEFAULT 'PRIVATE',
        PRIMARY KEY (id)
    )`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createProblemSet(connection) {
    if (await tableExists(connection, "problem_set")) return true;
    const sql = `CREATE TABLE problem_set (
        id INT(11) NOT NULL AUTO_INCREMENT,
        ProblemName VARCHAR(1024),
        problem_statement LONGTEXT,
        input_type LONGTEXT,
        output_type LONGTEXT,
        arena_id VARCHAR(11),
        added_by VARCHAR(11),
        status VARCHAR(8),
        created_on VARCHAR(16),
        PRIMARY KEY (id)
    )`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createProblemTestCase(connection) {
    if (await tableExists(connection, "problem_test_case_set")) return true;
    const sql = `CREATE TABLE problem_test_case_set (
        id INT(11) NOT NULL AUTO_INCREMENT,
        problem_set_id VARCHAR(11),
        testcase_input LONGTEXT,
        testcase_output LONGTEXT,
        testcase_type VARCHAR(2),
        status VARCHAR(8),
        created_on VARCHAR(16),
        PRIMARY KEY (id)
    )`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createArenaUsersTable(connection) {
    if (await tableExists(connection, "arena_users")) return true;
    const sql = `CREATE TABLE arena_users (
        id INT(11) NOT NULL AUTO_INCREMENT,
        user_id VARCHAR(11),
        arena_id VARCHAR(11),
        payment_txn_id VARCHAR(256),
        payment_by_number VARCHAR(64),
        updated_by VARCHAR(11),
        status VARCHAR(16) DEFAULT 'PENDING',
        update_comment VARCHAR(1024),
        created_on VARCHAR(16),
        updated_on VARCHAR(16),
        PRIMARY KEY (id)
    )`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createCodeSubmissionTable(connection) {
    if (await tableExists(connection, "code_submissions")) return true;
    const sql = `CREATE TABLE code_submissions (
        id INT(11) NOT NULL AUTO_INCREMENT,
        arena_id VARCHAR(11),
        problem_id VARCHAR(11),
        user_id VARCHAR(11),
        code_language VARCHAR(32),
        code LONGTEXT,
        submitted_on VARCHAR(16),
        PRIMARY KEY (id)
    )`;
    const [q] = await connection.execute(sql);
    return !!q;
}

async function createCodeSubmissionTestCasesResultsTable(connection) {
    if (await tableExists(connection, "code_submissions_testcases_result")) return true;
    const sql = `CREATE TABLE code_submissions_testcases_result (
        id INT(11) NOT NULL AUTO_INCREMENT,
        arena_id VARCHAR(11),
        problem_id VARCHAR(11),
        user_id VARCHAR(11),
        submission_id VARCHAR(11),
        testcase_id VARCHAR(11),
        matched VARCHAR(4) DEFAULT '0',
        output LONGTEXT,
        PRIMARY KEY (id)
    )`;
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



export default async (connection) => {
    return await createUser(connection)
        && await createCookies(connection)
        && await createFootPrints(connection)
        && await createArenaList(connection)
        && await createCountryList(connection)
        && await createUniversityList(connection)
        && await createProblemSet(connection)
        && await createProblemTestCase(connection)
        && await createArenaUsersTable(connection)
        && await createCodeSubmissionTable(connection)
        && await createCodeSubmissionTestCasesResultsTable(connection)
        && await insertCountries(connection)
        && await insertUniversities(connection)
        && await createSMSSentTable(connection);
};
