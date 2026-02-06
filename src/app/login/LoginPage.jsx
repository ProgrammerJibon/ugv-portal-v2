"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { hash, validatePassword } from "../functions";
import { toast } from "react-toastify";
import { BarLoader, RingLoader } from "react-spinners";
import SplashScreen from "@/Components/SplashScreen";
import loginAction from "./loginAction";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import googleCloudSecret from "@/context/client_secret_497545261562-tekkk50sjbdn8t72s6gksngsk4ofnqt2.apps.googleusercontent.com.json"
import { jwtDecode } from "jwt-decode";




export default function LoginPage({ }) {

    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginning, setIsLoggingin] = useState(true);





    const handleLogin = async (e) => {
        e.preventDefault();

        setIsLoggingin(true);

        if (!userId || !password) {
            toast.error("Please enter both User ID/Phone and Password");
            setIsLoggingin(false);
            return;
        }

        if (!validatePassword(password)) {
            toast.error(
                "Password must contain both letters and numbers." +
                "\n\nhash of Aa1234: " + hash("Aa1234")
            );
            setIsLoggingin(false);
            return;
        }

        const res = await loginAction(
            { userId, password },
            new Headers({
                "user-agent": navigator.userAgent
            })
        );

        if (res.status === "success") {
            // document.cookie = `auth=${res.cookie}; path=/; max-age=${86400 * res.expiryDays}; samesite=strict`;
            toast.success("Login successful!");
            window.location.href = "/";
        } else {
            if (res.errors) {
                Object.values(res.errors).forEach(msg => toast.error(msg));
            } else {
                toast.error("Login failed.");
            }
        }

        setTimeout(() => {
            setIsLoggingin(false);
        }, 1000);
    };


    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const response = jwtDecode(credentialResponse.credential);
            if (("email" in response)) {
                const res = await loginAction({ email: response.email });

                if (res.status === "success") {
                    // document.cookie = `auth=${res.cookie}; path=/; max-age=${86400 * res.expiryDays}; samesite=strict`;
                    toast.success("Login successful!");
                    window.location.href = "/";
                } else {
                    if (res.errors) {
                        Object.values(res.errors).forEach(msg => toast.error(msg));
                    } else {
                        toast.error("Login failed.");
                    }
                }
            } else {
                toast.error("Unauthorized google account!!!");
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4">
            <form
                onSubmit={handleLogin}
                className="relative w-full max-w-md backdrop-blur-xl bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center"
            >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-blue-500 rounded-full blur-[60px] opacity-50"></div>

                <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight">
                    <span>BrainSolve Login</span>
                </h1>

                <div className="w-full space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="User ID or Phone"
                            value={userId}
                            autoComplete="username"
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                            disabled={isLoginning}
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                            disabled={isLoginning}
                        />
                    </div>
                </div>

                <div className="h-[50px] w-full flex justify-center mt-6">
                    {isLoginning ? (
                        <RingLoader color="#60a5fa" size={45} />
                    ) : (
                        <button
                            type="submit"
                            className="group relative w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
                            disabled={isLoginning}
                        >
                            Login
                        </button>
                    )}
                </div>

                <div className="w-full flex items-center my-4">
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                    <span className="px-3 text-white/30 text-sm uppercase tracking-widest">or</span>
                    <div className="flex-1 h-[1px] bg-white/10"></div>
                </div>

                <GoogleOAuthProvider onScriptLoadSuccess={() => setIsLoggingin(false)} clientId={googleCloudSecret.web.client_id} >
                    <div className="mx-auto w-full overflow-hidden  pb-4 google-btn">
                        <GoogleLogin
                            width="100%"
                            text="Login with Google Account"
                            theme="filled_blue"
                            onSuccess={handleGoogleLogin}
                            onError={() => { }}
                        />
                    </div>
                </GoogleOAuthProvider>

                <div className="mt-8 flex space-x-2 text-sm">
                    <span className="text-white/60">Don't have an account?</span>
                    <Link href="/register" className="text-blue-400 font-medium hover:text-blue-300 transition-colors hover:underline">
                        Register here
                    </Link>
                </div>
            </form>
        </div>
    );
}
