import * as XLSX from 'xlsx'

// Export to Excel
export const exportToExcel = (data: any[], fileName: string, sheetName: string = 'Sheet1') => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    XLSX.writeFile(workbook, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`)
}

// Export to CSV
export const exportToCSV = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(worksheet)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

// Export to PDF (using browser print)
export const exportToPDF = (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId)
    if (!element) return

    const printWindow = window.open('', '', 'height=600,width=800')
    if (!printWindow) return

    printWindow.document.write('<html><head><title>' + fileName + '</title>')
    printWindow.document.write(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin-top: 20px; }
      th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      th { background-color: #4472c4; color: white; }
      h1 { color: #2563eb; }
      .header { margin-bottom: 20px; }
      .footer { margin-top: 20px; text-align: center; font-size: 12px; color: #666; }
    </style>
  `)
    printWindow.document.write('</head><body>')
    printWindow.document.write('<div class="header"><h1>YouMed - Báo cáo</h1></div>')
    printWindow.document.write(element.innerHTML)
    printWindow.document.write('<div class="footer">In lúc: ' + new Date().toLocaleString('vi-VN') + '</div>')
    printWindow.document.write('</body></html>')
    printWindow.document.close()

    setTimeout(() => {
        printWindow.print()
        printWindow.close()
    }, 250)
}

// Format data for export
export const formatDataForExport = (data: any[], type: 'doctors' | 'patients' | 'appointments' | 'revenue') => {
    switch (type) {
        case 'doctors':
            return data.map(d => ({
                'Mã BS': d.id,
                'Họ và tên': d.name,
                'Email': d.email,
                'Số điện thoại': d.phone,
                'Chuyên khoa': d.specialization,
                'Trình độ': d.qualification,
                'Kinh nghiệm (năm)': d.experience,
                'Phí khám (VNĐ)': d.consultationFee,
                'Đánh giá': d.rating,
                'Tổng BN': d.totalPatients,
                'Trạng thái': d.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'
            }))

        case 'patients':
            return data.map(p => ({
                'Mã BN': p.id,
                'Họ và tên': p.name,
                'Email': p.email,
                'Số điện thoại': p.phone,
                'Ngày sinh': p.dateOfBirth,
                'Giới tính': p.gender === 'male' ? 'Nam' : 'Nữ',
                'Địa chỉ': p.address,
                'Số BHYT': p.insuranceNumber,
                'Nhóm máu': p.bloodType,
                'Lượt khám': p.totalVisits,
                'Mức rủi ro': p.riskLevel === 'low' ? 'Thấp' : p.riskLevel === 'medium' ? 'Trung bình' : 'Cao'
            }))

        case 'appointments':
            return data.map(a => ({
                'Mã lịch hẹn': a.id,
                'Bệnh nhân': a.patientName,
                'Bác sĩ': a.doctorName,
                'Ngày khám': a.appointmentDate,
                'Giờ khám': a.appointmentTime,
                'Loại khám': a.type,
                'Triệu chứng': a.symptoms,
                'Trạng thái': a.status === 'confirmed' ? 'Đã xác nhận' :
                    a.status === 'completed' ? 'Hoàn thành' :
                        a.status === 'cancelled' ? 'Đã hủy' : 'Chờ xác nhận',
                'Phòng': a.room
            }))

        case 'revenue':
            return data.map(r => ({
                'Ngày': r.date,
                'Doanh thu (VNĐ)': r.revenue,
                'Số lượt khám': r.appointments,
                'Bệnh nhân mới': r.newPatients,
                'Chi phí (VNĐ)': r.expenses,
                'Lợi nhuận (VNĐ)': r.profit
            }))

        default:
            return data
    }
}