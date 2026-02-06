import { ToastContainer } from "react-toastify";
import "./globals.css";
import React from "react";
import KeepCookieUpdated from "../context/KeepCookieUpdated";
import { getUserFromAuthCookie } from "./json/serverFunctions";
import Navbar from "@/Components/Navbar";
import { connectDatabase } from "./json/connectDatabase";
import createTablesIfNotExists from "./json/createTablesIfNotExists";
import { databaseError } from "@/static";

export const metadata = {
    title: "UGV Portal",
    description: "UGV Portal for students and faculty members",
};

let rootRenderred = false;
await (async ()=> {
    console.log("Preloading RootLayout");
    const connect = await connectDatabase();
    const checkTables = await createTablesIfNotExists(connect);
    if(!checkTables){
        console.error("Table creation failed");
    }
    // // await // connect.end();
    rootRenderred = true;    
})();


export default async function RootLayout({ children }) {

    if (!rootRenderred){
        metadata.title += " - 500 internal error";
        return <html lang="en"><body><h1 className="font-bold text-3xl">500 internal error {databaseError}...</h1></body></html>;
    }
    const gUser = await getUserFromAuthCookie();
    


    return (
        <html lang="en">
            <body className={``}>
                <Navbar gUser={gUser} />
                <main>{children}</main>
                <KeepCookieUpdated gUser={gUser} />
                <ToastContainer />
            </body>
        </html>
    );
}
