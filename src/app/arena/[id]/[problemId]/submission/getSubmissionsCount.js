"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export default async function getSubmissionsCount(arenaId, problemId) {
    if (!arenaId || !problemId) return { error: "INVALID_PARAMETERS" };

    const connection = await connectDatabase();

    const [submissions] = await connection.execute(
        "SELECT id, user_id FROM code_submissions WHERE arena_id = ? AND problem_id = ?",
        [arenaId, problemId]
    );

    if (!submissions.length) {
        // await connection.end();
        return {
            all: submissions.length,
            onlySuccess: 0,
            success: 0,
            failed: 0,
            allSuccess: 0,
            allFailed: 0,
            onlyFailed: 0
        };
    }

    const submissionIds = submissions.map(s => s.id);
    const placeholders = submissionIds.map(() => "?").join(",");

    const [results] = await connection.execute(
        `SELECT submission_id, matched FROM code_submissions_testcases_result
         WHERE submission_id IN (${placeholders})`,
        submissionIds
    );

    const submissionMap = {};
    submissions.forEach(sub => {
        submissionMap[sub.id] = { user_id: sub.user_id, passed: true }; // assume passed
    });

    let allSuccess = 0;
    let allFailed = 0;

    results.forEach(r => {
        if (Number(r.matched) !== 1) {
            submissionMap[r.submission_id].passed = false;
        }
    });

    Object.values(submissionMap).forEach(sub => {
        if (sub.passed) allSuccess++;
        else allFailed++;
    });

    const userStats = {};
    submissions.forEach(sub => {
        const userId = sub.user_id;
        const passed = submissionMap[sub.id].passed;
        if (!userStats[userId]) userStats[userId] = { hasSuccess: false, hasFail: false };
        if (passed) userStats[userId].hasSuccess = true;
        else userStats[userId].hasFail = true;
    });

    let onlySuccess = 0;
    let onlyFailed = 0;
    let success = 0;
    let failed = 0;

    Object.values(userStats).forEach(u => {
        if (u.hasSuccess && !u.hasFail) onlySuccess++;
        if (!u.hasSuccess && u.hasFail) onlyFailed++;
        if (u.hasSuccess) success++;
        if (u.hasFail) failed++;
    });

    // await connection.end();

    return {
        allOverSubmission: submissions.length,
        totalSubmissionsPassed: allSuccess,       // Total number of submissions where all testcases passed
        totalSubmissionsFailed: allFailed,        // Total number of submissions where at least one testcase failed
        usersWithAtLeastOneSuccess: success,      // Number of unique users who passed at least one submission
        usersWithAtLeastOneFailure: failed,       // Number of unique users who have at least one failing submission
        usersWithOnlySuccess: onlySuccess,        // Number of unique users whose all submissions passed (no fails)
        usersWithOnlyFailure: onlyFailed          // Number of unique users whose submissions never passed
    };

}
