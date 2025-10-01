import { NextRequest, NextResponse } from 'next/server';


// GET: Lấy danh sách tất cả bác sĩ
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const doctorId = url.searchParams.get('id'); // Lấy id từ query param ?id=123

    try {
        let res, data;

        if (doctorId) {
            // Lấy bác sĩ theo id
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${doctorId}`);
            if (!res.ok) {
                return NextResponse.json({ error: `Không tìm thấy bác sĩ với ID ${doctorId}` }, { status: res.status });
            }
            data = await res.json();
        } else {
            // Lấy tất cả bác sĩ
            res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`);
            if (!res.ok) {
                return NextResponse.json({ error: 'Không thể lấy danh sách bác sĩ' }, { status: res.status });
            }
            data = await res.json();
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Lỗi khi gọi API doctor:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// POST: Tạo mới bác sĩ
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Tạo bác sĩ thất bại' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Lỗi khi tạo bác sĩ:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// PUT: Cập nhật bác sĩ theo id
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing doctor id' }, { status: 400 });

        const body = await request.json();

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`, {
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
        console.error('Lỗi khi cập nhật bác sĩ:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}

// DELETE: Xóa bác sĩ theo id
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'Missing doctor id' }, { status: 400 });

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/doctors/${id}`, {
            method: 'DELETE',
        });

        const data = await res.json();
        if (!res.ok) {
            return NextResponse.json({ error: data.message || 'Xóa thất bại' }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (err) {
        console.error('Lỗi khi xóa bác sĩ:', err);
        return NextResponse.json({ error: 'Lỗi server' }, { status: 500 });
    }
}
