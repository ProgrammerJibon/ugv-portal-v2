"use server";
import { cookies } from "next/headers";
import { time } from "../functions";
import { connectDatabase } from "./connectDatabase";

const footprint_types = [
    "DUMP_LOGS",
    "LOGIN_FAILED",
    "LOGIN_SUCCESS",
    "LOGOUT_SUCCESS",
    "USER_STATUS",
    "USER_PASSWORD_RESET",
    "USER_PASSWORD_UPDATED"
];


export async function getFootprintTypes() {
    return footprint_types;
}


export async function add_footprints(connect, typeId, details, ip, userAgent, uId = 0) {
    try {
        const t = time();
        const type = (typeof typeId === "number" && footprint_types[typeId]) ? footprint_types[typeId] : (footprint_types[typeId] || "DUMP_LOGS");
        await connect.execute(
            "INSERT INTO footprints (possible_user_id, details, type, time, ip, user_agents) VALUES (?, ?, ?, ?, ?, ?)",
            [String(uId || 0), details, type, String(t), ip || "0", userAgent || "0"]
        );
        return true;
    } catch (e) {
        console.error("add_footprints error:", e);
        return false;
    }
}



export async function getUserFromAuthCookie(authCookie = null) {

    if(!authCookie){
        const cookieStore = await cookies();
        authCookie = cookieStore.get("auth")?.value || null;
    }


    if (!authCookie) return null;

    const connect = await connectDatabase();

    const [cookieRows] = await connect.execute(
        "SELECT * FROM cookies WHERE cookie=? AND status='ACTIVE' LIMIT 1",
        [authCookie]
    );
    
    if (cookieRows.length === 0) {
        // connect.end();
        return null;
    }
    
    

    const cookieData = cookieRows[0];
    const now = Math.floor(Date.now() / 1000);
    if (cookieData.expiry < now) {
        await connect.execute(
            "UPDATE cookies SET status='EXPIRED' WHERE id=?",
            [cookieData.id]
        );
        // connect.end();
        return null;
    }
    

    const [userRows] = await connect.execute(
        "SELECT * FROM users WHERE id=? LIMIT 1",
        [cookieData.user_id]
    );

    if (userRows.length === 0 || userRows[0].status !== "ACTIVE") {
        // connect.end();
        return null;
    }

    const user = { ...userRows[0] };
    delete user.password;

    const t = time();
    const expiryDays = 30;
    const expiry = t + 86400 * expiryDays;
    
    await connect.execute(
        "UPDATE cookies SET expiry=? WHERE id=?",
        [expiry, cookieData.id]
    );

    // await // connect.end();

    
    
    return { user, authCookie, expiryDays };
}


export async function getUserById(userId) {
    const connect = await connectDatabase();

    const [userRows] = await connect.execute(
        "SELECT * FROM users WHERE id=? LIMIT 1",
        [userId]
    );

    if (userRows.length === 0 || userRows[0].status !== "ACTIVE") {
        // connect.end();
        return null;
    }

    const user = { ...userRows[0] };
    delete user.password;

    // await // connect.end();

    return user;
}

export async function getUserByPhone(phone) {
    const connect = await connectDatabase();

    const [userRows] = await connect.execute(
        "SELECT * FROM users WHERE phone=? LIMIT 1",
        [phone]
    );

    if (userRows.length === 0 || userRows[0].status !== "ACTIVE") {
        // connect.end();
        return null;
    }

    const user = { ...userRows[0] };
    delete user.password;

    // await // connect.end();

    return user;
}

export async function getCountryByCode(countryCode) {
    const connect = await connectDatabase();

    const [countryRows] = await connect.execute(
        "SELECT * FROM country_list WHERE code=? LIMIT 1",
        [countryCode]
    );

    if (countryRows.length === 0 || countryRows[0].status !== "active") {
        // connect.end();
        return null;
    }

    const country = { ...countryRows[0] };

    // await // connect.end();

    return country;
}

export async function getUniversityById(universityId, isAdmin) {
    const connect = await connectDatabase();

    const [universityRows] = await connect.execute(
        "SELECT * FROM university_list WHERE id=? OR 1=? ",
        [universityId, isAdmin?1:0]
    );

    // console.log(universityRows.length);
    
    if (universityRows.length > 0){
        return universityRows[0];
    }
    

    // await // connect.end();
    
    return null;
}




export default async function checkIfArenaUser(arena_id, user_id) {
    const user = await getUserById(user_id);
    if(!user){
        return null;
    }

    if (user.user_type == "ADMIN"){
        return {
            arena_id,
            user_id,
            status: "APPROVED",
            type: "ADMIN"
        }
    }
    const connect = await connectDatabase();

    try {

        const [checkIfOwner] = await connect.execute(
            "SELECT * FROM `arena_list` WHERE `id` = ? AND `created_by` = ?",
            [arena_id, user_id]
        );

        if (checkIfOwner.length > 0){
            return {
                arena_id,
                user_id,
                status: "APPROVED",
                type: "TEACHER"
            }
        }

        const [rows] = await connect.execute(
            `SELECT * FROM arena_users WHERE arena_id = ? AND user_id = ? ORDER BY id DESC LIMIT 1`,
            [arena_id, user_id]
        );

        if (rows.length > 0) {
            rows[0].type = "STUDENT";
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error("Check Arena User Error:", err);
        return null;
    } finally {
        // await // connect.end();
    
    }
}


export async function getCountries() {
    const connect = await connectDatabase();

    const [rows] = await connect.execute(
        "SELECT * FROM country_list ORDER BY name ASC"
    );

    // await // connect.end();

    return rows;
}



export async function getUniversities(countryCode = null) {
    const connect = await connectDatabase();

    const [rows] = await connect.execute(
        "SELECT * FROM university_list " + (countryCode ? " WHERE country_short_code=?" : ""),
        countryCode ? [countryCode] : []
    );

    const universities = {
        public: [],
        private: []
    };
    

    rows.forEach((univ) => {
        if (univ.varsity_type === "PUBLIC") {
            universities.public.push(univ);
        } else if (univ.varsity_type === "PRIVATE") {
            universities.private.push(univ);
        }
    });

    // await // connect.end();

    return universities;
}





export async function checkIfTxnAlreadyApproved(txn_id) {
    const connect = await connectDatabase();
    const [rows] = await connect.query(
        "SELECT * FROM `arena_users` WHERE `payment_txn_id` = ? AND `status` = 'APPROVED' ORDER BY `id` DESC",
        [txn_id]
    );
    return rows.length > 0 ? true : false;
}

export async function checkIfTxnAlreadyPending(txn_id) {
    const connect = await connectDatabase();
    const [rows] = await connect.query(
        "SELECT * FROM `arena_users` WHERE `payment_txn_id` = ? AND `status` = 'PENDING' ORDER BY `id` DESC",
        [txn_id]
    );
    return rows.length > 0 ? true : false;
}