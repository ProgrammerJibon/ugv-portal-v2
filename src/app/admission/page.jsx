import Dashboard from "@/Components/Dashboard";
import { getUserFromAuthCookie } from "../json/serverFunctions";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "admission") {
            return <>
                <Dashboard user={res?.user}/>
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>
        
    </div>;
}
