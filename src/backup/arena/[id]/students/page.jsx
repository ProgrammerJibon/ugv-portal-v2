"use server"
import { getUserFromAuthCookie } from "@/app/json/serverFunctions"
import ArenaUsersPage from "./ArenaUsersPage";
import LoginRequired from "@/Components/LoginRequired";

export default async ({ }) => {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return <LoginRequired />
    }
    const user = gUser.user;


    return <ArenaUsersPage user={user} />
}