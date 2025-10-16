import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const accessToken = req.cookies.get("accessToken")?.value;
    const { id } = await context.params;

    try {
        const backendRes = await fetch(`${process.env.BACKEND_API_URL}/v1/specialties/${id}`, {
            method: "GET",
            headers: {
                 ...(accessToken && { Authorization: `Bearer ${accessToken}` }), 
                "Content-Type": "application/json",
            },
        })

        if (!backendRes.ok) {
            const errorData = await backendRes.json().catch(() => ({
                message: "Backend trả về lỗi không phải JSON.",
            }))
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

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const accessToken = req.cookies.get("accessToken")?.value;
    const { id } = await context.params;

    try {
        const body = await req.json()

        const backendRes = await fetch(`${process.env.BACKEND_API_URL}/v1/specialties/${id}`, {
            method: "PUT",
            headers: {
                 ...(accessToken && { Authorization: `Bearer ${accessToken}` }), 
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        if (!backendRes.ok) {
            const errorData = await backendRes.json().catch(() => ({
                message: "Backend trả về lỗi không phải JSON.",
            }))
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

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const accessToken = req.cookies.get("accessToken")?.value;
    const { id } = await context.params;

    try {
        
        const body = await req.json()

        const backendRes = await fetch(`${process.env.BACKEND_API_URL}/v1/specialties/${id}`, {
            method: "PATCH",
            headers: {
                 ...(accessToken && { Authorization: `Bearer ${accessToken}` }), 
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        })

        if (!backendRes.ok) {
            const errorData = await backendRes.json().catch(() => ({
                message: "Backend trả về lỗi không phải JSON.",
            }))
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


export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {

    const accessToken = req.cookies.get("accessToken")?.value;
    const { id } = await context.params;

    try {
        const backendRes = await fetch(`${process.env.BACKEND_API_URL}/v1/specialties/${id}`, {
            method: "DELETE",
            headers: {
                 ...(accessToken && { Authorization: `Bearer ${accessToken}` }), 
                "Content-Type": "application/json",
            },
        })

        if (!backendRes.ok) {
            const errorData = await backendRes.json().catch(() => ({
                message: "Backend trả về lỗi không phải JSON.",
            }))
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