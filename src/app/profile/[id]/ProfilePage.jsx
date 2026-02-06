"use client";

import { useState, useEffect } from "react";
import getUserProfile from "./getUserProfile";
import { Editor } from "@monaco-editor/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import SplashScreen from "@/Components/SplashScreen";
import Image from "@/Components/Image";

export default function ProfilePage({ data }) {
    const [picErrors, setPicErrors] = useState([]);


    // if (loading) return <SplashScreen />;
    // if (!data) return <div className="p-10 text-red-500">User not found</div>;

    const formatTime = t =>
        t ? new Date(Number(t) * 1000).toLocaleString("en-BD") : "N/A";

    return (
        <div className="p-6 space-y-6 mx-auto w-10/12">
            {/* User Info */}
            <div className="flex items-center gap-4">
                <Image
                    src={data.user.pic}
                    className="w-20 h-20 rounded-full object-cover bg-gray-300 flex items-center justify-center font-bold text-gray-600 text-2xl"
                    alt={data.user.name}
                />
                <div>
                    <h2 className="text-2xl font-bold">{data?.user?.name}</h2>
                    <p className="text-gray-500">Student ID: {data?.user?.university_student_id}</p>
                    <p className="text-gray-500">University: {data?.user?.university_name || "N/A"}</p>
                    <p className="text-gray-500">Country: {data?.user?.country || "N/A"}</p>
                </div>
            </div>

            {/* Arenas Joined */}
            <div>
                <h3 className="font-bold text-lg mb-2">Arenas Joined</h3>
                {data?.arenas.length ? (
                    <ul className="space-y-1">
                        {data.arenas.map(a => (
                            <li key={a.id} className="border border-gray-300 rounded p-2 bg-gray-50">
                                <span className="font-semibold"><Link className="hover:underline" href={"/arena/" + a.id}>{a.name}</Link></span> • Joined: {formatTime(a.joined_on)} • Status: {a.status}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">No arenas joined.</p>
                )}
            </div>

            {/* Problem Submissions */}
            <div>
                <h3 className="font-bold text-lg mb-2">Problem Submissions</h3>
                {data?.submissions.length ? (
                    <table className="w-full border  border-gray-300 text-sm text-left">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Problem</th>
                                <th className="px-4 py-2">Arena</th>
                                <th className="px-4 py-2">Language</th>
                                <th className="px-4 py-2">Status</th>
                                <th className="px-4 py-2">Submitted On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.submissions.map(s => (
                                <tr key={s.id} className="border-b border-gray-300 hover:bg-gray-50">
                                    <td className="px-4 py-2">
                                        <Link href={"/arena/" + s.arena_id + "/" + s.problem_id} className="hover:underline">{s.problem_name}</Link>
                                    </td>
                                    <td className="px-4 py-2">
                                        <Link href={"/arena/" + s.arena_id} className="hover:underline">{s.arena_name}</Link>
                                    </td>
                                    <td className="px-4 py-2">{s.code_language}</td>
                                    <td className={`px-4 py-2 ${s.isPassed ? "text-green-600" : "text-red-600"}`}>
                                        {s.isPassed ? "ACCEPTED" : "FAILED"}
                                    </td>
                                    <td className="px-4 py-2">{formatTime(s.submitted_on)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No submissions found.</p>
                )}
            </div>
        </div>
    );
}
