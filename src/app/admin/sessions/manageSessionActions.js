"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// 1. Fetch all sessions
export async function getSessionsAction() {
    const db = await connectDatabase();
    try {
        // Ordering by ID DESC to show newest first
        const [rows] = await db.execute(
            "SELECT * FROM sessions ORDER BY session_year DESC, id DESC"
        );
        return { status: "success", data: rows };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { status: "error", message: "Failed to fetch sessions." };
    }
}

// 2. Set a session as ACTIVE
export async function setActiveSessionAction(sessionId) {
    const db = await connectDatabase();

    if (!sessionId) {
        return { status: "error", message: "Invalid Session ID." };
    }

    try {
        // Step 1: Mark currently active session as 'Completed'
        await db.execute(
            "UPDATE sessions SET status = 'Completed' WHERE status = 'Active'"
        );

        // Step 2: Set the selected session to 'Active'
        await db.execute(
            "UPDATE sessions SET status = 'Active' WHERE id = ?",
            [sessionId]
        );

        return { status: "success", message: "Session activated successfully!" };
    } catch (error) {
        console.error("Update Error:", error);
        return { status: "error", message: "Failed to update session status." };
    }
}

// 3. Delete a session (Optional utility)
export async function deleteSessionAction(sessionId) {
    const db = await connectDatabase();
    try {
        await db.execute("DELETE FROM sessions WHERE id = ?", [sessionId]);
        return { status: "success", message: "Session deleted." };
    } catch (error) {
        return { status: "error", message: "Cannot delete active session or database error." };
    }
}