"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export async function getStudentPaymentDataAction(studentId) {
    const db = await connectDatabase();
    try {
        // A. Overall Current Balance (Source of Truth)
        const [finRows] = await db.execute(
            "SELECT total_due FROM student_financials WHERE student_user_id = ?",
            [studentId]
        );
        const overallBalance = finRows.length > 0 ? parseFloat(finRows[0].total_due) : 0;

        // B. Fetch Full History (For client-side filtering)
        const [historyRows] = await db.execute(
            "SELECT * FROM payments WHERE student_user_id = ? ORDER BY id DESC",
            [studentId]
        );

        // C. [NEW] Aggregate Stats by Semester
        // This calculates Billed vs Paid per semester
        const [semStats] = await db.execute(`
            SELECT 
                semester,
                SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as total_paid,
                SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_billed
            FROM payments 
            WHERE student_user_id = ? 
            GROUP BY semester
        `, [studentId]);

        // D. Lifetime Stats
        const [lifetimeStats] = await db.execute(`
            SELECT 
                SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) as total_paid,
                SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) as total_invoiced
            FROM payments WHERE student_user_id = ?
        `, [studentId]);

        return {
            status: "success",
            balance: overallBalance,
            history: historyRows,
            lifetime: lifetimeStats[0],
            semesterSummary: semStats
        };

    } catch (error) {
        console.error("Student Payment Load Error:", error);
        return { status: "error", message: "Failed to load payment data." };
    }
}