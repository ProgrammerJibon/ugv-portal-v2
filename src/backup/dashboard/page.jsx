import Navbar from "@/Components/Navbar";
import { getUserFromAuthCookie } from "../json/serverFunctions";
import LoginRequired from "@/Components/LoginRequired";

export const metadata = {
    title: "Dashboard - Code Assesment Arena",
    description: "Your dashboard.",
};
export default async ({}) => {

    const gUser = await getUserFromAuthCookie();
    if(!gUser || !("user" in gUser)){
        return <LoginRequired />
    }
    return <>
        <div className="w-10/12 mx-auto my-16">
            <span>You don't have enough data in our site to show matrix.</span>
        </div>
    </>
}