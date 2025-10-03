// utils/appointment.ts

/**
 * Tạo một mảng các đối tượng Date cho 14 ngày sắp tới để hiển thị lịch.
 * @returns {Date[]} Mảng 14 đối tượng Date.
 */
export const generateCalendarDays = (): Date[] => {
    const today = new Date()
    const days: Date[] = []
    for (let i = 0; i < 14; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        days.push(date)
    }
    return days
}

/**
 * Định dạng đối tượng Date thành chuỗi ngày tháng dễ đọc.
 * @param {Date | null} date Đối tượng Date cần định dạng.
 * @returns {string} Chuỗi ngày tháng theo định dạng 'Thứ Ba, 25/10/2025'
 */
export const formatDate = (date: Date | null): string => {
    if (!date) return 'Chưa chọn ngày'
    return date.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).replace(/,/, ', ') // Thêm khoảng trắng sau dấu phẩy
}