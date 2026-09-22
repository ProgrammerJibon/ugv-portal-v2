"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// 1. Fetch Dropdown Data (Sessions, Majors, Teachers)
export async function getAllocationDropdowns() {
    const db = await connectDatabase();
    try {
        // Fetch Sessions (newest first)
        const [sessions] = await db.execute("SELECT * FROM sessions ORDER BY id DESC");

        

        // Fetch Majors
        const [majors] = await db.execute("SELECT * FROM majors ORDER BY program_name ASC");

        // Fetch Teachers
        const [teachers] = await db.execute("SELECT * FROM users WHERE user_type LIKE 'teacher' ORDER BY name ASC");

        return { status: "success", sessions, majors, teachers };
    } catch (error) {
        return { status: "error", message: "Failed to load dropdown data" };
    }
}

// 2. Fetch Subjects based on Program and Semester
export async function getSubjectsForDropdown(programId, semester) {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute(
            "SELECT * FROM subjects WHERE program_id = ? AND semester = ? ORDER BY subject_code ASC",
            [programId, semester]
        );
        
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to fetch subjects" };
    }
}

// 3. Fetch Existing Assignments (The Table Data)
export async function getAssignmentsAction(sessionId, programId) {
    const db = await connectDatabase();
    try {
        const query = `
            SELECT 
                at.id, 
                at.semester, 
                s.subject_code, 
                s.subject_name, 
                u.name as teacher_name, 
                u.designation
            FROM assigned_teachers at
            JOIN subjects s ON at.subject_id = s.id
            JOIN users u ON at.teacher_id = u.id
            WHERE at.session_id = ? AND at.program_id = ?
            ORDER BY at.semester ASC, s.subject_code ASC
        `;
        const [rows] = await db.execute(query, [sessionId, programId]);
        return { status: "success", data: rows };
    } catch (error) {
        console.error(error);
        return { status: "error", message: "Failed to fetch assignments" };
    }
}

// 4. Assign Teacher (Insert)
export async function assignTeacherAction(formData) {
    const db = await connectDatabase();

    const sessionId = formData.get("sessionId");
    const programId = formData.get("programId");
    const semester = formData.get("semester");
    const subjectId = formData.get("subjectId");
    const teacherId = formData.get("teacherId");

    if (!sessionId || !programId || !subjectId || !teacherId) {
        return { status: "error", message: "All fields are required" };
    }

    try {
        await db.execute(
            "INSERT INTO assigned_teachers (session_id, program_id, semester, subject_id, teacher_id, mark_open) VALUES (?, ?, ?, ?, ?, '0')",
            [sessionId, programId, semester, subjectId, teacherId]
        );
        return { status: "success", message: "Faculty assigned successfully!" };
    } catch (error) {
        // Handle unique constraint violation
        if (error.code === 'ER_DUP_ENTRY') {
            return { status: "error", message: "This subject is already assigned for this session." };
        }
        return { status: "error", message: "Database error" };
    }
}

// 5. Remove Assignment (Delete)
export async function removeAssignmentAction(id) {
    const db = await connectDatabase();
    try {
        await db.execute("DELETE FROM assigned_teachers WHERE id = ?", [id]);
        return { status: "success", message: "Assignment removed" };
    } catch (error) {
        return { status: "error", message: "Failed to remove assignment" };
    }
}