import { forwardRequest } from "@/lib/api-proxy";
import { NextRequest } from "next/server";

/**
 * POST /api/reviews
 * Create a new review for a doctor
 */
export async function POST(req: NextRequest) {
    return forwardRequest(req, `/v1/reviews`);
}

/**
 * GET /api/reviews?doctor_id=xxx&action=xxx
 * Get reviews for a doctor or patient
 */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const doctor_id = searchParams.get('doctor_id');
    const patient_id = searchParams.get('patient_id');
    const action = searchParams.get('action'); // 'doctor', 'patient', 'pending', 'helpful'
    const skip = searchParams.get('skip') || '0';
    const take = searchParams.get('take') || '10';
    const limit = searchParams.get('limit') || '5';
    const keyword = searchParams.get('keyword');

    let endpoint = '';

    if (action === 'doctor' && doctor_id) {
        endpoint = `/v1/reviews/doctor/${doctor_id}?skip=${skip}&take=${take}`;
    } else if (action === 'patient' && patient_id) {
        endpoint = `/v1/reviews/patient/${patient_id}`;
    } else if (action === 'pending') {
        endpoint = `/v1/reviews/pending/list?skip=${skip}&take=${take}`;
    } else if (action === 'helpful' && doctor_id) {
        endpoint = `/v1/reviews/doctor/${doctor_id}/helpful?limit=${limit}`;
    } else if (action === 'search' && doctor_id && keyword) {
        endpoint = `/v1/reviews/search/${doctor_id}?keyword=${encodeURIComponent(keyword)}`;
    } else if (doctor_id) {
        // Default to doctor reviews
        endpoint = `/v1/reviews/doctor/${doctor_id}?skip=${skip}&take=${take}`;
    } else {
        return Response.json(
            { 
                status: false, 
                message: 'Missing required parameters' 
            },
            { status: 400 }
        );
    }

    return forwardRequest(req, endpoint);
}
