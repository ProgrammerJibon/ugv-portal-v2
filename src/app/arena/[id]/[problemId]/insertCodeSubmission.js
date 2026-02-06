"use server";



export default async function insertCodeSubmission(connection,{
    arena_id,
    problem_id,
    user_id,
    code_language,
    code,
    submitted_on
}) {
    const sql = `
        INSERT INTO code_submissions
        (arena_id, problem_id, user_id, code_language, code, submitted_on)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [res] = await connection.execute(sql, [
        arena_id,
        problem_id,
        user_id,
        code_language,
        code,
        submitted_on
    ]);
    return res.insertId;
}