import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

/**
 * PUT /api/reviews/[id]
 * Update a review (patient only)
 */
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return Response.json(
            { 
                status: false, 
                message: 'Review ID is required' 
            },
            { status: 400 }
        );
    }

    const endpoint = `/v1/reviews/${id}`;
    return forwardRequest(req, endpoint);
}

/**
 * DELETE /api/reviews/[id]
 * Delete a review (patient only)
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return Response.json(
            { 
                status: false, 
                message: 'Review ID is required' 
            },
            { status: 400 }
        );
    }

    const endpoint = `/v1/reviews/${id}`;
    return forwardRequest(req, endpoint);
}

/**
 * GET /api/reviews/[id]
 * Get a specific review by ID
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) {
        return Response.json(
            { 
                status: false, 
                message: 'Review ID is required' 
            },
            { status: 400 }
        );
    }

    const endpoint = `/v1/reviews/${id}`;
    return forwardRequest(req, endpoint);
}
