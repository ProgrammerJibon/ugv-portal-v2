"use server";

import { connectDatabase } from "@/app/json/connectDatabase";

// 1. Fetch all sessions for the dropdown
export async function getExamSessionsAction() {
    const db = await connectDatabase();
    try {
        // Order by year/season so latest is first
        const [rows] = await db.execute(
            "SELECT * FROM sessions ORDER BY session_year DESC, id DESC"
        );
        return { status: "success", data: rows };
    } catch (error) {
        console.error("Fetch Error:", error);
        return { status: "error", message: "Failed to fetch sessions." };
    }
}

// 2. Toggle Mark Entry Status
export async function toggleMarkEntryAction(sessionId, currentStatus) {
    const db = await connectDatabase();

    // Toggle: If 1, becomes 0. If 0, becomes 1.
    const newStatus = currentStatus ? 0 : 1;

    try {
        await db.execute(
            "UPDATE sessions SET mark_open = ? WHERE id = ?",
            [newStatus, sessionId]
        );
        return { status: "success", newStatus, message: `Portal ${newStatus ? 'Opened' : 'Closed'} successfully.` };
    } catch (error) {
        console.error("Update Error:", error);
        return { status: "error", message: "Failed to update portal status." };
    }
}