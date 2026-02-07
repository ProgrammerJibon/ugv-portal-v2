import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import MarkEntryPage from "./MarkEntryPage";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "teacher") {
            return <>
                <MarkEntryPage user={res?.user}/>
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>
        
    </div>;
}
