"use server";

import { hash } from "@/app/functions";
import { connectDatabase } from "@/app/json/connectDatabase";

// Action 1: Fetch all users
export async function getUsersAction() {
    const db = await connectDatabase();
    try {
        const [rows] = await db.execute(
            "SELECT id, name, user_type, user_id, email_address, phone_number, status, joining_date FROM users ORDER BY id DESC"
        );
        return { status: "success", data: rows };
    } catch (error) {
        return { status: "error", message: "Failed to fetch users" };
    }
}

// Action 2: Toggle Account Status (Active/Deactive)
export async function toggleUserStatusAction(dbId, currentStatus) {
    const db = await connectDatabase();
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
        await db.execute("UPDATE users SET status = ? WHERE id = ?", [newStatus?.toUpperCase(), dbId]);
        return { status: "success", newStatus, message: `User marked as ${newStatus}` };
    } catch (error) {
        return { status: "error", message: "Database update failed" };
    }
}

// Action 3: Reset Password to Default
export async function resetPasswordAction(dbId) {
    const db = await connectDatabase();
    const defaultPass = "Welcome@2026";
    const hashedPassword = hash(defaultPass);

    try {
        await db.execute("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, dbId]);
        return { status: "success", message: `Password reset to '${defaultPass}'` };
    } catch (error) {
        return { status: "error", message: "Password reset failed" };
    }
}