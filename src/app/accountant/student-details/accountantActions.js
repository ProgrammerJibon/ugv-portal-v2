"use server";

import { connectDatabase } from "@/app/json/connectDatabase";


export async function getStudentFinancialsAction() {
    const db = await connectDatabase();
    try {
        const query = `
            SELECT 
                u.user_id as id, 
                u.name, 
                u.status as account_status, 
                u.registerred, -- [NEW] Fetch registration status
                m.program_short_name as dept,
                u.current_semester,
                COALESCE(sf.total_due, 0) as balance
            FROM users u
            LEFT JOIN majors m ON u.program = m.id
            LEFT JOIN student_financials sf ON u.user_id = sf.student_user_id
            WHERE u.user_type = 'Student'
            ORDER BY u.id DESC
        `;

        const [rows] = await db.execute(query);
        return { status: "success", data: rows };

    } catch (error) {
        console.error("Financial Data Error:", error);
        return { status: "error", message: "Failed to load student records." };
    }
}


export async function toggleStudentStatusAction(studentId, newStatus) {
    const db = await connectDatabase();
    try {
        await db.execute("UPDATE users SET status = ? WHERE user_id = ?", [newStatus, studentId]);
        return { status: "success", message: `Student status updated to ${newStatus}` };
    } catch (error) {
        return { status: "error", message: "Update failed." };
    }
}


export async function registerStudentAction(studentId) {
    const db = await connectDatabase();
    try {
        
        await db.execute("UPDATE users SET registerred = '1' WHERE user_id = ?", [studentId]);
        return { status: "success", message: "Student semester registration complete." };
    } catch (error) {
        console.error("Registration Error:", error);
        return { status: "error", message: "Registration failed." };
    }
}