"use server";

import { connectDatabase } from "@/app/json/connectDatabase";


export async function findStudentForPaymentAction(studentId) {
    const db = await connectDatabase();
    try {
        const query = `
            SELECT 
                u.user_id, u.name, u.batch, 
                m.program_short_name as dept,
                COALESCE(sf.total_due, 0) as currentDue
            FROM users u
            LEFT JOIN majors m ON u.program = m.id
            LEFT JOIN student_financials sf ON u.user_id = sf.student_user_id
            WHERE u.user_id = ? AND u.user_type = 'Student'
        `;
        const [rows] = await db.execute(query, [studentId]);
        if (rows.length === 0) return { status: "error", message: "Student not found." };
        return { status: "success", data: rows[0] };
    } catch (error) {
        return { status: "error", message: "Database search failed." };
    }
}


export async function getPaymentHistoryAction(studentId) {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute(
            "SELECT * FROM payments WHERE student_user_id = ? ORDER BY id DESC",
            [studentId]
        );
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to load history." };
    }
}


export async function processPaymentAction(formData) {
    const db = await connectDatabase();
    
    const connection = await db.getConnection(); 

    const studentId = formData.get("studentId");
    const accountantId = formData.get("accountantId");
    const amount = parseFloat(formData.get("amount"));
    const session = formData.get("session");
    const feeType = formData.get("feeType");
    const paymentMethod = formData.get("paymentMethod");
    const trxId = formData.get("trxId");
    const remarks = formData.get("remarks");

    if (!studentId || !amount || amount <= 0) {
        connection.release();
        return { status: "error", message: "Invalid amount." };
    }

    try {
        await connection.beginTransaction();
        const dateStr = new Date().toISOString().split('T')[0];

        
        await connection.execute(
            `INSERT INTO payments (student_user_id, session, fee_type, amount, payment_method, trx_id, remarks, payment_date, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [studentId, session, feeType, amount, paymentMethod, trxId, remarks, dateStr, accountantId]
        );

        
        const [finRow] = await connection.execute("SELECT id FROM student_financials WHERE student_user_id = ?", [studentId]);
        if (finRow.length > 0) {
            await connection.execute("UPDATE student_financials SET total_due = total_due - ?, last_payment_date = ? WHERE student_user_id = ?", [amount, dateStr, studentId]);
        } else {
            await connection.execute("INSERT INTO student_financials (student_user_id, total_due, last_payment_date) VALUES (?, ?, ?)", [studentId, -amount, dateStr]);
        }

        await connection.commit();
        return { status: "success", message: "Payment processed!" };
    } catch (error) {
        await connection.rollback();
        console.error(error);
        return { status: "error", message: "Transaction failed." };
    } finally {
        connection.release();
    }
}