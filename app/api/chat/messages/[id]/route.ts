import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

// id là id chatroom
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return forwardRequest(req, `/v1/chat/messages/${id}`);
}

//
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return forwardRequest(req, `/v1/chat/messages/${id}`);
}