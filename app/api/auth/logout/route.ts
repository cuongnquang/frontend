import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("nestjs_refresh_token")?.value;

    if (accessToken) {
      try {
        await fetch(`${process.env.BACKEND_API_URL}/v1/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Cookie: refreshToken ? `nestjs_refresh_token=${refreshToken}` : "",
          },
        });
      } catch (backendError) {
        console.warn("Backend logout failed, proceeding with client-side cleanup:", backendError);
      }
    }

    const response = NextResponse.json({ message: "Đăng xuất thành công" });

    response.cookies.set("nestjs_refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("accessToken", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("csrfToken", "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Đăng xuất thất bại", error: String(error) },
      { status: 500 }
    );
  }
}