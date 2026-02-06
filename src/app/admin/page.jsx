import { getUserFromAuthCookie } from "../json/serverFunctions";
import AdminDashboard from "./Dashboard";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "admin") {
            return <>
                <AdminDashboard user={res?.user}/>
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>
        
    </div>;
}
