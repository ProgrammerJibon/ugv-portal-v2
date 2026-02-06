"use server";

import { time } from "@/app/functions";
import { connectDatabase } from "@/app/json/connectDatabase";
import { getUserFromAuthCookie } from "@/app/json/serverFunctions";

export default async function insertProblem(data) {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return { error: "Unauthorized" };
    }

    const user = gUser.user;
    if (user.user_type != "TEACHER") {
        return { error: "Unauthorized" };
    }

    if (!data?.problem_title){
        return { error: "Problem Title Is Required!" };
    }
    if (!data?.problem_statement){
        return { error: "Problem Statement Is Required!" };
    }
    if (!data?.testcases || data?.testcases?.length < 1){
        return { error: "At least one test case is required!" };
    }
    
    let flagCheckTcOutputsOkay = true;
    for (const tc of data?.testcases){
        if (tc?.output?.trim() == ""){
            flagCheckTcOutputsOkay = false;
        }
    }
    if(!flagCheckTcOutputsOkay){
        return { error: "All testcases must have output!" };
    }

    

    const connect = await connectDatabase();
    const now = time();

    const insertProblemSql = `
        INSERT INTO problem_set
        (ProblemName, problem_statement, input_type, output_type, arena_id, added_by, status, created_on)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
        const [problemResult] = await connect.execute(insertProblemSql, [
            data.problem_title,
            data.problem_statement,
            data.input_type,
            data.output_type,
            data.arena_id,
            user.id,
            "ACTIVE",
            now
        ]);

        const problemId = problemResult.insertId;

        if (Array.isArray(data.testcases) && data.testcases.length > 0) {
            const insertTestcaseSql = `
                INSERT INTO problem_test_case_set
                (problem_set_id, testcase_input, testcase_output, testcase_type, status, created_on)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            for (const tc of data.testcases) {
                let type = 0;
                if (tc.run_type === "p2p") type = 1;
                else if (tc.run_type === "server") type = 2;

                await connect.execute(insertTestcaseSql, [
                    problemId,
                    tc.input,
                    tc.output,
                    type,
                    "ACTIVE",
                    now
                ]);
            }
        }

        return { success: true, problemId };
    } catch (error) {
        console.error("Insert Problem Error:", error);
        return { error: "Database error during insert" };
    } finally {
        // await // connect.end();

        }
    
}
