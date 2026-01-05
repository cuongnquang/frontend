import { NextRequest, NextResponse } from "next/server";

export async function forwardRequest(req: NextRequest, endpoint: string) {
    const authorizationHeader = req.headers.get("Authorization");
    const contentTypeHeader = req.headers.get("Content-Type");
    
    // Get token from cookies if Authorization header is not present
    const accessToken = req.cookies.get("accessToken")?.value;

    const headersToForward: HeadersInit = {};
    if (authorizationHeader) {
        headersToForward["Authorization"] = authorizationHeader;
        const tokenPreview = authorizationHeader.substring(0, 50);
        console.debug(`[API Proxy] Authorization: ${tokenPreview}...`);
    } else if (accessToken) {
        // Use token from cookies if Authorization header is missing
        headersToForward["Authorization"] = `Bearer ${accessToken}`;
        console.debug(`[API Proxy] Authorization from cookie: ${accessToken.substring(0, 20)}...`);
    } else {
        console.warn('[API Proxy] WARNING: No Authorization header or accessToken cookie found in request');
    }
    if (contentTypeHeader) {
        headersToForward["Content-Type"] = contentTypeHeader;
    }

    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
        console.error('[API Proxy] ERROR: BACKEND_API_URL is not configured');
        return NextResponse.json(
            { 
                status: false,
                message: "BACKEND_API_URL is not configured. Vui lòng kiểm tra file .env.local" 
            },
            { status: 500 }
        );
    }

    const fullUrl = `${backendUrl.replace(/\/$/, '')}${endpoint}`;
    // console.log(`[API Proxy] ${req.method} ${fullUrl}`);
    
    try {
        let body: BodyInit | null = null;
        if (req.method !== "GET" && req.method !== "HEAD") {
            body = req.body;
        }

        const backendRes = await fetch(fullUrl, {
            method: req.method,
            headers: headersToForward,
            body,
            duplex: "half",
        } as RequestInit);

        if (!backendRes.ok) {
            const errorData = await backendRes.json().catch(() => null);
            // console.error(`[API Proxy] ${req.method} ${fullUrl} returned ${backendRes.status}:`, 
            //   JSON.stringify(errorData).substring(0, 200));
            return NextResponse.json(
                errorData || { message: "Lỗi từ server backend." },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json().catch(() => null);
        // console.log(`[API Proxy] ${req.method} ${fullUrl} returned 200 OK`);
        return NextResponse.json(data, { status: backendRes.status });
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error(`[API Proxy Error] ${req.method} ${fullUrl}:`, errorMessage);
        return NextResponse.json(
            {
                status: false,
                message: errorMessage.includes('fetch') || errorMessage.includes('Network')
                    ? "Không thể kết nối đến server backend. Vui lòng kiểm tra BACKEND_API_URL và đảm bảo backend đang chạy."
                    : "Lỗi kết nối đến server backend.",
                error: errorMessage,
            },
            { status: 500 }
        );
    }
}
