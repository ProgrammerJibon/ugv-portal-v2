"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export async function verifyStudentAction(studentId) {
    if (!studentId) {
        return { status: "error", message: "Please enter a Student ID." };
    }

    const db = await connectDatabase();

    try {
        // Fetch public student details (Name, Dept, Batch)
        // We join with 'majors' table to get the full program name if available
        const query = `
            SELECT 
                u.name, 
                u.user_id, 
                u.batch, 
                COALESCE(m.program_name, u.program) as department
            FROM users u
            LEFT JOIN majors m ON u.program = m.id
            WHERE u.user_id = ? AND u.user_type = 'Student'
            LIMIT 1
        `;

        const [rows] = await db.execute(query, [studentId]);

        if (rows.length === 0) {
            return { status: "error", message: "Invalid Student ID. No record found." };
        }

        return { status: "success", data: rows[0] };

    } catch (error) {
        console.error("Verification Error:", error);
        return { status: "error", message: "System error during verification." };
    }
}