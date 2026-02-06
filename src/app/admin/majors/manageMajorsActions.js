"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// 1. Fetch All Majors
export async function getMajorsAction() {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute(
            "SELECT * FROM majors ORDER BY id DESC"
        );
        return { status: "success", data: rows };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { status: "error", message: "Failed to fetch majors." };
    }
}

// 2. Update a Major
export async function updateMajorAction(id, degreeType, programName, programShortName) {
    const db = await connectDatabase();

    if (!id || !degreeType || !programName || !programShortName) {
        return { status: "error", message: "All fields are required." };
    }

    try {
        await db.execute(
            "UPDATE majors SET degree_type = ?, program_name = ?, program_short_name = ? WHERE id = ?",
            [degreeType, programName, programShortName, id]
        );
        return { status: "success", message: "Major updated successfully!" };
    } catch (error) {
        console.error("Update Error:", error);
        return { status: "error", message: "Update failed. Please try again." };
    }
}