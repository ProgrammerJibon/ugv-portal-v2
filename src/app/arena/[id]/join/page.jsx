"use server"
import { getUserFromAuthCookie } from "@/app/json/serverFunctions"
import JoinArenaPage from "./JoinArenaPage";
import getArenaDetails from "../getArenaDetails";
import LoginRequired from "@/Components/LoginRequired";

export default async ({params}) => {
    const {id} = await params;
    
    
    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return <LoginRequired />
    }
    const user = gUser.user;

    
    const arenaDetails = await getArenaDetails(id);

    
    if (!arenaDetails || !("id" in arenaDetails)){
        return <div className="mx-auto w-10/12 p-10">Arena not accessible...</div>;
    }
    
    
    return <JoinArenaPage user={user} arenaDetails={arenaDetails}/>
}