"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export default async function addMajorAction(formData) {
    const db = await connectDatabase();

    // 1. Extract Data
    const degreeType = formData.get("degreeType");
    const programName = formData.get("programName");
    const programShortName = formData.get("programShortName");

    // 2. Validate
    if (!degreeType || !programName || !programShortName) {
        return { status: "error", message: "All fields are required." };
    }

    try {
        // 3. Check for Duplicates
        const [existing] = await db.execute(
            "SELECT id FROM majors WHERE program_name = ? OR program_short_name = ? LIMIT 1",
            [programName, programShortName]
        );

        if (existing.length > 0) {
            return { status: "error", message: "A program with this name or code already exists." };
        }

        // 4. Insert into Database
        await db.execute(
            "INSERT INTO majors (degree_type, program_name, program_short_name) VALUES (?, ?, ?)",
            [degreeType, programName, programShortName]
        );

        return { status: "success", message: "Program added successfully!" };

    } catch (error) {
        console.error("Database Error:", error);
        return { status: "error", message: "Failed to save program. Please try again." };
    }
}