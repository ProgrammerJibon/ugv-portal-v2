import { sentSmsServer } from "./json/sentSmsServer";

// app/home/route.js
export async function GET() {
    
    return new Response(null, {
        status: 302,
        headers: { Location: "/arena" },
    });
}
