import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const backendRes = await fetch(
      `${process.env.BACKEND_API_URL}/v1/auth/resend-verification`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({
        message: "Backend trả về lỗi không phải JSON.",
      }));
      return NextResponse.json(errorData, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        message: "Lỗi kết nối đến server backend.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}