import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

// Lấy danh sách tin nhắn
export async function GET(req: NextRequest) {
    return forwardRequest(req, `/v1/chat/messages`);
}

// Gửi tin nhắn mới
export async function POST(req: NextRequest) {
    return forwardRequest(req, `/v1/chat/messages`);
}