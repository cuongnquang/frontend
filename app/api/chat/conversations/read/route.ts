import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

// Định nghĩa kiểu dữ liệu cho params
interface RouteParams {
    params: {
        id: string;
    }
}

// Xử lý POST /api/chat/conversations/[id]/read
export async function POST(
    req: NextRequest, 
    { params }: RouteParams
) {
    const conversationId = params.id;
    return forwardRequest(req, `/v1/chat/conversations/${conversationId}/read`);
}