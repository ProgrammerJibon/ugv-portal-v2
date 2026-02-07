import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import AddPaymentPage from "./AddPaymentPage";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "accountant") {
            return <>
                <AddPaymentPage user={res?.user} />
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>

    </div>;
}
