import { NextRequest } from "next/server";
import { forwardRequest } from "@/lib/api-proxy";

export async function GET(req: NextRequest) {

    const url = new URL(req.url);
    const searchParams = url.searchParams;
    
    // Tạo URLSearchParams mới
    const newSearchParams = new URLSearchParams();
    
    searchParams.forEach((value, key) => {
        newSearchParams.set(key, value);
    });

    return forwardRequest(req, `/v1/schedules/doctor?${newSearchParams.toString()}`);

}