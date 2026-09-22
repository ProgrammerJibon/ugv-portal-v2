import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import StudentReportPage from "./StudentReportPage";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "student") {
            return <>
                <StudentReportPage user={res?.user} />
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>
        
    </div>;
}
