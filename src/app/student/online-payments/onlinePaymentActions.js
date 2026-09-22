"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export async function processOnlinePaymentAction(paymentData) {
    const db = await connectDatabase();
    const connection = await db.getConnection();

    const {
        studentId,
        amount: rawAmount,
        paymentMethod = "bKash",
        trxId: inputTrxId,
        session = "Active Session",
        semester = "1"
    } = paymentData;

    const amountNum = parseFloat(rawAmount);

    if (!studentId || isNaN(amountNum) || amountNum <= 0) {
        connection.release();
        return { status: "error", message: "Invalid student ID or payment amount." };
    }

    // Generate verified transaction reference if not provided
    const trxId = inputTrxId || `TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const dateStr = new Date().toISOString().split("T")[0];

    try {
        await connection.beginTransaction();

        // Payments table records student credit/payment as negative amount
        const paymentAmount = -Math.abs(amountNum);

        // 1. Insert transaction into payments table
        await connection.execute(
            `INSERT INTO payments 
            (student_user_id, session, semester, fee_type, amount, payment_method, trx_id, remarks, payment_date, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                studentId,
                session,
                semester.toString(),
                "Online Tuition Payment",
                paymentAmount.toString(),
                paymentMethod,
                trxId,
                `Online Payment via ${paymentMethod}`,
                dateStr,
                studentId
            ]
        );

        // 2. Update student financials (reduce total due)
        const [finRow] = await connection.execute(
            "SELECT id, total_due FROM student_financials WHERE student_user_id = ?",
            [studentId]
        );

        if (finRow.length > 0) {
            await connection.execute(
                "UPDATE student_financials SET total_due = total_due - ?, last_payment_date = ? WHERE student_user_id = ?",
                [amountNum, dateStr, studentId]
            );
        } else {
            await connection.execute(
                "INSERT INTO student_financials (student_user_id, total_due, last_payment_date) VALUES (?, ?, ?)",
                [studentId, (-amountNum).toString(), dateStr]
            );
        }

        await connection.commit();

        return {
            status: "success",
            message: "Payment completed successfully! Your account ledger has been updated.",
            trxId: trxId,
            amount: amountNum,
            date: dateStr,
            method: paymentMethod
        };

    } catch (error) {
        await connection.rollback();
        console.error("Online Payment Error:", error);
        return { status: "error", message: "Transaction failed. Please try again or contact accounts." };
    } finally {
        connection.release();
    }
}
