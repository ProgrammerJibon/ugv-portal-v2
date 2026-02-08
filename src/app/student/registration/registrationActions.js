"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export async function getStudentRegistrationAction(studentId) {
    const db = await connectDatabase();
    try {
        console.log("fuk");
        
        // 1. Get the Current Active Session from System
        // Assumes the latest added session is the current one
        const [sessionRows] = await db.execute(`
            SELECT CONCAT(session_season, ' ', session_year) as session_name 
            FROM sessions 
            ORDER BY id DESC LIMIT 1
        `);

        if (sessionRows.length === 0) {
            return { status: "error", message: "System session not configured." };
        }
        const currentSystemSession = sessionRows[0].session_name;

        // 2. Get Student Info
        const [userRows] = await db.execute(
            "SELECT last_promoted_session, program, current_semester FROM users WHERE user_id = ?",
            [studentId]
        );

        if (userRows.length === 0) return { status: "error", message: "Student not found" };

        const student = userRows[0];

        // 3. Logic: Check if Student's Promoted Session matches System Session
        // If they match, it means they have completed promotion/registration for this specific session.
        const isRegistered = student.last_promoted_session === currentSystemSession;

        if (!isRegistered) {
            return {
                status: "success",
                isRegistered: false,
                semester: student.current_semester
            };
        }

        // 4. If Registered, Fetch Subjects
        const [subjects] = await db.execute(`
            SELECT subject_code, subject_name, credit 
            FROM subjects 
            WHERE program_id = ? AND semester = ?
            ORDER BY subject_code ASC
        `, [student.program, student.current_semester]);

        return {
            status: "success",
            isRegistered: true,
            semester: student.current_semester,
            subjects: subjects
        };

    } catch (error) {
        console.error("Registration Load Error:", error);
        return { status: "error", message: "Failed to load data" };
    }
}