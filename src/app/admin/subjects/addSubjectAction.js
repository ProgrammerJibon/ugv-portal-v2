"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// 1. Fetch Programs (No change)
export async function getProgramsAction() {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute("SELECT id, program_name, program_short_name FROM majors ORDER BY program_name ASC");
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to fetch programs" };
    }
}

// 2. Fetch Subjects (No change)
export async function getSubjectsByProgramAction(programId, semester) {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute(
            "SELECT id, subject_name, subject_code FROM subjects WHERE program_id = ? AND semester = ? ORDER BY subject_code ASC",
            [programId, semester]
        );
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to fetch subjects" };
    }
}

// 3. Add New Subject (UPDATED)
export async function addSubjectAction(formData) {
    const db = await connectDatabase();

    const programId = formData.get("programId");
    const semester = formData.get("semester");
    const subjectName = formData.get("subjectName");
    const subjectCode = formData.get("subjectCode");

    // New Fields
    const credit = formData.get("credit");
    const markAttendance = formData.get("markAttendance");
    const markQuize = formData.get("markQuize");
    const markAssignment = formData.get("markAssignment");
    const markMid = formData.get("markMid");
    const markFinal = formData.get("markFinal");

    if (!programId || !semester || !subjectName || !subjectCode) {
        return { status: "error", message: "Basic fields are required." };
    }

    try {
        // Check duplicate
        const [existing] = await db.execute(
            "SELECT id FROM subjects WHERE program_id = ? AND subject_code = ? LIMIT 1",
            [programId, subjectCode]
        );

        if (existing.length > 0) {
            return { status: "error", message: "Subject code already exists for this program." };
        }

        // Insert with new columns
        // Note: mark_quize matches your specific DB spelling
        const query = `
            INSERT INTO subjects 
            (program_id, semester, subject_name, subject_code, credit, mark_attendance, mark_quize, mark_assignment, mark_mid, mark_final) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await db.execute(query, [
            programId, semester, subjectName, subjectCode,
            credit, markAttendance, markQuize, markAssignment, markMid, markFinal
        ]);

        return { status: "success", message: "Subject added successfully!" };
    } catch (error) {
        console.error(error);
        return { status: "error", message: "Database error." };
    }
}

// 4. Delete Subject (No change)
export async function deleteSubjectAction(subjectId) {
    const db = await connectDatabase();
    try {
        await db.execute("DELETE FROM subjects WHERE id = ?", [subjectId]);
        return { status: "success", message: "Subject deleted successfully." };
    } catch (error) {
        return { status: "error", message: "Failed to delete subject." };
    }
}