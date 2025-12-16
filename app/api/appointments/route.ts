import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    return forwardRequest(req, `/v1/appointments`);
}

export async function GET(req: NextRequest) {
    // Preserve query string when forwarding GET requests
    const search = req.nextUrl.search || "";
    return forwardRequest(req, `/v1/appointments${search}`);
}
