"use server";
import { redirect } from "next/navigation";
import { getUserFromAuthCookie } from "../json/serverFunctions";
import RegisterPage from "./RegisterPage";

export async function generateMetadata() {
    return {
        title: "Register - Code Assesment Arena",
        description: "Create a new account to access university resources",
    };
}

export default async ({ }) => {
    const gUser = await getUserFromAuthCookie();
    if (!gUser || (gUser && !("user" in gUser))) {
        return <RegisterPage />;
    }else{
        redirect("/");
    }
    
}