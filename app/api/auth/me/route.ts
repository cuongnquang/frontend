import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Lấy accessToken từ cookies
    const accessToken = req.cookies.get("accessToken")?.value;

    // Gọi backend
    const backendRes = await fetch(`${process.env.BACKEND_API_URL}/v1/auth/profile`, {
      method: "GET",
      headers: {
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({
        message: "Backend trả về lỗi không phải JSON.",
      }));
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    // Parse response
    const data = await backendRes.json();
    
    // Forward response với status code từ backend
    return NextResponse.json(data, { status: backendRes.status });

  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { message: "Lỗi kết nối backend", error: String(error) },
      { status: 500 }
    );
  }
}