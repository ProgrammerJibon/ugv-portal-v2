// getArenaUsers.js (use-server)
"use server";
import { connectDatabase } from "@/app/json/connectDatabase";
import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import getArenaDetails from "../getArenaDetails";

export default async function getArenaUsers(arena_id) {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return [];
    }
    const user = gUser?.user;
    if (user?.user_type != "TEACHER" && user?.user_type != "ADMIN") {
        // console.log("Not a teacher");
        return [];
    }
    const getArenaDetailsDes = await getArenaDetails(arena_id);
    if (!getArenaDetailsDes) {
        return [];
    }
    
    if (user?.id != getArenaDetailsDes?.created_by && user?.user_type != "ADMIN"){
        return [];
    }
    const connect = await connectDatabase();
    try {
        const [rows] = await connect.execute(
            `SELECT arena_users.*, users.name, users.pic, users.university_id, users.university_student_id FROM arena_users JOIN users ON arena_users.user_id = users.id WHERE arena_users.arena_id = ? ORDER BY arena_users.created_on DESC`,
            [arena_id]
        );
        return rows;
    } catch (err) {
        console.error(err);
        return [];
    } finally {
        // connect.end();
    }
}
