"use server";

import { connectDatabase } from "@/app/json/connectDatabase";
import checkIfArenaUser from "@/app/json/serverFunctions";

export default async (arenaId, userId) => {
    const checkIfArenaUserRes = await checkIfArenaUser(arenaId, userId);

    if (!checkIfArenaUserRes || checkIfArenaUserRes.status !== "APPROVED") {
        return [];
    }

    const connect = await connectDatabase();

    const sql = `
        SELECT 
            ps.*,
            CASE 
                WHEN EXISTS (
                    SELECT 1
                    FROM code_submissions cs
                    JOIN code_submissions_testcases_result cr 
                        ON cs.id = cr.submission_id
                    WHERE cs.problem_id = ps.id 
                      AND cs.user_id = ? 
                    GROUP BY cs.id
                    HAVING SUM(cr.matched = '1') = COUNT(cr.id)
                ) THEN 1
                ELSE 0
            END AS passed
        FROM problem_set ps
        WHERE ps.arena_id = ?
        ORDER BY ps.id DESC
    `;

    const [problemRows] = await connect.execute(sql, [userId, arenaId]);

    if (problemRows.length > 0) {
        return problemRows;
    }
    
    return [];
};
