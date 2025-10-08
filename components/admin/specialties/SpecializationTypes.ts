export interface Specialization {
    id: string;
    name: string; // Tên chuyên khoa (ví dụ: "Nội khoa", "Nhi khoa")
    description: string; // Mô tả ngắn về chuyên khoa
    leadDoctor: string; // Tên trưởng khoa
    totalDoctors: number; // Tổng số bác sĩ thuộc chuyên khoa này
    avgRating: number; // Đánh giá trung bình của các bác sĩ trong khoa
    colorCode: string; // Mã màu để phân biệt (ví dụ: #4f46e5)
}

// Dữ liệu giả định để hiển thị
export const mockSpecializations: Specialization[] = [
    {
        id: 'SP001',
        name: 'Nội Tim mạch',
        description: 'Chẩn đoán và điều trị các bệnh về tim mạch, mạch máu.',
        leadDoctor: 'TS.BS. Nguyễn Văn A',
        totalDoctors: 15,
        avgRating: 4.8,
        colorCode: '#ef4444', // Red
    },
    {
        id: 'SP002',
        name: 'Nhi khoa',
        description: 'Chăm sóc sức khỏe và điều trị bệnh cho trẻ em.',
        leadDoctor: 'GS.BS. Trần Thị B',
        totalDoctors: 22,
        avgRating: 4.7,
        colorCode: '#22c55e', // Green
    },
    {
        id: 'SP003',
        name: 'Chấn thương Chỉnh hình',
        description: 'Điều trị các vấn đề về cơ xương khớp, chấn thương.',
        leadDoctor: 'PGS.BS. Lê Văn C',
        totalDoctors: 18,
        avgRating: 4.5,
        colorCode: '#3b82f6', // Blue
    },
    {
        id: 'SP004',
        name: 'Da liễu',
        description: 'Chẩn đoán và điều trị các bệnh về da, tóc, móng.',
        leadDoctor: 'BSCKI. Phạm Thị D',
        totalDoctors: 10,
        avgRating: 4.9,
        colorCode: '#f97316', // Orange
    },
];