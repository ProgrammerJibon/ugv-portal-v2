"use server";

import md5 from "md5";
import { connectDatabase } from "@/app/json/connectDatabase";
import { headers, cookies } from "next/headers";
import { hash } from "../functions";

export default async function loginAction({ userId, password }) {
    
    if (!userId || !password) {
        return { status: "error", errors: { credentials: "Missing credentials" } };
    }

    const db = await connectDatabase();
    const h = await headers();
    const cookieStore = await cookies();

    
    const hashedPassword = hash(password);

    
    
    
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE (user_id=? OR email_address=? OR phone_number=?) AND password=? LIMIT 1",
        [userId, userId, userId, hashedPassword]
    );

    
    if (!rows.length) {
        return { status: "error", errors: { credentials: "Invalid User ID or Password "} };
    }

    const user = rows[0];

    
    

    
    
    const cookieValue = md5(user.id + "%" + Date.now());
    const t = Math.floor(Date.now() / 1000);
    const expiryDays = 30;

    
    await db.execute(
        "INSERT INTO cookies (cookie, user_id, time, ip, user_agent, status, expiry) VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)",
        [
            cookieValue,
            user.id, 
            t,
            h.get("x-forwarded-for") || "0.0.0.0",
            h.get("user-agent") || "",
            t + 86400 * expiryDays
        ]
    );

    
    cookieStore.set("auth", cookieValue, {
        httpOnly: true,
        path: "/",
        maxAge: 86400 * expiryDays,
        sameSite: "strict"
    });

    return { status: "success" };
}