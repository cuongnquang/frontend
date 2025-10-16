import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Lấy tokens từ cookies
    const refreshToken = req.cookies.get("nestjs_refresh_token")?.value;
    const csrfToken = req.cookies.get("csrfToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { message: "Thiếu refresh token" },
        { status: 401 }
      );
    }

    if (!csrfToken) {
      return NextResponse.json(
        { message: "Thiếu CSRF token" },
        { status: 403 }
      );
    }

    const backendRes = await fetch(`${process.env.BACKEND_API_URL}/v1/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
        "Cookie": `nestjs_refresh_token=${refreshToken}`, // Backend đọc từ đây
      },
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({
        message: "Backend trả về lỗi không phải JSON.",
      }));
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();

    const response = NextResponse.json(data, { status: backendRes.status });

    // Chỉ xử lý khi refresh thành công
    if (backendRes.ok && data.data) {
      // Forward refresh token mới từ backend
      const setCookieHeader = backendRes.headers.get("set-cookie");
      if (setCookieHeader) {
        
        // Extract cookie name và value chính xác
        const match = setCookieHeader.match(/nestjs_refresh_token=([^;]+)/);
        if (match) {
          response.cookies.set("nestjs_refresh_token", match[1], {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60,
          });
        }
      }

      // Set accessToken mới
      response.cookies.set("accessToken", data.data.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: data.data.expiresAt,
      });

      // Set csrfToken mới
      response.cookies.set("csrfToken", data.data.csrfToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: data.data.expiresAt,
      });
    } else {
      // Refresh thất bại → xóa tất cả cookies
      console.log('Refresh failed, clearing cookies');
      response.cookies.delete("nestjs_refresh_token");
      response.cookies.delete("accessToken");
      response.cookies.delete("csrfToken");
    }

    return response;
  } catch (error) {
    console.error("Refresh token error:", error);
    
    const response = NextResponse.json(
      { message: "Không thể làm mới token", error: String(error) },
      { status: 500 }
    );
    
    // Xóa cookies khi có lỗi
    response.cookies.delete("nestjs_refresh_token");
    response.cookies.delete("accessToken");
    response.cookies.delete("csrfToken");
    
    return response;
  }
}