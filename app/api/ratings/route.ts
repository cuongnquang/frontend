import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

/**
 * POST /api/ratings
 * Create or update a rating for a doctor
 */
export async function POST(req: NextRequest) {
    return forwardRequest(req, `/v1/ratings`);
}

/**
 * GET /api/ratings?doctor_id=xxx&patient_id=xxx&action=xxx
 * Get rating statistics for a doctor or check if patient rated
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const doctor_id = searchParams.get('doctor_id');
    const patient_id = searchParams.get('patient_id');
    const action = searchParams.get('action'); // 'stats' or 'check'

    if (!doctor_id) {
        return Response.json(
            { 
                status: false, 
                message: 'doctor_id is required' 
            },
            { status: 400 }
        );
    }

    let endpoint = `/v1/ratings/doctor/${doctor_id}`;

    if (action === 'stats') {
        endpoint = `/v1/ratings/doctor/${doctor_id}/stats`;
    } else if (action === 'check' && patient_id) {
        endpoint = `/v1/ratings/check/${doctor_id}/${patient_id}`;
    }

    return forwardRequest(req, endpoint);
}
