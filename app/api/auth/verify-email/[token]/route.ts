import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const backendRes = await fetch(
      `${process.env.BACKEND_API_URL}/v1/auth/verify-email/${params.token}`
    );

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error) {
    return NextResponse.json(
      { message: "Lỗi kết nối", error: String(error) },
      { status: 500 }
    );
  }
}