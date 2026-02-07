"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export async function getTeacherDashboardData(teacherId) {
    const db = await connectDatabase();

    try {
        // 1. Get the Current Active Session
        const [sessions] = await db.execute(
            "SELECT id, session_year, session_season FROM sessions WHERE status = 'Active' LIMIT 1"
        );

        if (sessions.length === 0) {
            return { status: "error", message: "No active session found.", data: null };
        }

        const activeSession = sessions[0];
        const sessionLabel = `${activeSession.session_season} ${activeSession.session_year}`;

        // 2. Get Assigned Courses for this Teacher in this Session
        const query = `
            SELECT 
                at.id,
                m.program_short_name AS dept,
                at.semester,
                s.subject_code AS code,
                s.id AS subject_id,
                s.subject_name AS title
            FROM assigned_teachers at
            JOIN subjects s ON at.subject_id = s.id
            JOIN majors m ON at.program_id = m.id
            WHERE at.teacher_id = ? AND at.session_id = ?
            ORDER BY at.semester ASC
        `;

        const [courses] = await db.execute(query, [teacherId, activeSession.id]);

        return {
            status: "success",
            sessionLabel,
            courses
        };

    } catch (error) {
        console.error("Dashboard Error:", error);
        return { status: "error", message: "Failed to load dashboard." };
    }
}