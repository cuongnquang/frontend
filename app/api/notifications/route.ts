
import { NextResponse } from 'next/server';

const notifications = [
    {
        id: 1,
        type: 'new_patient',
        text: 'Bệnh nhân mới "Trần Văn Sỹ" đã đăng ký.',
        time: '5 phút trước',
        isRead: false,
    },
    {
        id: 2,
        type: 'appointment_confirmed',
        text: 'Lịch hẹn #LH005 đã được xác nhận.',
        time: '1 giờ trước',
        isRead: false,
    },
    {
        id: 3,
        type: 'report_generated',
        text: 'Báo cáo tháng 2 đã được tạo thành công.',
        time: 'Hôm qua',
        isRead: true,
    },
    {
        id: 4,
        type: 'appointment_cancelled',
        text: 'Lịch hẹn #LH004 đã bị hủy.',
        time: '2 ngày trước',
        isRead: true,
    }
];

export async function GET() {
    return NextResponse.json(notifications);
}
