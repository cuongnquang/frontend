import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Gọi đến backend
        const backendRes = await fetch(`${process.env.BACKEND_API_URL}/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include",
        });

        const data = await backendRes.json();

        // Tạo response
        const response = NextResponse.json(data, { status: backendRes.status });

        // Chỉ xử lý cookies khi đăng nhập thành công
        if (backendRes.ok && data.data) {
            // Forward refresh token cookie từ backend
            const refreshTokenCookie = backendRes.headers.get("set-cookie");
            if (refreshTokenCookie) {
                // Extract cookie value từ set-cookie header
                const match = refreshTokenCookie.match(/nestjs_refresh_token=([^;]+)/);
                if (match) {
                    response.cookies.set("nestjs_refresh_token", match[1], {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                        maxAge: 30 * 24 * 60 * 60, // 30 ngày
                    });
                }
            }

            // Set accessToken (có thể đọc từ client)
            response.cookies.set("accessToken", data.data.accessToken, {
                httpOnly: false, // Client cần đọc để gửi trong Authorization header
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: data.data.expiresAt,
            });

            // Set csrfToken (client cần đọc để gửi trong x-csrf-token header)
            response.cookies.set("csrfToken", data.data.csrfToken, {
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: data.data.expiresAt,
            });
        }

        return response;

    } catch (error) {
        console.error("Login API route error:", error);
        return NextResponse.json(
            { message: "Lỗi kết nối phía server Next.js", error: String(error) },
            { status: 500 }
        );
    }
}