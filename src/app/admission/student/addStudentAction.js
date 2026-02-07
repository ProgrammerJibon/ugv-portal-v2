"use server";

import { hash } from "@/app/functions";
import { connectDatabase } from "@/app/json/connectDatabase";


export async function getAdmissionDropdowns() {
    const db = await connectDatabase();
    try {
        const [programs] = await db.execute("SELECT id, program_name, program_short_name FROM majors ORDER BY program_name ASC");
        const [sessions] = await db.execute("SELECT id, session_year, session_season FROM sessions WHERE status IN ('Active', 'Upcoming') ORDER BY id DESC");
        return { status: "success", programs, sessions };
    } catch (error) {
        return { status: "error", message: "Failed to load dropdown data" };
    }
}


export async function addStudentAction(formData) {
    const db = await connectDatabase();

    const name = formData.get("fullName");
    const programId = formData.get("program"); 
    const sessionString = formData.get("session"); 
    const programType = formData.get("programType"); 
    const section = formData.get("section");

    
    if (!name || !programId || !sessionString || !programType) {
        return { status: "error", message: "Missing required fields." };
    }

    try {
        

        
        const deptDigit = programId.toString().charAt(0);

        
        
        const [seasonName, yearFull] = sessionString.split(' ');
        const yearDigit = yearFull.slice(-2);

        
        let seasonDigit = '1';
        const lowerSeason = seasonName.toLowerCase();
        if (lowerSeason.includes('summer') || lowerSeason.includes('fall')) {
            seasonDigit = '2';
        } else {
            seasonDigit = '1'; 
        }

        
        const typeDigit = programType === 'Evening' ? '2' : '1';

        
        
        const idPrefix = `${deptDigit}${yearDigit}${seasonDigit}${typeDigit}`;

        
        
        const [lastEntry] = await db.execute(
            "SELECT user_id FROM users WHERE user_id LIKE ? ORDER BY user_id DESC LIMIT 1",
            [`${idPrefix}%`]
        );

        let newSerial = '001';
        if (lastEntry.length > 0) {
            
            const lastId = lastEntry[0].user_id;
            const currentSerial = parseInt(lastId.slice(-3));
            newSerial = (currentSerial + 1).toString().padStart(3, '0');
        }

        const generatedUserId = `${idPrefix}${newSerial}`;
        const password = "123456";

        

        const query = `
            INSERT INTO users (
                user_type, user_id, password, name, 
                date_of_birth, gender, blood_group, religion, 
                program, session, program_type, section,
                email_address, phone_number, address, student_nid,
                father_name, mother_name, guardian_phone, guardian_nid,
                faculty_id, designation, joining_date, status
            ) VALUES (
                'Student', ?, ?, ?, 
                ?, ?, ?, ?, 
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                '', '', '', 'ACTIVE'
            )
        `;

        const values = [
            generatedUserId, hash(password), name,
            formData.get("dateOfBirth"), formData.get("gender"), formData.get("bloodGroup"), formData.get("religion"),
            programId, sessionString, programType, section,
            formData.get("email"), formData.get("phone"), formData.get("address"), formData.get("studentNid"),
            formData.get("fatherName"), formData.get("motherName"), formData.get("guardianPhone"), formData.get("guardianNid")
        ];

        await db.execute(query, values);

        return { status: "success", message: `Admission Successful! Generated ID: ${generatedUserId} and Password: ${password}` };

    } catch (error) {
        console.error("Database Error:", error);
        return { status: "error", message: "Failed to register student." };
    }
}