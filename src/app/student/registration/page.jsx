import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import StudentPaymentPage from "../payments/StudentPaymentPage";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "student") {
            return <>
                <StudentPaymentPage user={res.user} />
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>
        
    </div>;
}
