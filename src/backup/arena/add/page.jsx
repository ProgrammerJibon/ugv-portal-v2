"use server"
import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import AddArenaPage from "./AddArenaPage";
import { connectDatabase } from "@/app/json/connectDatabase";
import { redirect } from "next/navigation";
import LoginRequired from "@/Components/LoginRequired";



export default async function ArenaForm() {

    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return <LoginRequired />
    }

    const user = gUser.user;

    if (user.user_type != "TEACHER" && user.user_type != "ADMIN"){
        redirect("/dashboard");
    }

    // user.university_id get university details
    const connect = await connectDatabase();
    const sql = "SELECT * FROM university_list WHERE id = ? LIMIT 1";
    const [rows] = await connect.execute(sql, [user.university_id]);
    // await // connect.end();

    
    if (rows.length === 0) {
        redirect("/dashboard");
    }

    const university = rows[0];

    
    
    

    return <AddArenaPage user={gUser.user} university={university}/>;
}
