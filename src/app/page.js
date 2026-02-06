"use server";
import { getUserFromAuthCookie } from "./json/serverFunctions";
import LoginPage from "./login/LoginPage";


export default async function Home() {
    const res = await getUserFromAuthCookie();    
    if (res && "user" in res){
        if (res?.user?.user_type?.toLowerCase() === "admin"){
            return <div>
                <h1>Redirecting to admin page...</h1>
                <script>window.location.href = "/admin";</script>
            </div>;
        }
    }else{
        return <LoginPage />;
    }
    
}