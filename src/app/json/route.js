import { connection, NextResponse } from "next/server";
import { connectDatabase } from "./connectDatabase";
import md5 from "md5";
import sha1 from "sha1";
import { time } from "../functions";
import { getUserFromAuthCookie } from "./serverFunctions";


String.prototype.toCapitalize = function () {
    return this
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

String.prototype.isNumeric = function () {
    return /^[0-9]+$/.test(this);
}

String.prototype.isPureString = function () {
    return /^[a-zA-Z. ]+$/.test(this);
}



export async function GET() {
    const result = {};
    const errors = {};
    let responseCode = 200;

    errors["method"] = "Method Not Allowed!";
    responseCode = 405;


    if (Object.keys(errors).length > 0) {
        result["status"] = "error";
        result["errors"] = errors;
    }
    return NextResponse.json(result, { status: responseCode });
}


export async function POST(req) {
    const result = {};
    const errors = {};

    const data = await req.json();

    const connect = await connectDatabase();
    if (!connect) {
        errors["db"] = "Database connection failed";
    } else {
        const checkTables = true;
        if (!checkTables) {
            errors["table"] = "Table creation failed";
        }else{
            if ("login" in data) {
                const { userId, password } = data.login;

                if (!userId || userId.trim() === "") {
                    errors["userId"] = "User ID or Phone is required.";
                }

                if (!password || password.trim() === "") {
                    errors["password"] = "Password is required.";
                }

                if (Object.keys(errors).length === 0) {
                    const hashedPassword = md5(sha1(password));

                    const [rows] = await connect.execute(
                        "SELECT * FROM users WHERE (id = ? OR phone = ?) AND password = ? LIMIT 1",
                        [userId, userId, hashedPassword]
                    );

                    if (rows.length === 0) {
                        errors["credentials"] = "Invalid User ID/Phone or Password.";
                    } else {
                        const user = rows[0];

                        if (user.status !== "ACTIVE") {
                            errors["account"] = "Account staus is " + user.status.toLowerCase().toCapitalize() + ". Please contact support or your teacher.";
                        } else {
                            const cookie = md5(user.id + "%" + Date.now());
                            const t = time();
                            const expiryDays = 30;
                            const expiry = t + (86400 * expiryDays);

                            await connect.execute(
                                "INSERT INTO cookies (cookie, user_id, time, ip, user_agent, status, expiry) VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?)",
                                [
                                    cookie,
                                    user.id,
                                    t,
                                    req.headers.get("x-forwarded-for") || "0.0.0.0",
                                    req.headers.get("user-agent") || "",
                                    expiry
                                ]
                            );

                            result["status"] = "success";
                            result["expiryDays"] = expiryDays;

                            const response = NextResponse.json(result);

                            response.headers.set(
                                "Set-Cookie",
                                `auth=${cookie}; Path=/; Max-Age=${86400 * expiryDays}; HttpOnly; SameSite=Strict`
                            );

                            // connect.end();
                            return response;
                        }
                    }
                }
            }
            if ("getUsers" in data) {
                const gUser = await getUserFromAuthCookie();

                const response = NextResponse.json(gUser?.user || null);

                response.headers.set(
                    "Set-Cookie",
                    `auth=${gUser.authCookie}; Path=/; Max-Age=${86400 * gUser.expiryDays}; HttpOnly; SameSite=Strict`
                );

                return response;
            }

            
          
        }
        // connect.end();
    }


    if (Object.keys(errors).length > 0) {
        result["status"] = "error";
        result["errors"] = errors;
    }
    return NextResponse.json(result);
}



