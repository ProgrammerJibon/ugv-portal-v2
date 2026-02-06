import { redirect } from "next/navigation";
import LoginPage from "./LoginPage";
import { getUserFromAuthCookie } from "../json/serverFunctions";

export const metadata = {
    title: "Login - Code Assesment Arena",
    description: "Login to access your account.",
};

export default  async( {} ) => {

    const res = await getUserFromAuthCookie();
    if (res && "user" in res) {
        redirect("/dashboard");
    }else{
        return <LoginPage />;
    }
    

    
    
    
}