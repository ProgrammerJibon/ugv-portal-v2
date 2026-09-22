"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export async function getStudentRegistrationAction(studentId) {
    const db = await connectDatabase();
    try {
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

        // 4. If Registered, Fetch Subjects with ID
        const [subjects] = await db.execute(`
            SELECT id, subject_code, subject_name, credit 
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

// 5. Fetch Course Materials for Enrolled Student
export async function getStudentCourseMaterialsAction(subjectId) {
    const db = await connectDatabase();
    try {
        const [materials] = await db.execute(`
            SELECT cm.id, cm.title, cm.description, cm.file_path, cm.file_type, cm.file_size, cm.upload_date,
                   u.name as teacher_name
            FROM course_materials cm
            LEFT JOIN users u ON cm.teacher_id = u.id
            WHERE cm.subject_id = ?
            ORDER BY cm.id DESC
        `, [subjectId]);

        return { status: "success", materials };
    } catch (error) {
        console.error("Fetch Student Materials Error:", error);
        return { status: "error", message: "Failed to load course materials." };
    }
}