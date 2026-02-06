"use server"
import { getUserFromAuthCookie } from "@/app/json/serverFunctions"
import ProblemDetailPage from "./ProblemDetailPage";
import LoginRequired from "@/Components/LoginRequired";

export default async ({}) => {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return <LoginRequired />
    }
    const user = gUser.user;


    return <ProblemDetailPage user={user}/>
}