import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Temporary stub: backend does not expose a dedicated medical-records endpoint yet.
// Return empty array so frontend profile page can display "no records" instead of 404.

export async function GET(req: NextRequest) {
    return NextResponse.json([], { status: 200 });
}
