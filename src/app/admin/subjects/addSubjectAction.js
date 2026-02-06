"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// 1. Fetch all Programs (for the dropdown)
export async function getProgramsAction() {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute("SELECT id, program_name, program_short_name FROM majors ORDER BY program_name ASC");
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to fetch programs" };
    }
}

// 2. Fetch Subjects by Program ID (Updated to include ID)
export async function getSubjectsByProgramAction(programId, semester) {
    const db = await connectDatabase();
    try {
        // [UPDATED] Added 'id' to the SELECT statement
        const [rows] = await db.execute(
            "SELECT id, subject_name, subject_code FROM subjects WHERE program_id = ? AND semester = ? ORDER BY subject_code ASC",
            [programId, semester]
        );
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to fetch subjects" };
    }
}

// 3. Add New Subject
export async function addSubjectAction(formData) {
    const db = await connectDatabase();

    const programId = formData.get("programId");
    const semester = formData.get("semester");
    const subjectName = formData.get("subjectName");
    const subjectCode = formData.get("subjectCode");

    if (!programId || !semester || !subjectName || !subjectCode) {
        return { status: "error", message: "All fields are required." };
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

        // Insert
        await db.execute(
            "INSERT INTO subjects (program_id, semester, subject_name, subject_code) VALUES (?, ?, ?, ?)",
            [programId, semester, subjectName, subjectCode]
        );

        return { status: "success", message: "Subject added successfully!" };
    } catch (error) {
        console.error(error);
        return { status: "error", message: "Database error." };
    }
}

// 4. [NEW] Delete Subject
export async function deleteSubjectAction(subjectId) {
    const db = await connectDatabase();
    try {
        await db.execute("DELETE FROM subjects WHERE id = ?", [subjectId]);
        return { status: "success", message: "Subject deleted successfully." };
    } catch (error) {
        return { status: "error", message: "Failed to delete subject." };
    }
}