"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

export default async function addSessionAction(formData) {
    const db = await connectDatabase();

    const sessionYear = formData.get("sessionYear");
    const sessionSeason = formData.get("sessionSeason");
    const shortCode = formData.get("shortCode");

    if (!sessionYear || !sessionSeason || !shortCode) {
        return { status: "error", message: "All fields are required." };
    }

    try {
        // Check for duplicates
        const [existing] = await db.execute(
            "SELECT id FROM sessions WHERE session_year = ? AND session_season = ? LIMIT 1",
            [sessionYear, sessionSeason]
        );

        if (existing.length > 0) {
            return { status: "error", message: `Session ${sessionSeason} ${sessionYear} already exists.` };
        }

        // Insert
        await db.execute(
            "INSERT INTO sessions (session_year, session_season, short_code, status) VALUES (?, ?, ?, 'Upcoming')",
            [sessionYear, sessionSeason, shortCode]
        );

        return { status: "success", message: "Session created successfully!" };

    } catch (error) {
        console.error("Database Error:", error);
        return { status: "error", message: "Failed to create session." };
    }
}