import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

/**
 * POST /api/review-helpful
 * Vote on a review (helpful/not helpful)
 */
export async function POST(req: NextRequest) {
    return forwardRequest(req, `/v1/review-helpful`);
}

/**
 * GET /api/review-helpful?action=xxx&review_id=xxx&patient_id=xxx
 * Get helpful stats, check vote, or get patient vote
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const review_id = searchParams.get('review_id');
    const patient_id = searchParams.get('patient_id');
    const action = searchParams.get('action'); // 'stats', 'check', 'vote'

    if (!review_id) {
        return Response.json(
            {
                status: false,
                message: 'review_id is required'
            },
            { status: 400 }
        );
    }

    let endpoint = '';

    if (action === 'stats') {
        // Get helpful/unhelpful stats
        endpoint = `/v1/review-helpful/stats/${review_id}`;
    } else if (action === 'check' && patient_id) {
        // Check if patient has voted
        endpoint = `/v1/review-helpful/check/${review_id}/${patient_id}`;
    } else if (action === 'vote' && patient_id) {
        // Get patient's vote
        endpoint = `/v1/review-helpful/${review_id}/${patient_id}`;
    } else {
        return Response.json(
            {
                status: false,
                message: 'Invalid action or missing parameters'
            },
            { status: 400 }
        );
    }

    return forwardRequest(req, endpoint);
}

/**
 * DELETE /api/review-helpful?review_id=xxx&patient_id=xxx
 * Delete a vote on a review
 */
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const review_id = searchParams.get('review_id');
    const patient_id = searchParams.get('patient_id');

    if (!review_id || !patient_id) {
        return Response.json(
            {
                status: false,
                message: 'review_id and patient_id are required'
            },
            { status: 400 }
        );
    }

    return forwardRequest(req, `/v1/review-helpful/${review_id}/${patient_id}`, {
        method: 'DELETE'
    });
}
