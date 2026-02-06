"use server";

import { connectDatabase } from "@/app/json/connectDatabase";
import { getUserFromAuthCookie } from "@/app/json/serverFunctions";

export default async (id, status) => {
    let success = false;
    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return success;
    }
    const user = gUser.user;
    
    if (user.user_type == "TEACHER"){
        const connect = await connectDatabase();
        const sql = "UPDATE arena_list SET status=? WHERE id=? AND created_by=? LIMIT 1";
        const [result] = await connect.execute(sql, [status, id, user.id]);
        if (result.affectedRows > 0) {
            success = true;
        }
        // // await // connect.end();
    }   
    
    return success;
};
