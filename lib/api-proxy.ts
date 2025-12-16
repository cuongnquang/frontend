import { NextRequest, NextResponse } from "next/server";

export async function forwardRequest(req: NextRequest, endpoint: string) {
    const authorizationHeader = req.headers.get("Authorization");
    const contentTypeHeader = req.headers.get("Content-Type");

    const headersToForward: HeadersInit = {};
    if (authorizationHeader) {
        headersToForward["Authorization"] = authorizationHeader;
        const tokenPreview = authorizationHeader.substring(0, 50);
        console.debug(`[API Proxy] Authorization: ${tokenPreview}...`);
    } else {
        console.warn('[API Proxy] WARNING: No Authorization header found in request');
    }
    if (contentTypeHeader) {
        headersToForward["Content-Type"] = contentTypeHeader;
    }

    const backendUrl = process.env.BACKEND_API_URL;
    if (!backendUrl) {
        // console.error('[API Proxy] ERROR: BACKEND_API_URL is not configured');
        return NextResponse.json(
            { message: "BACKEND_API_URL is not configured" },
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
        // console.error(`[API Proxy Error] ${req.method} ${fullUrl}:`, (error as Error).message);
        return NextResponse.json(
            {
                message: "Lỗi kết nối đến server backend.",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
