"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import autoApproveArenaUser from "./autoApproveArenaUser"; // server function

export default function AutoApprove({ arenaId, onApproved }) {
    const [txnId, setTxnId] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAutoApprove = async () => {
        if (!txnId.trim()) return toast.error("Enter a transaction ID");

        setLoading(true);
        try {
            const res = await autoApproveArenaUser(arenaId, txnId.trim());
            if (res.success) {
                toast.success("User approved successfully!");
                setTxnId("");
                if (onApproved) onApproved();
            } else {
                toast.error(res.error || "Transaction not found or already approved/declined");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2 items-center mb-6 max-w-md">
            <input
                type="text"
                placeholder="Enter Transaction ID"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleAutoApprove}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
            >
                {loading ? "Approving..." : "Auto Approve"}
            </button>
        </div>
    );
}
