import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { time } from "../functions";
import { connectDatabase } from "../json/connectDatabase";

export async function POST() {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth")?.value;

    if (!authCookie) {
        redirect("/login");
    }

    const connect = await connectDatabase();
    const now = time();
    await connect.execute(
        "UPDATE cookies SET expiry=?, status='EXPIRED' WHERE cookie=?",
        [now, authCookie]
    );
    // await // connect.end();

    cookieStore.set({
        name: "auth",
        value: "",
        path: "/",
        expires: new Date(0),
    });

    redirect("/");
}
