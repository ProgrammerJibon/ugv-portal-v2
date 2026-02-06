"use server";

import fs from "fs";
import path from "path";
import { connectDatabase } from "../json/connectDatabase";
import { getUserFromAuthCookie } from "../json/serverFunctions";
import { hash, validatePassword } from "../functions";

// Helper to validate phone
const validatePhone = (phone) => {
    const re = /^01[3-9][0-9]{8}$/;
    return re.test(phone);
};

export async function updateBasicInfo(formData) {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return { success: false, error: "Login Required." };
    }
    const user = gUser.user;
    const name = formData.get("name");
    const phone = formData.get("phone");

    if (!name || name.trim() === "") {
        return { success: false, error: "Name cannot be empty." };
    }
    if (!validatePhone(phone)) {
        return { success: false, error: "Invalid phone number format." };
    }

    try {
        const connect = await connectDatabase();
        const sql = "UPDATE users SET name = ?, phone = ? WHERE id = ?";
        const [res] = await connect.execute(sql, [name, phone, user?.id]);

        if (res.affectedRows > 0) {
            return { success: true, message: "Profile details updated." };
        }
        return { success: false, error: "No changes made." };
    } catch (error) {
        console.error("Update Info Error:", error);
        return { success: false, error: "Database error occurred." };
    }
}

export async function updatePassword(formData) {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return { success: false, error: "Login Required." };
    }
    const user = gUser.user;
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
        return { success: false, error: "Passwords do not match." };
    }
    if (password.length < 6) {
        return { success: false, error: "Password must be at least 6 characters." };
    }
    if (!validatePassword(password)){
        return { success: false, error: "Password must be combined of at least one caps letter, small letter and number." };
    }

    // In a real app, hash the password here using bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10); 
    const finalPassword = hash( password ); // Using plain text as per prompt implication, but heavily suggest hashing

    try {
        const connect = await connectDatabase();
        const sql = "UPDATE users SET password = ? WHERE id = ?";
        const [res] = await connect.execute(sql, [finalPassword, user?.id]);

        if (res.affectedRows > 0) {
            return { success: true, message: "Password updated successfully." };
        }
        return { success: false, error: "Failed to update password." };
    } catch (error) {
        console.error("Update Password Error:", error);
        return { success: false, error: "Database error occurred." };
    }
}

export async function updateProfilePic(formData) {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return { success: false, error: "Login Required." };
    }
    const user = gUser.user;
    const image = formData.get("image");

    if (!image || image.size === 0) return { success: false, error: "No image provided" };

    try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const uploadDir = path.join(process.cwd(), "public/uploads/users");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const fileName = `${Date.now()}_${image.name}`;
        fs.writeFileSync(path.join(uploadDir, fileName), buffer);
        const imageUrl = `/uploads/users/${fileName}`;

        const db = await connectDatabase();
        const [res] = await db.execute("UPDATE users SET pic = ? WHERE id = ?", [imageUrl, user?.id]);

        return res.affectedRows > 0
            ? { success: true, message: "Profile picture updated", url: imageUrl }
            : { success: false, error: "Failed to update picture" };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Server error while uploading image" };
    }
}




export async function updateEmail(formData) {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return { success: false, error: "Login Required." };
    }
    const user = gUser.user;
    const email = formData.get("email");

    if (!email || email.trim() === "") {
        return { success: false, error: "Email cannot be empty." };
    }

    try {
        const connect = await connectDatabase();
        const sql = "UPDATE users SET email = ? WHERE id = ?";
        const [res] = await connect.execute(sql, [email, user?.id]);

        if (res.affectedRows > 0) {
            return { success: true, message: "Email updated." };
        }
        return { success: false, error: "No changes made." };
    } catch (error) {
        console.error("Update Info Error:", error);
        return { success: false, error: "Database error occurred." };
    }
}