import { getUserFromAuthCookie } from "../json/serverFunctions";
import Settings from "./Settings";
import LoginPage from "../login/LoginPage";

export const metadata = {
    title: "Settings - Code Assesment Arena",
    description: "Your dashboard.",
};
export default async ({ }) => {

    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return <LoginPage />;
    }else{
        const user = gUser.user;

        return <Settings user={user} />
    }
    
}