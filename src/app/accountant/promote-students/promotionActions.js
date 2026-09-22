"use server";

import { connectDatabase } from "@/app/json/connectDatabase";


export async function getPromotionOptionsAction() {
    const db = await connectDatabase();
    try {
        
        const [majors] = await db.execute("SELECT id, program_name FROM majors ORDER BY program_name ASC");

        
        
        const [sessionRows] = await db.execute(`
            SELECT CONCAT(session_season, ' ', session_year) as session_name 
            FROM sessions 
            ORDER BY id DESC LIMIT 1
        `);

        const currentSession = sessionRows.length > 0 ? sessionRows[0].session_name : "Fall 2026";

        return {
            status: "success",
            majors: majors,
            currentSession: currentSession
        };

    } catch (error) {
        console.error("Metadata Error:", error);
        return { status: "error", majors: [], currentSession: "" };
    }
}


export async function getPromotableStudentsAction(filters) {
    const db = await connectDatabase();
    const { department, currentSemester, targetSession } = filters;

    try {
        const query = `
            SELECT 
                u.current_semester,
                u.id, 
                u.user_id, 
                u.name, 
                u.semester_fee,
                COALESCE(sf.total_due, 0) as due
            FROM users u
            LEFT JOIN student_financials sf ON u.user_id = sf.student_user_id
            WHERE 
                LOWER(u.user_type) = 'student'
                AND u.program = ? 
                AND (u.current_semester = ? OR (? = '0' AND (u.current_semester IS NULL OR u.current_semester = '0' OR u.current_semester = '')))
                AND (u.last_promoted_session IS NULL OR u.last_promoted_session != ?)
            ORDER BY u.user_id ASC
        `;

        const [rows] = await db.execute(query, [department, currentSemester, currentSemester, targetSession]);
        return { status: "success", data: rows };

    } catch (error) {
        console.error("Fetch Error:", error);
        return { status: "error", message: "Failed to load students." };
    }
}



export async function promoteStudentsAction(studentIds, targetSession, adminId) {
    const db = await connectDatabase();
    const connection = await db.getConnection();

    if (!studentIds || studentIds.length === 0) {
        connection.release();
        return { status: "error", message: "No students selected." };
    }

    try {
        await connection.beginTransaction();
        const dateStr = new Date().toISOString().split('T')[0];

        for (const dbId of studentIds) {
            
            const [userRows] = await connection.execute("SELECT user_id, semester_fee, current_semester FROM users WHERE id = ?", [dbId]);
            if (userRows.length === 0) continue;

            const student = userRows[0];
            const userId = student.user_id;

            
            const currentSem = parseInt(student.current_semester || "0");
            const nextSem = currentSem + 1;

            
            const feesToApply = [
                { name: 'Semester Admission Fee', amount: parseFloat(student.semester_fee || 0) },
                { name: 'Mid Exam Fee', amount: 1000 },
                { name: 'Final Exam Fee', amount: 2000 }
            ];

            let totalPayable = 0;

            
            for (const fee of feesToApply) {
                if (fee.amount > 0) {
                    await connection.execute(
                        `INSERT INTO payments 
                        (student_user_id, session, semester, fee_type, amount, payment_method, remarks, payment_date, created_by)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                        [
                            userId,
                            targetSession,
                            nextSem.toString(),
                            fee.name,
                            fee.amount,
                            'System',
                            `Promoted to Sem ${nextSem}`,
                            dateStr,
                            adminId || 1
                        ]
                    );
                    totalPayable += fee.amount;
                }
            }

            
            const [finRow] = await connection.execute("SELECT id FROM student_financials WHERE student_user_id = ?", [userId]);
            if (finRow.length > 0) {
                await connection.execute("UPDATE student_financials SET total_due = total_due + ? WHERE student_user_id = ?", [totalPayable, userId]);
            } else {
                await connection.execute("INSERT INTO student_financials (student_user_id, total_due, last_payment_date) VALUES (?, ?, ?)", [userId, totalPayable, dateStr]);
            }

            
            await connection.execute(
                "UPDATE users SET current_semester = ?, last_promoted_session = ? WHERE id = ?",
                [nextSem.toString(), targetSession, dbId]
            );
        }

        await connection.commit();
        return { status: "success", message: `Promoted ${studentIds.length} students successfully.` };

    } catch (error) {
        await connection.rollback();
        console.error("Promotion Error:", error);
        return { status: "error", message: "Promotion failed due to database error." };
    } finally {
        connection.release();
    }
}