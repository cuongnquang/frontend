import { NextRequest } from "next/server";
import { forwardRequest } from "@/lib/api-proxy";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params;
    return forwardRequest(req, `/v1/schedules/${id}`);

}