"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export default async function getArenaStandings(arenaId) {
    if (!arenaId) return { problems: [], users: [] };

    const connect = await connectDatabase();

    const [problems] = await connect.execute(
        `SELECT id FROM problem_set WHERE arena_id = ? ORDER BY id ASC`,
        [arenaId]
    );

    const [subs] = await connect.execute(
        `SELECT 
            cs.id,
            cs.problem_id,
            cs.user_id,
            cs.submitted_on,
            u.name AS user_name,
            u.pic AS user_pic,
            u.university_student_id,
            u.university_id,
            r.matched
        FROM code_submissions cs
        JOIN code_submissions_testcases_result r ON r.submission_id = cs.id
        JOIN users u ON u.id = cs.user_id
        WHERE cs.arena_id = ?`,
        [arenaId]
    );

    const users = {};

    subs.forEach(s => {
        if (!users[s.user_id]) {
            users[s.user_id] = {
                user_id: s.user_id,
                user_name: s.user_name,
                user_pic: s.user_pic,
                university_student_id: s.university_student_id,
                university_id: s.university_id,
                problems: {},
                solvedCount: 0 // success count
            };
        }

        const p = s.problem_id;
        const isAccepted = Number(s.matched) === 1;

        if (!users[s.user_id].problems[p]) {
            users[s.user_id].problems[p] = { firstAccepted: null, lastFailed: null };
        }

        if (isAccepted) {
            const curr = users[s.user_id].problems[p].firstAccepted;
            if (!curr || Number(s.submitted_on) < Number(curr.submitted_on)) {
                users[s.user_id].problems[p].firstAccepted = s;
            }
        } else {
            const currFail = users[s.user_id].problems[p].lastFailed;
            if (!currFail || Number(s.submitted_on) > Number(currFail.submitted_on)) {
                users[s.user_id].problems[p].lastFailed = s;
            }
        }
    });

    // Count solved problems per user
    Object.values(users).forEach(u => {
        u.solvedCount = Object.values(u.problems).filter(p => p.firstAccepted).length;
    });

    // Remove users with no submissions
    const finalUsers = Object.values(users).filter(u => Object.keys(u.problems).length > 0);

    // Sort descending by solvedCount, then by earliest firstAccepted submission
    finalUsers.sort((a, b) => {
        if (b.solvedCount !== a.solvedCount) return b.solvedCount - a.solvedCount;

        // If solvedCount equal, compare earliest accepted time sum
        const sumTime = u => Object.values(u.problems)
            .filter(p => p.firstAccepted)
            .reduce((acc, p) => acc + Number(p.firstAccepted.submitted_on), 0);
        return sumTime(a) - sumTime(b);
    });

    return {
        problems: problems.map(p => p.id),
        users: finalUsers
    };
}
