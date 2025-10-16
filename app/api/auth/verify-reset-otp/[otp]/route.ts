import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ otp: string }> }) {

  const { otp } = await context.params;

  try {

    const backendRes = await fetch(`${process.env.BACKEND_API_URL}/v1/auth/verify-reset-otp/${otp}`);
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