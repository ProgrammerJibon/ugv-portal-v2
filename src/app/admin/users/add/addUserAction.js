"use server";

import { hash } from "@/app/functions";
import { connectDatabase } from "@/app/json/connectDatabase";

export default async function addUserAction(formData) {
    const db = await connectDatabase();

    // 1. Extract Data
    const name = formData.get("name");
    const user_type = formData.get("user_type"); // Teacher, Accountant, Admission
    const email_address = formData.get("email_address");
    const phone_number = formData.get("phone_number");
    const joining_date = formData.get("joining_date");
    const user_id = formData.get("user_id");
    const password = formData.get("password");

    // Optional fields based on role
    let faculty_id = formData.get("faculty_id") || "N/A";
    let designation = formData.get("designation");

    // 2. Validate Required Fields
    if (!name || !email_address || !phone_number || !joining_date || !user_id || !password) {
        return { status: "error", message: "Please fill in all required fields." };
    }

    // 3. Check for Duplicate User ID or Email
    const [existing] = await db.execute(
        "SELECT id FROM users WHERE user_id = ? OR email_address = ? OR phone_number = ? LIMIT 1",
        [user_id, email_address, phone_number]
    );

    if (existing.length > 0) {
        return { status: "error", message: "User ID or Email already exists!" };
    }

    // 4. Hash Password
    const hashedPassword = hash(password);

    // 5. Insert into Database
    try {
        await db.execute(
            `INSERT INTO users 
            (name, user_type, email_address, phone_number, faculty_id, designation, user_id, password, joining_date, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active')`,
            [name, user_type, email_address, phone_number, faculty_id, designation, user_id, hashedPassword, joining_date]
        );

        return { status: "success", message: "User registered successfully!" };
    } catch (error) {
        console.error("Database Error:", error);
        return { status: "error", message: "Database error. Please try again." };
    }
}