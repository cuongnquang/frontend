import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

/**
 * GET /api/reviews/doctor/[id]
 * Get all reviews for a specific doctor
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const skip = searchParams.get('skip') || '0';
    const take = searchParams.get('take') || '10';

    if (!id) {
        return Response.json(
            { 
                status: false, 
                message: 'Doctor ID is required' 
            },
            { status: 400 }
        );
    }

    const endpoint = `/v1/reviews/doctor/${id}?skip=${skip}&take=${take}`;
    return forwardRequest(req, endpoint);
}
