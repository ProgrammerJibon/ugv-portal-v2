"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// 1. Fetch Targeted Teachers (Filtered by Student's Context)
export async function getTeachersListAction(studentData) {
    const db = await connectDatabase();
    const { program, session, current_semester } = studentData;

    try {
        // We need to find the session_id based on the string "Spring 2026"
        // And match program_id and semester from the assigned_teachers table
        const query = `
            SELECT 
                u.id as teacher_id, 
                u.name, 
                u.designation, 
                u.faculty_id,
                s.subject_name,
                s.subject_code,
                s.id as subject_id,
                sess.id as session_id,
                at.program_id,
                at.semester
            FROM assigned_teachers at
            JOIN users u ON at.teacher_id = u.id
            JOIN subjects s ON at.subject_id = s.id
            JOIN sessions sess ON at.session_id = sess.id
            WHERE 
                at.program_id = ? 
                AND at.semester = ?
                AND CONCAT(sess.session_season, ' ', sess.session_year) = ?
            ORDER BY u.name ASC
        `;

        const [rows] = await db.execute(query, [program, current_semester, session]);

        return { status: "success", data: rows };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { status: "error", message: "Failed to load assigned teachers." };
    }
}

// 2. Submit Review (Updated with Context)
export async function submitReviewAction(formData) {
    const db = await connectDatabase();

    const studentId = formData.get("studentId");
    const teacherId = formData.get("teacherId");
    const rating = formData.get("rating");
    const comment = formData.get("comment");

    // Context Data
    const sessionId = formData.get("sessionId");
    const programId = formData.get("programId");
    const semester = formData.get("semester");
    const subjectId = formData.get("subjectId");

    if (!studentId || !teacherId || !rating) {
        return { status: "error", message: "Missing required fields." };
    }

    try {
        const dateStr = new Date().toISOString().split('T')[0];

        // Check using the new unique logic (Subject specific)
        const [existing] = await db.execute(
            "SELECT id FROM teacher_reviews WHERE student_user_id = ? AND teacher_id = ? AND subject_id = ? AND session_id = ?",
            [studentId, teacherId, subjectId, sessionId]
        );

        if (existing.length > 0) {
            // Update
            await db.execute(
                "UPDATE teacher_reviews SET rating = ?, comment = ?, created_at = ? WHERE id = ?",
                [rating, comment, dateStr, existing[0].id]
            );
            return { status: "success", message: "Review updated successfully!" };
        } else {
            // Insert
            await db.execute(
                `INSERT INTO teacher_reviews 
                (student_user_id, teacher_id, rating, comment, created_at, session_id, program_id, semester, subject_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [studentId, teacherId, rating, comment, dateStr, sessionId, programId, semester, subjectId]
            );
            return { status: "success", message: "Review submitted successfully!" };
        }

    } catch (error) {
        console.error("Submit Error:", error);
        return { status: "error", message: "Failed to submit review." };
    }
}