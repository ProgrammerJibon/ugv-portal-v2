import Link from "next/link";
import ArenaList from "./ArenaList";
import { getUniversityById, getUserFromAuthCookie } from "../json/serverFunctions";
import LoginRequired from "@/Components/LoginRequired";

export default async ({ }) => {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return <LoginRequired />
    }
    const user = gUser.user;

    const university = await getUniversityById(user.university_id, user.user_type == "ADMIN");
    


    return (
        <div className="w-10/12 mx-auto px-6 py-8">
            

            <h1 className="font-bold ">Arena List {user.user_type == "ADMIN" || " in " + university?.name}</h1>
            {(user.user_type == "TEACHER" || user.user_type == "ADMIN") &&
                <Link href="/arena/add" className={`  inline-block my-4 `}>
                    <div className="px-6 py-2 border text-red-600 hover:bg-red-100 bg-white border-red-500 rounded inline-block">
                        Add New Arena
                    </div>
                </Link>
            }
            <div className="flex flex-col gap-4 mt-4">
                <ArenaList user={user} />
            </div>
        </div>
    );
}