"use server";

import { connectDatabase } from "../json/connectDatabase";
import { google } from "googleapis";

export async function connectGoogle(userId, token) {
    try {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({ access_token: token });

        const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
        const { data } = await oauth2.userinfo.get();
        const email = data.email;

        if (!email) return { success: false, error: "Email not found" };

        const db = await connectDatabase();
        const [res] = await db.execute("UPDATE users SET email = ? WHERE id = ?", [email, userId]);
        return res.affectedRows > 0 ? { success: true, email } : { success: false, error: "Failed to update email" };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Google connection failed" };
    }
}
