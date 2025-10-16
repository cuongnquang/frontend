import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Decode token để lấy role
  let userRole: string | null = null;
  if (accessToken) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key");
      const { payload } = await jwtVerify(accessToken, secret);
      userRole = payload.role as string;
    } catch (error) {
      // Token không hợp lệ, xóa token và redirect về login
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete("accessToken");
      return response;
    }
  }

  // Các route cần bảo vệ theo role
  const adminRoutes = ["/admin"];
  const doctorRoutes = ["/doctor"];
  const protectedRoutes = ["/dashboard", "/profile"];

  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isDoctorRoute = doctorRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Kiểm tra authentication cho protected routes
  if (!accessToken && (isProtectedRoute || isAdminRoute || isDoctorRoute)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Kiểm tra authorization - chỉ admin mới vào được admin routes
  if (isAdminRoute && accessToken && userRole?.toLowerCase() !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Kiểm tra authorization - chỉ doctor mới vào được doctor routes
  if (isDoctorRoute && accessToken && userRole?.toLowerCase() !== "doctor") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // KHÔNG redirect khi user đã đăng nhập truy cập /auth/login hoặc /auth/register
  // Để AuthContext xử lý redirect theo role sau khi login thành công

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/profile/:path*", 
    "/admin/:path*", 
    "/doctor/:path*",
    "/auth/login", 
    "/auth/register"
  ],
};