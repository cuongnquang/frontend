import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/", "auth/login", "auth/register", "auth/forgot-password"];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Nếu route công khai thì cho qua
    if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    // Lấy token từ cookie
    const token = req.cookies.get("token")?.value;

    if (!token) {
        // Nếu chưa đăng nhập thì redirect về login
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    try {
        // Giải mã token để lấy role
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
            role: "patient" | "doctor" | "admin";
        };

        // Role-based routing
        if (pathname.startsWith("/client") && decoded.role !== "patient") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (pathname.startsWith("/doctor") && decoded.role !== "doctor") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        if (pathname.startsWith("/admin") && decoded.role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.next();
    } catch (err) {
        console.error("JWT error:", err);
        return NextResponse.redirect(new URL("auth/login", req.url));
    }
}

// Áp dụng middleware cho tất cả routes trừ static files
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
    ],
};
