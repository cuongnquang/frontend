import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

/**
 * PATCH /api/reviews/[id]/reply
 * Doctor replies to a review
 */
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
    return forwardRequest(req, `/v1/reviews/${id}/reply`);
}

