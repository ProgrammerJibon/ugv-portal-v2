"use server";

import { connectDatabase } from "@/app/json/connectDatabase";


export async function findStudentAction(studentId) {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute(
            `SELECT 
                id, user_id, name, program, batch, session, status, 
                current_semester, program_type 
             FROM users 
             WHERE user_id = ? AND user_type = 'STUDENT'`,
            [studentId]
        );

        if (rows.length === 0) {
            return { status: "error", message: "Student not found." };
        }

        const student = rows[0];

        
        
        const [progRows] = await db.execute("SELECT program_name FROM majors WHERE id = ?", [student.program]);
        const programName = progRows.length > 0 ? progRows[0].program_name : "Unknown Program";

        return {
            status: "success",
            data: {
                ...student,
                programName: programName
            }
        };

    } catch (error) {
        console.error("Search Error:", error);
        return { status: "error", message: "Database search failed." };
    }
}


export async function getActiveSessionsAction() {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute("SELECT session_year, session_season FROM sessions WHERE status IN ('ACTIVE', 'Upcoming') ORDER BY id DESC");
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to load sessions" };
    }
}


export async function processReadmissionAction(studentDbId, targetSession, rejoinSemester) {
    const db = await connectDatabase();
    try {
        await db.execute(
            "UPDATE users SET status = 'ACTIVE', session = ?, current_semester = ? WHERE id = ?",
            [targetSession, rejoinSemester, studentDbId]
        );
        return { status: "success", message: "Student re-admitted successfully." };
    } catch (error) {
        console.error("Update Error:", error);
        return { status: "error", message: "Failed to update student record." };
    }
}