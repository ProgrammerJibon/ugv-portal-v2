import { getUserFromAuthCookie } from "@/app/json/serverFunctions";
import AddUserForm from "./RegisterNewStaff";
import { getMajors } from "./addUserAction";

export default async () => {
    const res = await getUserFromAuthCookie();
    const   getMajorsData = await getMajors();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() === "admin") {
            return <>
                <AddUserForm getMajorsData={getMajorsData} user={res?.user} />
            </>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>

    </div>;
}
