"use server";
import { connectDatabase } from "@/app/json/connectDatabase";

export default async function getUserProfile(userId) {
    if (!userId) return null;

    const conn = await connectDatabase();

    // 1. User Info
    const [userRes] = await conn.execute(
        `SELECT u.id, u.name, u.pic, u.university_student_id, ul.name AS university_name, u.country_short_code AS country
         FROM users u
         LEFT JOIN university_list ul ON ul.id = u.university_id
         WHERE u.id = ?`,
        [userId]
    );
    const user = userRes[0];
    if (!user) return null;

    // 2. Arenas joined
    const [arenas] = await conn.execute(
        `SELECT a.id, a.name, au.status, au.created_on AS joined_on
         FROM arena_users au
         JOIN arena_list a ON a.id = au.arena_id
         WHERE au.user_id = ?`,
        [userId]
    );

    // 3. Problem submissions with status
    const [submissions] = await conn.execute(
        `SELECT cs.id, cs.problem_id, cs.arena_id, cs.code_language, cs.submitted_on,
                ps.ProblemName AS problem_name, ps.id AS problem_id, a.name AS arena_name, a.id AS arena_id,
                CASE WHEN SUM(r.matched) = COUNT(r.id) THEN 1 ELSE 0 END AS isPassed
         FROM code_submissions cs
         JOIN code_submissions_testcases_result r ON r.submission_id = cs.id
         JOIN problem_set ps ON ps.id = cs.problem_id
         JOIN arena_list a ON a.id = cs.arena_id
         WHERE cs.user_id = ?
         GROUP BY cs.id
         ORDER BY cs.submitted_on DESC`,
        [userId]
    );

    return { user, arenas, submissions };
}
