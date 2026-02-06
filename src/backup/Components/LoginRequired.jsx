"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginRequired() {
    const router = useRouter();
    useEffect(()=>{
        router.replace("/login");
    }, []);
    // 
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                    403
                </h1>
                <p className="text-gray-600">
                    Access Restricted
                </p>
            </div>
        </div>
    );
}
