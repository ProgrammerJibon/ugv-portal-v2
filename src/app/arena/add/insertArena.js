"use server"

import { time } from "@/app/functions";
import { connectDatabase } from "@/app/json/connectDatabase";
import { getUserFromAuthCookie } from "@/app/json/serverFunctions"

export default async function insertArena(data) {

    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return { error: "Unauthorized" };
    }

    const user = gUser.user;
    if (user.user_type != "TEACHER" && user.user_type != "ADMIN") {
        return { error: "Unauthorized" };
    }
    // user.university_id get university details
    const connect = await connectDatabase();
    const sql1 = "SELECT * FROM university_list WHERE id = ? LIMIT 1";
    const [rows1] = await connect.execute(sql1, [user.university_id]);

    if (rows1.length === 0) {
        return { error: "University not found" };
    }

    const university = rows1[0];
    const now = time();

    if ("id" in university) {
        const insertSql = `INSERT INTO arena_list 
        (name, created_by, created_on, country_code, university_id, batch_no, pricing, payment_method, payment_acount_number, status, comment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        try {
            const [result] = await connect.execute(insertSql, [
                data.name,
                user.id,
                now,
                university.country_short_code,
                university.id,
                data.batch_no,
                data.pricing,
                data.payment_method,
                data.payment_acount_number,
                "ACTIVE",
                ""
            ]);
            return { success: true, arenaId: result.insertId };
        } catch (error) {
            console.error("Insert Arena Error:", error);
            return { error: "Database error during insert" };
        } finally {
            // connect.end();
        }
    }
    // await // connect.end();
    
    return { error: "Something went wrong!!" };


}