"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// 1. Fetch Class Data (Students + Existing Marks)
export async function getClassMarksData(subjectId, teacherId) {
    const db = await connectDatabase();

    try {
        // A. Get Assignment Details (Session, Program, Semester) from assigned_teachers
        // We need this to know WHICH students to fetch
        const [assignment] = await db.execute(`
            SELECT 
                at.session_id, at.program_id, at.semester,
                s.subject_code, s.subject_name,
                m.program_name, s.mark_attendance, s.mark_quize, s.mark_assignment, s.mark_mid, s.mark_final,
                sess.session_season, sess.session_year, sess.mark_open
            FROM assigned_teachers at
            JOIN subjects s ON at.subject_id = s.id
            JOIN majors m ON at.program_id = m.id
            JOIN sessions sess ON at.session_id = sess.id
            WHERE at.subject_id = ? AND at.teacher_id = ?
            LIMIT 1
        `, [subjectId, teacherId]);

        if (assignment.length === 0) {
            return { status: "error", message: "Course assignment not found." };
        }

        const courseInfo = assignment[0];

        // B. Fetch Students + Join with student_marks (LEFT JOIN)
        // Find session string to match users table (e.g., "Spring 2026")
        const sessionString = `${courseInfo.session_season} ${courseInfo.session_year}`;

        const query = `
            SELECT 
                u.user_id, u.name,
                COALESCE(sm.mark_attendance, 0) as mark_attendance,
                COALESCE(sm.mark_quiz, 0) as mark_quiz,
                COALESCE(sm.mark_assignment, 0) as mark_assignment,
                COALESCE(sm.mark_mid, 0) as mark_mid,
                COALESCE(u.registerred, 0) as registerred,
                COALESCE(sm.mark_final, 0) as mark_final
            FROM users u
            LEFT JOIN student_marks sm ON 
                u.user_id = sm.student_user_id 
                AND sm.subject_id = ?
            WHERE 
                u.user_type = 'STUDENT'
                AND u.program = ? 
            ORDER BY u.user_id ASC
        `;

        const [students] = await db.execute(query, [subjectId, courseInfo.program_id]);

        return {
            status: "success",
            courseInfo: {
                ...courseInfo,
                formattedSession: sessionString,
                isMarkOpen: String(courseInfo.mark_open) === '1' || courseInfo.mark_open == 1
            },
            students
        };

    } catch (error) {
        console.error("Data Fetch Error:", error);
        return { status: "error", message: "Failed to load class data." };
    }
}

// 2. Save/Update Single Student Mark
export async function saveStudentMark(data) {
    const db = await connectDatabase();
    const {
        studentUserId, subjectId, teacherId,
        sessionId, programId, semester,
        field, value
    } = data;

    const allowedFields = ["mark_attendance", "mark_quiz", "mark_assignment", "mark_mid", "mark_final"];
    if (!allowedFields.includes(field)) {
        return { status: "error", message: "Invalid mark field" };
    }

    try {
        // Enforce mark entry status for this session
        if (sessionId) {
            const [sessRows] = await db.execute("SELECT mark_open FROM sessions WHERE id = ?", [sessionId]);
            if (sessRows.length > 0 && String(sessRows[0].mark_open) === '0') {
                return { status: "error", message: "Mark submission is locked by the Exam Controller." };
            }
        }

        // Check if row exists
        const [existing] = await db.execute(
            "SELECT id FROM student_marks WHERE student_user_id = ? AND subject_id = ?",
            [studentUserId, subjectId]
        );

        if (existing.length > 0) {
            // UPDATE
            await db.execute(
                `UPDATE student_marks SET ${field} = ? WHERE id = ?`,
                [value, existing[0].id]
            );
        } else {
            // INSERT
            await db.execute(`
                INSERT INTO student_marks 
                (student_user_id, session_id, program_id, subject_id, teacher_id, semester, ${field})
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [studentUserId, sessionId, programId, subjectId, teacherId, semester, value]);
        }

        return { status: "success" };

    } catch (error) {
        console.error("Save Error:", error);
        return { status: "error" };
    }
}