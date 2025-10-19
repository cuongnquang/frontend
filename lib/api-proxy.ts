import { NextRequest, NextResponse } from "next/server";

export async function forwardRequest(req: NextRequest, endpoint: string) {
    // Start by forwarding most incoming headers (except host)
    const headersToForward: HeadersInit = {};
    for (const [key, value] of req.headers.entries()) {
        if (key.toLowerCase() === 'host') continue;
        // keep header as-is
        headersToForward[key] = value as string;
    }

    // Ensure Authorization is forwarded. If missing, try to build from accessToken cookie.
    if (!headersToForward['authorization']) {
        const accessToken = req.cookies.get('accessToken')?.value;
        if (accessToken) headersToForward['authorization'] = `Bearer ${accessToken}`;
    }

    // If cookie header is missing, build it from known cookies so backend sees session tokens
    if (!headersToForward['cookie']) {
        const cookieParts: string[] = [];
        const names = ['accessToken', 'nestjs_refresh_token', 'csrfToken'];
        for (const n of names) {
            const v = req.cookies.get(n)?.value;
            if (v) cookieParts.push(`${n}=${v}`);
        }
        if (cookieParts.length) headersToForward['cookie'] = cookieParts.join('; ');
    }

    // Optional: use a server-side service token for public read endpoints if configured.
    // This helps when the backend restricts some endpoints but you want the frontend to read them
    // without requiring every user to have a privileged token. Set BACKEND_SERVICE_TOKEN in env.
    try {
        if (typeof process !== 'undefined' && process.env.BACKEND_SERVICE_TOKEN && req.method === 'GET' && endpoint.startsWith('/v1/specialties')) {
            headersToForward['authorization'] = `Bearer ${process.env.BACKEND_SERVICE_TOKEN}`;
        }
    } catch (_) {
        // ignore
    }

    const backendUrl = `${process.env.BACKEND_API_URL}${endpoint}`;

    try {
        const body = req.method === "GET" || req.method === "HEAD" ? null : await req.arrayBuffer().catch(() => null);

        const backendRes = await fetch(backendUrl, {
            method: req.method,
            headers: headersToForward,
            body: (body as unknown) as BodyInit | null,
            // include credentials when calling backend in case backend checks origin/session
            credentials: "include",
            duplex: "half",
        } as RequestInit);

        if (!backendRes.ok) {
            const text = await backendRes.text().catch(() => null);
            console.error(`[API Proxy] ${backendRes.status} from ${backendUrl}`);
            console.error('Forwarded headers:', headersToForward);
            if (text) {
                try {
                    const parsed = JSON.parse(text);
                    console.error('Backend response (json):', parsed);
                    return NextResponse.json(parsed, { status: backendRes.status });
                } catch {
                    console.error('Backend response (text):', text);
                    return NextResponse.json({ message: text }, { status: backendRes.status });
                }
            }
            return NextResponse.json({ message: 'Lỗi từ server backend.' }, { status: backendRes.status });
        }

        const dataText = await backendRes.text().catch(() => null);
        try {
            const parsed = dataText ? JSON.parse(dataText) : null;
            return NextResponse.json(parsed, { status: backendRes.status });
        } catch {
            return NextResponse.json({ data: dataText }, { status: backendRes.status });
        }
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
