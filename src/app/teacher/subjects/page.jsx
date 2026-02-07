import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import TeacherDashboard from "./TeacherDashboard";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "teacher") {
            return <>
                <TeacherDashboard user={res?.user}/>
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>
        
    </div>;
}
