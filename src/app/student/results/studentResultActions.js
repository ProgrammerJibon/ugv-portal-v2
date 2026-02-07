"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// Fetch Student Results
export async function getStudentResultsAction(studentUserId) {
    const db = await connectDatabase();

    try {
        // 1. Fetch Basic Student Info
        const [studentRows] = await db.execute(`
            SELECT u.name, u.user_id, u.program, u.batch, m.program_name 
            FROM users u
            JOIN majors m ON u.program = m.id
            WHERE u.user_id = ?
        `, [studentUserId]);

        if (studentRows.length === 0) {
            return { status: "error", message: "Student not found." };
        }
        const studentInfo = studentRows[0];

        // 2. Fetch Marks joined with Subjects
        // We fetch ALL marks for this student
        const query = `
            SELECT 
                sm.semester,
                s.subject_code, s.subject_name, s.credit,
                sm.mark_attendance, sm.mark_quiz, sm.mark_assignment, sm.mark_mid, sm.mark_final
            FROM student_marks sm
            JOIN subjects s ON sm.subject_id = s.id
            WHERE sm.student_user_id = ?
            ORDER BY sm.semester ASC, s.subject_code ASC
        `;

        const [marksRows] = await db.execute(query, [studentUserId]);

        // 3. Process Data Grouped by Semester
        const resultsDB = {};

        marksRows.forEach(row => {
            const sem = row.semester; // e.g. "1st", "2nd"
            if (!resultsDB[sem]) {
                resultsDB[sem] = {
                    subjects: [],
                    totalCredits: 0,
                    totalPoints: 0
                };
            }

            // Calculate Total Marks & Grade
            const totalMarks =
                parseFloat(row.mark_attendance) +
                parseFloat(row.mark_quiz) +
                parseFloat(row.mark_assignment) +
                parseFloat(row.mark_mid) +
                parseFloat(row.mark_final);

            const { grade, point } = calculateGrade(totalMarks);
            const credit = parseFloat(row.credit);

            // Add to Semester Data
            resultsDB[sem].subjects.push({
                code: row.subject_code,
                title: row.subject_name,
                credit: credit,
                grade: grade,
                point: point
            });

            // Accumulate for SGPA
            resultsDB[sem].totalCredits += credit;
            resultsDB[sem].totalPoints += (point * credit);
        });

        // 4. Finalize SGPA per Semester
        Object.keys(resultsDB).forEach(sem => {
            const data = resultsDB[sem];
            const sgpa = data.totalCredits > 0 ? (data.totalPoints / data.totalCredits).toFixed(2) : "0.00";

            // Determine Status based on F grades
            const hasFail = data.subjects.some(s => s.grade === 'F');

            resultsDB[sem] = {
                sgpa: sgpa,
                credits: data.totalCredits,
                status: hasFail ? "Failed" : "Passed",
                subjects: data.subjects
            };
        });

        return {
            status: "success",
            student: {
                name: studentInfo.name,
                id: studentInfo.user_id,
                program: studentInfo.program_name,
                batch: studentInfo.batch
            },
            results: resultsDB
        };

    } catch (error) {
        console.error("Result Fetch Error:", error);
        return { status: "error", message: "Failed to load results." };
    }
}

// Helper (Duplicate logic for backend consistency)
const calculateGrade = (total) => {
    if (total >= 80) return { grade: 'A+', point: 4.00 };
    if (total >= 75) return { grade: 'A', point: 3.75 };
    if (total >= 70) return { grade: 'A-', point: 3.50 };
    if (total >= 65) return { grade: 'B+', point: 3.25 };
    if (total >= 60) return { grade: 'B', point: 3.00 };
    if (total >= 55) return { grade: 'B-', point: 2.75 };
    if (total >= 50) return { grade: 'C+', point: 2.50 };
    if (total >= 45) return { grade: 'C', point: 2.25 };
    if (total >= 40) return { grade: 'D', point: 2.00 };
    return { grade: 'F', point: 0.00 };
};