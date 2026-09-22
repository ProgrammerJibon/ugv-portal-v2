"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

const calculateGradePoint = (totalMarks) => {
    const total = parseFloat(totalMarks || 0);
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

export async function getStudentFullReportAction(studentUserId) {
    const db = await connectDatabase();

    try {
        // 1. Fetch student info
        const [userRows] = await db.execute(`
            SELECT u.id, u.user_id, u.name, u.email_address, u.phone_number,
                   u.program, u.session, u.current_semester, u.batch, u.status,
                   m.program_name, m.program_short_name, m.degree_type,
                   COALESCE(sf.total_due, 0) as current_due
            FROM users u
            LEFT JOIN majors m ON u.program = m.id
            LEFT JOIN student_financials sf ON u.user_id = sf.student_user_id
            WHERE u.user_id = ?
            LIMIT 1
        `, [studentUserId]);

        if (userRows.length === 0) {
            return { status: "error", message: "Student record not found." };
        }

        const student = userRows[0];

        // 2. Fetch all student marks joined with subjects
        const [marksRows] = await db.execute(`
            SELECT 
                sm.semester,
                s.subject_code,
                s.subject_name,
                s.credit,
                sm.mark_attendance,
                sm.mark_quiz,
                sm.mark_assignment,
                sm.mark_mid,
                sm.mark_final
            FROM student_marks sm
            JOIN subjects s ON sm.subject_id = s.id
            WHERE sm.student_user_id = ?
            ORDER BY sm.semester ASC, s.subject_code ASC
        `, [studentUserId]);

        // 3. Group by semester and calculate SGPAs and CGPA
        const semestersData = {};
        let totalAttemptedCredits = 0;
        let totalEarnedCredits = 0;
        let totalQualityPoints = 0;

        marksRows.forEach(row => {
            const sem = row.semester;
            if (!semestersData[sem]) {
                semestersData[sem] = {
                    semester: sem,
                    courses: [],
                    creditsAttempted: 0,
                    creditsEarned: 0,
                    qualityPoints: 0,
                    sgpa: "0.00"
                };
            }

            const totalMark =
                parseFloat(row.mark_attendance || 0) +
                parseFloat(row.mark_quiz || 0) +
                parseFloat(row.mark_assignment || 0) +
                parseFloat(row.mark_mid || 0) +
                parseFloat(row.mark_final || 0);

            const { grade, point } = calculateGradePoint(totalMark);
            const credit = parseFloat(row.credit || 3);

            semestersData[sem].courses.push({
                code: row.subject_code,
                title: row.subject_name,
                credit: credit,
                totalMarks: totalMark,
                grade: grade,
                point: point
            });

            semestersData[sem].creditsAttempted += credit;
            totalAttemptedCredits += credit;

            if (grade !== 'F') {
                semestersData[sem].creditsEarned += credit;
                totalEarnedCredits += credit;
            }

            const pointsForCourse = point * credit;
            semestersData[sem].qualityPoints += pointsForCourse;
            totalQualityPoints += pointsForCourse;
        });

        // Calculate SGPA for each semester
        const semesterList = Object.keys(semestersData).map(sem => {
            const data = semestersData[sem];
            const sgpa = data.creditsAttempted > 0
                ? (data.qualityPoints / data.creditsAttempted).toFixed(2)
                : "0.00";
            return {
                ...data,
                sgpa: sgpa
            };
        });

        // Calculate Cumulative CGPA
        const cgpa = totalAttemptedCredits > 0
            ? (totalQualityPoints / totalAttemptedCredits).toFixed(2)
            : "0.00";

        // Academic standing
        let academicStanding = "Good Standing";
        const numericCgpa = parseFloat(cgpa);
        if (numericCgpa >= 3.75) academicStanding = "Dean's Honor List";
        else if (numericCgpa < 2.00 && totalAttemptedCredits > 0) academicStanding = "Academic Probation";

        return {
            status: "success",
            student: student,
            cgpa: cgpa,
            totalCreditsAttempted: totalAttemptedCredits,
            totalCreditsEarned: totalEarnedCredits,
            academicStanding: academicStanding,
            semesters: semesterList
        };

    } catch (error) {
        console.error("Student Report Error:", error);
        return { status: "error", message: "Failed to generate academic report." };
    }
}
