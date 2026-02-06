// ArenaUsersPage.jsx
"use client";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import getArenaUsers from "./getArenaUsers";
import updateArenaUserStatus from "./updateArenaUserStatus";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import AutoApprove from "./AutoApprove";
import getArenaDetails from "../getArenaDetails";
import Image from "@/Components/Image";

export default function ArenaUsersPage({ user }) {
    const { id } = useParams();
    const arenaId = parseInt(id, 10);
    const [statusFilter, setStatusFilter] = useState("PENDING");
    const [users, setUsers] = useState([]);
    const [counts, setCounts] = useState({ PENDING: 0, APPROVED: 0, DECLINED: 0 });
    const [loading, setLoading] = useState(true);
    const [arenaDetails, setArenaDetails] = useState(null);

    

    const loadUsers = async () => {
        setLoading(true);
        try {
            const allUsers = await getArenaUsers(arenaId);
            console.log(allUsers);
            
            setUsers(allUsers || []);
            const pending = allUsers.filter(u => u.status === "PENDING").length;
            const approved = allUsers.filter(u => u.status === "APPROVED").length;
            const declined = allUsers.filter(u => u.status === "DECLINED").length;
            setCounts({ PENDING: pending, APPROVED: approved, DECLINED: declined });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        (async () => {
            const arenaDetails = await getArenaDetails(arenaId);
            if (!arenaDetails) {
                toast.error("Arena not found");
            } else {
                setArenaDetails(arenaDetails);
            }
        })().finally(() => {
            loadUsers();
        });
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await updateArenaUserStatus(id, status);
            if (res.success) {
                toast.success(`${status.charAt(0) + status.slice(1).toLowerCase()} successfully!`);
                loadUsers();
            } else {
                toast.error(res.error || "Error updating status");
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const filteredUsers = users.filter(u => u.status === statusFilter);


    if (arenaDetails && user?.id != arenaDetails?.userDetails?.id && user?.user_type != "ADMIN") {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
                <div className="text-red-600">You do not have permission to view this page.</div>
            </div>
        );
    }


    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Arena Users</h1>

            <div className="flex gap-4 mb-6">
                {["PENDING", "APPROVED", "DECLINED", "RELOAD"].map((s) => (
                    <button
                        key={s}
                        onClick={() => s != "RELOAD" ? setStatusFilter(s) : loadUsers()}
                        className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === s
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-700"
                            }`}
                    >
                        {s.charAt(0) + s.slice(1).toLowerCase()} {s != "RELOAD" && "(" + counts[s] +")"}
                    </button>
                ))}
            </div>

            {!loading && statusFilter === "PENDING" && (
                <AutoApprove arenaId={arenaId} onApproved={loadUsers} />
            )}

            {loading ? (
                <div className="text-center p-6">Loading...</div>
            ) : filteredUsers.length === 0 ? (
                <div className="text-center p-6 text-gray-500">No users found.</div>
            ) : (
                <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border px-4 py-2">SL. No.</th>
                            <th className="border px-4 py-2">User</th>
                            <th className="border px-4 py-2">Payment Txn ID</th>
                            <th className="border px-4 py-2">Paid By Number</th>
                            <th className="border px-4 py-2">Student ID</th>
                            {statusFilter === "PENDING" && <th className="border px-4 py-2">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((u, i) => (
                            <tr key={u.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2 text-center">{i + 1}</td>
                                <td className="border px-4 py-2 ">
                                    <div className="flex items-center space-x-1">
                                        <span>
                                            <Image src={u.pic} alt={u.name} className={"w-8 h-8 bg-gray-300 rounded-full"} />
                                        </span>
                                        <span>{u.user_id}. {u.name}</span>
                                    </div>
                                </td>
                                <td className="border px-4 py-2 text-center">{u.payment_txn_id}</td>
                                <td className="border px-4 py-2 text-center">{u.payment_by_number}</td>
                                <td className="border px-4 py-2 text-center">{u.university_id}#{u.university_student_id}</td>
                                {statusFilter === "PENDING" && (
                                    <td className="border px-4 py-2 text-center ">
                                        <div className="flex justify-center items-center gap-6">
                                            <button
                                                onClick={() => handleUpdateStatus(u.id, "APPROVED")}
                                                className="flex gap-2 border p-2 rounded cursor-pointer text-green-600 hover:text-green-800"
                                            >
                                                <FaCheck size={24} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(u.id, "DECLINED")}
                                                className="flex gap-2 border p-2 rounded cursor-pointer text-red-600 hover:text-red-800"
                                            >
                                                <FaTimes size={24} />
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
