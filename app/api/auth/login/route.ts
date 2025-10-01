import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            credentials: "include", // để nhận cookie từ BE (nếu có)
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(
                { error: data.message || data.error || "Đăng nhập thất bại" },
                { status: res.status }
            );
        }


        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error("Login API error:", err);
        return NextResponse.json(
            { error: "Server error khi đăng nhập" },
            { status: 500 }
        );
    }
}
