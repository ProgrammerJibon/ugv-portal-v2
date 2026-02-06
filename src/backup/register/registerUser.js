"use server";

import { connectDatabase } from "@/app/json/connectDatabase";
import fs from "fs";
import path from "path";
import { hash, time, validatePassword } from "../functions";

export async function registerUser(formData) {
    const name = formData.get("name");
    const phone = formData.get("phone");
    const countryShortCode = formData.get("countryShortCode");
    const universityId = formData.get("universityId");
    const studentId = formData.get("studentId");
    const password = formData.get("password");
    const userType = formData.get("userType");
    const image = formData.get("image");

    if (!name || !phone || !countryShortCode || !universityId || !password) {
        return { success: false, error: "Missing required fields" };
    }

    if (userType === "STUDENT" && !studentId) {
        return { success: false, error: "Student ID required" };
    }

    if (!/^01[3-9][0-9]{8}$/.test(phone)) {
        return { success: false, error: "Invalid phone number" };
    }

    if (password.length < 6){
        return { success: false, error: "Password length must be at least 6." };
    }

    if(!validatePassword(password)){
        return { success: false, error: "Password must be combined of at least one caps letter, small letter and number." };
    }

    const db = await connectDatabase();

    try {
        const [exists] = await db.execute(
            "SELECT id FROM users WHERE phone = ? LIMIT 1",
            [phone]
        );

        if (exists.length) {
            return { success: false, error: "Phone already registered" };
        }

        let imagePath = "";
        if (image && image.size > 0) {
            const buffer = Buffer.from(await image.arrayBuffer());
            const uploadDir = path.join(process.cwd(), "public/uploads/users");
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

            const fileName = `${Date.now()}_${image.name}`;
            fs.writeFileSync(path.join(uploadDir, fileName), buffer);
            imagePath = `/uploads/users/${fileName}`;
        }

        if (imagePath == ""){
            return { success: false, error: "Profile Photo Required!" };
        }

        const hashedPassword = hash(password);

        const now = time();

        await db.execute(
            `INSERT INTO users 
            (name, pic, phone, country_short_code, university_id, university_student_id, password, status, req_time, user_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,                                   // name
                imagePath,                             // pic
                phone,                                 // phone
                countryShortCode,                      // country_short_code
                universityId || "N/A",                 // university_id
                userType === "STUDENT" ? studentId : "N/A", // university_student_id
                hashedPassword,                        // password
                userType === "STUDENT" ? "ACTIVE" : "PENDING", // status
                now,                                   // req_time
                userType                               // user_type (ONLY HERE)
            ]
        );



        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: "Server error" };
    } finally {
        db.end();
    }
}
