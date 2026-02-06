"use server";
import { connectDatabase } from "@/app/json/connectDatabase";
import { time } from "@/app/functions";
import { checkIfTxnAlreadyApproved } from "@/app/json/serverFunctions";

export default async function autoApproveArenaUser(arena_id, txn_id) {
    try {
        const check_txn_id = await checkIfTxnAlreadyApproved(txn_id);
        if (check_txn_id) {
            return { success: false, error: "Transaction already approved for another user." };
        }
        const connect = await connectDatabase();
        const now = time();

        const [rows] = await connect.execute(
            "SELECT * FROM arena_users WHERE arena_id = ? AND payment_txn_id = ? AND status = 'PENDING' LIMIT 1",
            [arena_id, txn_id]
        );

        if (rows.length === 0) {
            return { success: false, error: "Pending transaction not found" };
        }

        const userId = rows[0].id;

        await connect.execute(
            "UPDATE arena_users SET status = 'APPROVED', updated_on = ? WHERE id = ?",
            [now, userId]
        );

        return { success: true };
    } catch (err) {
        console.error("Auto Approve Error:", err);
        return { success: false, error: "Database error" };
    } finally {
        // connect.end();
    }
}
