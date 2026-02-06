"use server";

import { time } from "@/app/functions";
import { connectDatabase } from "@/app/json/connectDatabase";
import checkIfArenaUser, { checkIfTxnAlreadyApproved, checkIfTxnAlreadyPending, getUserFromAuthCookie } from "@/app/json/serverFunctions";

export default async function joinArena(data) {
    if (!data?.payment_txn_id || !data?.arena_id){
        return { error: "Txn id is required." };
    }
    const check_txn_id = await checkIfTxnAlreadyApproved(data?.payment_txn_id);
    if(check_txn_id){
        return { error: "Txn id is already approved." };
    }
    const check_txn_id_pending = await checkIfTxnAlreadyPending(data?.payment_txn_id);
    if (check_txn_id_pending){
        return { error: "Txn id is already pending approval." };
    }
    const gUser = await getUserFromAuthCookie();
    if (!gUser || !("user" in gUser)) {
        return { error: "Unauthorized" };
    }

    const user = gUser.user;

    const checkIfArenaUserResult = await checkIfArenaUser(data.arena_id, user.id);
    if (checkIfArenaUserResult) {
        if(checkIfArenaUserResult.status === "PENDING"){
            return { error: "Your request to join this arena is still pending approval." };
        }
        if(checkIfArenaUserResult.status === "APPROVED"){
            return { error: "You are already a member of this arena." };
        }
    }


    const connect = await connectDatabase();
    const now = time();

    const insertSql = `
        INSERT INTO arena_users
        (user_id, arena_id, payment_txn_id, payment_by_number, status, created_on)
        VALUES (?, ?, ?, ?, 'PENDING', ?)
    `;

    try {
        const [result] = await connect.execute(insertSql, [
            user.id,
            data.arena_id,
            data.payment_txn_id,
            data.payment_by_number,
            now
        ]);
        return { success: true, id: result.insertId };
    } catch (error) {
        console.error("Join Arena Error:", error);
        return { error: "Database error during join" };
    } finally {
        // await // connect.end();

    
    }
}
