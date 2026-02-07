import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import Dashboard from "@/Components/Dashboard";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "student") {
            return <>
                <Dashboard user={res?.user} />
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>
        
    </div>;
}
