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
        if (res?.user?.user_type?.toLowerCase() === "exam"){
            return <div>
                <h1>Redirecting to exam page...</h1>
                <script>window.location.href = "/exam";</script>
            </div>;
        }
        if (res?.user?.user_type?.toLowerCase() === "teacher"){
            return <div>
                <h1>Redirecting to teacher page...</h1>
                <script>window.location.href = "/teacher";</script>
            </div>;
        }
        if (res?.user?.user_type?.toLowerCase() === "admission"){
            return <div>
                <h1>Redirecting to admission page...</h1>
                <script>window.location.href = "/admission";</script>
            </div>;
        }
    }else{
        return <LoginPage />;
    }
    
}