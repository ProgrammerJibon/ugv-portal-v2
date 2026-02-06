"use server";
import { connectDatabase } from "@/app/json/connectDatabase";
import { time } from "@/app/functions";
import getArenaUsers from "./getArenaUsers";
import { getUserById, getUserFromAuthCookie } from "@/app/json/serverFunctions";
import { sentSmsServer } from "@/app/json/sentSmsServer";
import getArenaDetails from "../getArenaDetails";




export default async function updateArenaUserStatus(id, status) {
    const connect = await connectDatabase();
    
    const [rows] = await connect.query(
        "SELECT user_id, arena_id FROM arena_users WHERE id = ? LIMIT 1",
        [id]
    );
    if (rows.length == 0 || !("user_id" in rows[0])){
        return { success: false, error: "Fake User" };
    }
    const me = await getUserFromAuthCookie();
    if (!me || (me && !("user" in me))) {        
        return { success: false, error: "You're not logged in..." };
    }
    const meUser = me.user;
    const user = await getUserById(rows[0]?.user_id);
    if (!user || (user && !("id" in user))) {
        return { success: false, error: "Invalid user..." };
    }
    const arena = await getArenaDetails(rows[0]?.arena_id);
    if (!arena || (arena && !("id" in arena))) {
        return { success: false, error: "Invalid arena..." };
    }
    if (arena?.created_by != meUser?.id) {
        console.log(arena?.created_by, meUser?.id);        
        return { success: false, error: "You don't have edit access..." };
    }

    
    
    
    const now = time();
    try {
        const [result] = await connect.execute(
            "UPDATE arena_users SET status = ?, updated_on = ? WHERE id = ?",
            [status, now, id]
        );
        await sentSmsServer(user?.phone, `Assalamualaikum ${user?.name},\n\nYour request for ${arena?.name} has been ${status?.toLowerCase()}.\n\n~BrainSolve`)
        return { success: result.affectedRows > 0 };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Database error" };
    } finally {
        // connect.end();
    }
}
