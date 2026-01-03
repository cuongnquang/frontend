import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

// Lấy danh sách các cuộc trò chuyện
export async function GET(req: NextRequest) {
    return forwardRequest(req, `/v1/chat/conversations`);
}
