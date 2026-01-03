import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

// đánh dấu cuộc trò chuyện đã đọc 
// dùng id lấy từ id chatroom
export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    return forwardRequest(req, `/v1/chat/conversations/${id}/read`);
}