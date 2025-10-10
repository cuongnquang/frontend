import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Các route cần bảo vệ
  const protectedRoutes = ["/dashboard", "/profile", "/admin"];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !accessToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Nếu đã đăng nhập, không cho vào trang login/register
  if ((pathname === "/auth/login" || pathname === "/auth/register") && accessToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*", "/auth/login", "/auth/register"],
};