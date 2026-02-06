"use server";

import { time } from "../functions";
import { headers } from "next/headers";
import { connectDatabase } from "./connectDatabase";

export async function sentSmsServer(phone_number, sms_body, user_id) {
    let result = true;
    const postData = {
        api_key: "c1hSenyksbyeSSqi1tcC",
        senderid: "8809617617692",
        number: phone_number,
        message: sms_body,
    };

    const timeX = time();
    const h = await headers();
    const ip = h.get("x-forwarded-for") || "0.0.0.0";

    try {
        const response = await fetch("http://bulksmsbd.net/api/smsapi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
        });

        const sent_sms_response = await response.json().catch(() => ({}));

        if (sent_sms_response.response_code === 202) {
            result = true;
        } else {
            result = false;
        }

        const error_code = sent_sms_response.response_code ?? -1;
        const response_msg = sent_sms_response.success_message ?? sent_sms_response.error_message ?? -1;
        const request_id = sent_sms_response.message_id ?? -1;

        const db = await connectDatabase();
        await db.query(
            `INSERT INTO sms_sents (phone, user_id, body, time, ip, status, error, response, request_id, sms_server) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [phone_number, user_id, sms_body, timeX, ip, result, error_code, response_msg, request_id, "2"]
        );
    } catch (e) {
        result = false;
    }

    return result;
}
