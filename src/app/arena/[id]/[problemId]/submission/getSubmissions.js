"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export default async function getSubmissions(arenaId, problemId, type) {
    if (!arenaId || !problemId) return [];

    const connection = await connectDatabase();

    const [submissions] = await connection.execute(
        `SELECT 
            s.id, s.user_id, s.code_language, s.submitted_on, s.code,
            u.name as user_name, u.pic as user_pic, u.university_student_id, u.university_id
         FROM code_submissions s
         LEFT JOIN users u ON s.user_id = u.id
         WHERE s.arena_id = ? AND s.problem_id = ?
         ORDER BY s.id DESC`,
        [arenaId, problemId]
    );

    if (!submissions.length) return [];

    const submissionIds = submissions.map(s => s.id);
    const placeholders = submissionIds.map(() => "?").join(",");

    const [results] = await connection.execute(
        `SELECT submission_id, matched 
         FROM code_submissions_testcases_result
         WHERE submission_id IN (${placeholders})`,
        submissionIds
    );

    const submissionStatusMap = {};
    submissions.forEach(sub => {
        submissionStatusMap[sub.id] = true;
    });

    results.forEach(r => {
        if (Number(r.matched) !== 1) {
            submissionStatusMap[r.submission_id] = false;
        }
    });

    const processedSubmissions = submissions.map(sub => ({
        ...sub,
        isPassed: submissionStatusMap[sub.id]
    }));

    if (type === "standings") {
        const passedSubs = processedSubmissions.filter(s => s.isPassed);

        const lastSuccessPerUser = {};
        passedSubs.forEach(sub => {
            const uid = sub.user_id;
            if (
                !lastSuccessPerUser[uid] ||
                new Date(sub.submitted_on) > new Date(lastSuccessPerUser[uid].submitted_on)
            ) {
                lastSuccessPerUser[uid] = sub;
            }
        });

        return Object.values(lastSuccessPerUser)
            .sort((a, b) => new Date(a.submitted_on) - new Date(b.submitted_on))
            .map((s, i) => ({
                ...s,
                rank: i + 1
            }));
    }

    const userStats = {};
    processedSubmissions.forEach(sub => {
        const uid = sub.user_id;
        if (!userStats[uid]) userStats[uid] = { hasSuccess: false, hasFail: false };
        if (sub.isPassed) userStats[uid].hasSuccess = true;
        else userStats[uid].hasFail = true;
    });

    switch (type) {
        case "totalSubmissionsPassed":
            return processedSubmissions.filter(s => s.isPassed);

        case "totalSubmissionsFailed":
            return processedSubmissions.filter(s => !s.isPassed);

        case "usersWithAtLeastOneSuccess":
            return processedSubmissions.filter(s => userStats[s.user_id].hasSuccess);

        case "usersWithAtLeastOneFailure":
            return processedSubmissions.filter(s => userStats[s.user_id].hasFail);

        case "usersWithOnlySuccess":
            return processedSubmissions.filter(
                s => userStats[s.user_id].hasSuccess && !userStats[s.user_id].hasFail
            );

        case "usersWithOnlyFailure":
            return processedSubmissions.filter(
                s => !userStats[s.user_id].hasSuccess && userStats[s.user_id].hasFail
            );

        default:
            return processedSubmissions;
    }
}
