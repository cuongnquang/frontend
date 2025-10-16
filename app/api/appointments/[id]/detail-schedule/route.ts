import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const { id } = await context.params;
    return forwardRequest(req, `/v1/appointments/schedule/${id}`);

}