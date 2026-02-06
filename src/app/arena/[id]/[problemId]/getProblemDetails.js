"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export default async function getProblemDetails(problemId, isServer = false) {


    
    const connect = await connectDatabase();

    try {
        const [problemRows] = await connect.execute(
            "SELECT * FROM problem_set WHERE id = ? AND status = 'ACTIVE' LIMIT 1",
            [problemId]
        );

        if (problemRows.length === 0) {
            return { error: "Problem not found" };
        }

        const problem = problemRows[0];

        const [testcaseRows] = await connect.execute(
            "SELECT id, testcase_input, testcase_output, testcase_type FROM problem_test_case_set WHERE problem_set_id = ? AND status = 'ACTIVE' ORDER BY id ASC",
            [
                problem?.id
            ]
        );

        // if isserver, then remove testcase input and output, but keep other things
        if (!isServer) {
            for (let i = 0; i < testcaseRows.length; i++) {
                if(testcaseRows[i].testcase_type === '2') {
                    testcaseRows[i].testcase_input = "";
                    testcaseRows[i].testcase_output = "";
                }
            }
        }

        return {
            success: true,
            problem,
            testcases: testcaseRows
        };
    } catch (e) {
        console.error(e);
        return { error: "Database error" };
    } finally {
        // // await // connect.end();

    
    }
}
