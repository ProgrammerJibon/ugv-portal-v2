"use server";

import { time } from "@/app/functions";
import { connectDatabase } from "@/app/json/connectDatabase";
import insertCodeSubmission from "./insertCodeSubmission";
import insertSubmissionTestcaseResult from "./insertSubmissionTestcaseResult";
import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import CodeCompiler from "@/Components/CodeCompiler";

export default async function checkServerTestcasesAndPushResults({
    arena_id,
    problem_id,
    code,
    codeRunResultClient,
    language_name
}) {

    let codeRunResult = codeRunResultClient || [];



    if (!arena_id || !problem_id || !code || !codeRunResult || !language_name) {
        return { error: "INVALID_PARAMETERS" };
    }
    const language_nameLower = language_name.toLowerCase();


    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return { error: "NOT_AUTHENTICATED" };
    }

    const user = gUser.user;

    const connection = await connectDatabase();

    const [serverTestcases] = await connection.execute(
        "SELECT * FROM `problem_test_case_set` WHERE `problem_set_id` = ? AND `testcase_type` = '2'",
        [problem_id]
    );

    const submitted_on = time();



    const submission_id = await insertCodeSubmission(connection, {
        arena_id,
        problem_id,
        user_id: user?.id,
        code_language: language_nameLower,
        code,
        submitted_on
    });


    for (const tc of codeRunResult) {
        if (tc.type != "2") {
            let passed = tc.passed;

            if (tc.type == "1") {
                passed = !tc.error && tc.output?.trim() === tc.expected_output?.trim();
                codeRunResult = codeRunResult.map(cr => cr.id === tc.id
                    ? { ...cr, passed, running: false, showResult: true }
                    : cr
                );
            }

            await insertSubmissionTestcaseResult(connection, {
                arena_id,
                problem_id,
                user_id: user?.id,
                submission_id,
                matched: passed ? "1" : "0",
                output: tc.output || "",
                testcase_id: tc.id
            });
        }
    }




    for (const tc of serverTestcases) {
        const runRes = await CodeCompiler({
            code,
            input: tc.testcase_input || "",
            language: language_nameLower
        });

        const passed =
            !runRes?.error &&
            runRes?.output?.trim() === tc?.testcase_output?.trim();

        codeRunResult = codeRunResult.map(cr => cr.id === tc.id
            ? { ...cr, passed, running: false, showResult: true }
            : cr
        );

        await insertSubmissionTestcaseResult(connection, {
            arena_id,
            problem_id,
            user_id: user?.id,
            submission_id,
            matched: passed ? "1" : "0",
            output: runRes?.output || runRes?.errorMsg || "",
            testcase_id: tc.id
        });
    }


    // // await connection.end();



    return {
        submission_id,
        codeRunResult
    };
}
