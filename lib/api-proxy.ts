import { NextRequest, NextResponse } from "next/server";

export async function forwardRequest(req: NextRequest, endpoint: string) {
    const authorizationHeader = req.headers.get("Authorization");
    const contentTypeHeader = req.headers.get("Content-Type");

    const headersToForward: HeadersInit = {};
    if (authorizationHeader) {
        headersToForward["Authorization"] = authorizationHeader;
    }
    if (contentTypeHeader) {
        headersToForward["Content-Type"] = contentTypeHeader;
    }

    const backendUrl = `${process.env.BACKEND_API_URL}${endpoint}`;

    try {
        const backendRes = await fetch(backendUrl, {
            method: req.method,
            headers: headersToForward,
            body: req.method === "GET" || req.method === "HEAD" ? null : req.body,
            duplex: "half",
        } as RequestInit);

        if (!backendRes.ok) {
            const errorData = await backendRes.json().catch(() => null);
            return NextResponse.json(
                errorData || { message: "Lỗi từ server backend." },
                { status: backendRes.status }
            );
        }

        const data = await backendRes.json().catch(() => null);

        return NextResponse.json(data, { status: backendRes.status });
    } catch (error) {
        console.error(`[API Proxy Error] Lỗi khi gọi ${backendUrl}:`, error);
        return NextResponse.json(
            {
                message: "Lỗi kết nối đến server backend.",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
