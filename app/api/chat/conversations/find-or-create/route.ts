import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

// Tìm hoặc tạo cuộc trò chuyện mới
export async function POST(req: NextRequest) {
    return forwardRequest(req, `/v1/chat/conversations/find-or-create`);
}
