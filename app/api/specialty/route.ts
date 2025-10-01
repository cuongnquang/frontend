import { NextRequest, NextResponse } from 'next/server';;

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const specialtyId = url.searchParams.get('id');

    try {
        const res = specialtyId
            ? await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties/${specialtyId}`)
            : await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties`);

        if (!res.ok) {
            const msg = specialtyId
                ? `Không tìm thấy chuyên khoa với ID ${specialtyId}`
                : 'Không thể lấy danh sách chuyên khoa';
            return NextResponse.json({ error: msg }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('Lỗi GET specialty:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Tạo chuyên khoa thất bại' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Lỗi POST specialty:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const url = new URL(request.url);
    const specialtyId = url.searchParams.get('id');

    if (!specialtyId) {
        return NextResponse.json({ error: 'Cần cung cấp id để cập nhật' }, { status: 400 });
    }

    try {
        const body = await request.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties/${specialtyId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Cập nhật thất bại' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Lỗi PUT specialty:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    const url = new URL(request.url);
    const specialtyId = url.searchParams.get('id');

    if (!specialtyId) {
        return NextResponse.json({ error: 'Cần cung cấp id để xóa' }, { status: 400 });
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/specialties/${specialtyId}`, {
            method: 'DELETE',
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Xóa thất bại' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Lỗi DELETE specialty:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
