import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    return forwardRequest(req, `/v1/appointments/list`);
}

export async function POST(req: NextRequest) {
    return forwardRequest(req, `/v1/appointments`);
}
