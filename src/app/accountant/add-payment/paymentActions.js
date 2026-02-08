"use server";

import { connectDatabase } from "@/app/json/connectDatabase";


export async function getSessionListAction() {
    const db = await connectDatabase();
    try {
        
        
        const [rows] = await db.execute(`
            SELECT CONCAT(session_season, ' ', session_year) as session_name 
            FROM sessions 
            ORDER BY id DESC
        `);
        return { status: "success", data: rows };
    } catch (error) {
        console.error("Session Load Error:", error);
        return { status: "error", data: [] };
    }
}


export async function findStudentForPaymentAction(studentId) {
    const db = await connectDatabase();
    try {
        const query = `
            SELECT 
                u.user_id, u.name, u.email_address, u.phone_number, u.address,
                u.father_name, u.mother_name, u.guardian_phone,
                u.batch, u.section, u.current_semester, u.waiver,
                m.program_name as dept,
                COALESCE(sf.total_due, 0) as currentDue,
                -- Calculate lifetime stats directly from payments table
                (SELECT SUM(amount) FROM payments WHERE student_user_id = u.user_id AND amount > 0) as total_billed,
                (SELECT SUM(amount) FROM payments WHERE student_user_id = u.user_id AND amount < 0) as total_paid
            FROM users u
            LEFT JOIN majors m ON u.program = m.id
            LEFT JOIN student_financials sf ON u.user_id = sf.student_user_id
            WHERE u.user_id = ? AND u.user_type = 'Student'
        `;

        const [rows] = await db.execute(query, [studentId]);

        if (rows.length === 0) {
            return { status: "error", message: "Student not found." };
        }

        
        
        const [sessionRows] = await db.execute("SELECT CONCAT(session_season, ' ', session_year) as current_session FROM sessions ORDER BY id DESC LIMIT 1");
        const globalSession = sessionRows.length > 0 ? sessionRows[0].current_session : "";

        return {
            status: "success",
            data: { ...rows[0], globalSession }
        };

    } catch (error) {
        console.error("Search Error:", error);
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
        console.error("History Error:", error);
        return { status: "error", message: "Failed to load transaction history." };
    }
}


export async function processPaymentAction(formData) {
    const db = await connectDatabase();

    
    const connection = await db.getConnection();

    const studentId = formData.get("studentId");
    const accountantId = formData.get("accountantId");
    const mode = formData.get("mode"); 

    let amount = parseFloat(formData.get("amount"));

    
    if (mode === 'PAYMENT') {
        amount = -Math.abs(amount); 
    } else {
        amount = Math.abs(amount); 
    }

    const session = formData.get("session");
    const semester = formData.get("semester");
    const feeType = formData.get("feeType");
    const paymentMethod = formData.get("paymentMethod") || 'System';
    const trxId = formData.get("trxId");
    const remarks = formData.get("remarks");

    if (!studentId || !amount) {
        connection.release();
        return { status: "error", message: "Invalid amount or student ID." };
    }

    try {
        
        await connection.beginTransaction();
        const dateStr = new Date().toISOString().split('T')[0];

        
        await connection.execute(
            `INSERT INTO payments 
            (student_user_id, session, semester, fee_type, amount, payment_method, trx_id, remarks, payment_date, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [studentId, session, semester, feeType, amount, paymentMethod, trxId, remarks, dateStr, accountantId]
        );

        
        const [finRow] = await connection.execute("SELECT id FROM student_financials WHERE student_user_id = ?", [studentId]);

        if (finRow.length > 0) {
            
            await connection.execute(
                "UPDATE student_financials SET total_due = total_due + ?, last_payment_date = ? WHERE student_user_id = ?",
                [amount, dateStr, studentId]
            );
        } else {
            
            await connection.execute(
                "INSERT INTO student_financials (student_user_id, total_due, last_payment_date) VALUES (?, ?, ?)",
                [studentId, amount, dateStr]
            );
        }

        
        await connection.commit();

        const successMsg = mode === 'PAYMENT' ? "Payment received successfully!" : "Charge added to account successfully!";
        return { status: "success", message: successMsg };

    } catch (error) {
        await connection.rollback(); 
        console.error("Transaction Error:", error);
        return { status: "error", message: "Transaction failed. Please try again." };
    } finally {
        connection.release(); 
    }
}