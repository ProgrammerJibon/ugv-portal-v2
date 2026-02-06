"use server";


export default async function insertSubmissionTestcaseResult(connection, {
    arena_id,
    problem_id,
    user_id,
    submission_id,
    matched,
    testcase_id,
    output
}) {
    const sql = `
        INSERT INTO code_submissions_testcases_result
        (arena_id, problem_id, user_id, submission_id, matched, output, testcase_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const [res] = await connection.execute(sql, [
        arena_id,
        problem_id,
        user_id,
        submission_id,
        matched,
        output,
        testcase_id
    ]);
    return res.insertId;
}