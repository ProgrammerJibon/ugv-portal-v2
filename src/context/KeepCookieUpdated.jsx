"use client";

import { useEffect, useState } from "react";
import { setAuthCookie } from "./setAuthCookie";

export default ({ gUser }) => {
    useEffect(() => {

        (async () => {
            await setAuthCookie(gUser);
        })();

    }, []);


    return <>
        {/* {loading && <SplashScreen />} */}
    </>
}