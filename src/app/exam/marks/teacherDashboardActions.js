"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export async function getTeacherDashboardData(examUserId, selectedSessionId = null) {
    const db = await connectDatabase();

    try {
        // 1. Fetch All Sessions for Filter
        const [allSessions] = await db.execute(
            "SELECT id, session_year, session_season, status, mark_open FROM sessions ORDER BY session_year DESC, id DESC"
        );

        if (allSessions.length === 0) {
            return { status: "error", message: "No academic sessions found in system.", data: null };
        }

        // 2. Determine target session
        let targetSession = null;
        if (selectedSessionId) {
            targetSession = allSessions.find(s => String(s.id) === String(selectedSessionId));
        }
        if (!targetSession) {
            targetSession = allSessions.find(s => s.status === 'ACTIVE') || allSessions[0];
        }

        const sessionLabel = `${targetSession.session_season} ${targetSession.session_year}`;

        // 3. Get Assigned Courses for this Session with Teacher and Submission Stats
        const query = `
            SELECT 
                at.id,
                m.program_short_name AS dept,
                at.semester,
                s.subject_code AS code,
                s.id AS subject_id,
                s.subject_name AS title,
                COALESCE(u.name, 'Unassigned') AS teacher_name,
                COALESCE(u.faculty_id, u.user_id, '') AS teacher_code,
                (SELECT COUNT(DISTINCT sm.student_user_id) FROM student_marks sm WHERE sm.subject_id = s.id) AS marks_entered_count
            FROM assigned_teachers at
            JOIN subjects s ON at.subject_id = s.id
            JOIN majors m ON at.program_id = m.id
            LEFT JOIN users u ON at.teacher_id = u.id
            WHERE at.session_id = ?
            ORDER BY m.program_short_name ASC, at.semester ASC
        `;

        const [courses] = await db.execute(query, [targetSession.id]);

        return {
            status: "success",
            sessionLabel,
            selectedSessionId: targetSession.id,
            sessions: allSessions,
            courses
        };

    } catch (error) {
        console.error("Exam Dashboard Error:", error);
        return { status: "error", message: "Failed to load exam marks dashboard." };
    }
}