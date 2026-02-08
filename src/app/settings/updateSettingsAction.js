"use server";

import { connectDatabase } from "@/app/json/connectDatabase";
import { hash } from "../functions"; // Assuming you have a hash function (e.g., MD5 or bcrypt)

export async function updateSettingsAction(formData) {
    const db = await connectDatabase();

    const userId = formData.get("userId");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const password = formData.get("password");

    if (!userId) return { status: "error", message: "User not identified." };

    try {
        const updates = [];
        const values = [];

        // 1. Standard Updates
        updates.push("email_address = ?");
        values.push(email);

        updates.push("phone_number = ?");
        values.push(phone);

        updates.push("address = ?");
        values.push(address);

        // 2. Password Update (Only if provided)
        if (password && password.trim() !== "") {
            const hashedPassword = hash(password); // Use your existing hash function
            updates.push("password = ?");
            values.push(hashedPassword);
        }

        // 3. Execute Update
        values.push(userId); // For WHERE clause

        const query = `UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`;

        await db.execute(query, values);

        return { status: "success", message: "Profile updated successfully!" };

    } catch (error) {
        console.error("Settings Update Error:", error);
        return { status: "error", message: "Failed to update profile." };
    }
}