"use server";

import { connectDatabase } from "@/app/json/connectDatabase";
import { hash } from "../functions";

export async function updateSettingsAction(formData) {
    const db = await connectDatabase();

    const userId = formData.get("userId");
    const id = formData.get("id");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const password = formData.get("password");

    if (!userId && !id) return { status: "error", message: "User not identified." };

    try {
        const updates = [];
        const values = [];

        // 1. Standard Updates
        updates.push("email_address = ?");
        values.push(email || "");

        updates.push("phone_number = ?");
        values.push(phone || "");

        updates.push("address = ?");
        values.push(address || "");

        // 2. Password Update (Only if provided)
        if (password && password.trim() !== "") {
            const hashedPassword = hash(password);
            updates.push("password = ?");
            values.push(hashedPassword);
        }

        // 3. Execute Update
        let query = "";
        if (userId && id) {
            query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ? OR id = ?`;
            values.push(userId, id);
        } else if (userId) {
            query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;
            values.push(userId);
        } else {
            query = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
            values.push(id);
        }

        await db.execute(query, values);

        return { status: "success", message: "Profile updated successfully!" };

    } catch (error) {
        console.error("Settings Update Error:", error);
        return { status: "error", message: "Failed to update profile." };
    }
}