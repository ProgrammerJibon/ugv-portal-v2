"use server";

import { connectDatabase } from "@/app/json/connectDatabase";
import getArenaDetails from "../../getArenaDetails";
import { getUserFromAuthCookie } from "@/app/json/serverFunctions";

export default async function getSubmissionDetails(submissionId) {
    if (!submissionId) return null;

    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return null;
    }
    const user = gUser.user;

    const connection = await connectDatabase();

    // 1. Get the Code and Language
    const [submissionData] = await connection.execute(
        `SELECT code, code_language, user_id, arena_id FROM code_submissions WHERE id = ?`,
        [submissionId]
    );

    if (!submissionData.length) {
        // // await connection.end();
        return null;
    }

    const submission = submissionData[0];

    // 2. Get Test Case Results AND the original Inputs/Outputs
    // We join 'result' with 'problem_test_case_set' to show what the input was
    const [testCasesX] = await connection.execute(
        `SELECT 
            r.matched, 
            r.output as actual_output, 
            t.testcase_input, 
            t.testcase_output as expected_output,
            t.testcase_type
         FROM code_submissions_testcases_result r
         LEFT JOIN problem_test_case_set t ON r.testcase_id = t.id
         WHERE r.submission_id = ?`,
        [submissionId]
    );

    let testCases = testCasesX;


    if (submission?.arena_id) {
        const res1 = await getArenaDetails(submission?.arena_id);
        if (res1?.codes_shown && res1?.created_by != user?.id) {
            submission.code = "HIDDEN BY TEACHER";
            testCases = testCases.map((val, i) => {
                if (val?.testcase_type == 0) {
                    return val;
                } else {
                    val.expected_output = "HIDDEN BY TEACHER"
                    val.testcase_input = "HIDDEN BY TEACHER"
                    return val;
                }
            });
        }
    }



    return {
        code: submission.code,
        language: submission.code_language,
        testCases: testCases
    };
}