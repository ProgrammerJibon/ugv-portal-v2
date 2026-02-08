import Section from "@/Components/Section";
import { getUserFromAuthCookie } from "../json/serverFunctions";
import SettingsPage from "./SettingsPage";

export default async () => {
    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        if (res?.user?.user_type?.toLowerCase() != "") {
            return <Section user={res.user}>
                <SettingsPage user={res.user} />
            </Section>
        }
    }
    return <div>
        <h1>Redirecting to login page...</h1>
        <script>window.location.href = "/";</script>
        
    </div>;
}
