"use server";

import { cookies } from "next/headers";

export async function setAuthCookie(gUser) {
    

    if (!gUser) {
        return;
    }
    
    const cookieStore = await cookies();

    cookieStore.set("auth", gUser.authCookie, {
        path: "/",
        httpOnly: true,
        maxAge: 86400 * gUser.expiryDays,
        sameSite: "strict",
    });
}
