"use server";

import { connectDatabase } from "@/app/json/connectDatabase";
import { getUniversityById, getUserById } from "@/app/json/serverFunctions";

export default async (id) => {
    let result = null;
    const connect = await connectDatabase();
    const sql = "SELECT * FROM arena_list WHERE id=? LIMIT 1";
    const [arenaRows] = await connect.execute(sql, [id]);
    if (arenaRows.length > 0) {
        const arena = arenaRows[0];
        const university = await getUniversityById(arena.university_id);
        const userDetails = await getUserById(arena.created_by);
        result = { ...arena, university, userDetails };
    }
    // // await // connect.end();

    
    return result;
}