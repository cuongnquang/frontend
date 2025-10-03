'use client'

import { useState } from 'react'
import { BarChart3 } from 'lucide-react' // Chỉ giữ lại icon cần dùng trong component gốc
import ReportPageHeader from '@/components/admin/reports/ReportPageHeader'
import ReportStatistics from '@/components/admin/reports/ReportStatistics'
import TopPerformers from '@/components/admin/reports/TopPerformers'

export default function AdminReports() {
    const [dateRange, setDateRange] = useState('month')
    // const [reportType, setReportType] = useState('overview') // Không dùng đến, có thể xóa

    // --- Mock Data ---
    const overviewStats = {
        revenue: {
            current: 45000000,
            previous: 38000000,
            change: 18.4
        },
        appointments: {
            current: 450,
            previous: 390,
            change: 15.4
        },
        newPatients: {
            current: 85,
            previous: 72,
            change: 18.1
        },
        satisfaction: {
            current: 4.8,
            previous: 4.6,
            change: 4.3
        }
    }

    const recentReports = [
        {
            id: 1,
            name: 'Báo cáo doanh thu tháng 1/2024',
            type: 'Tài chính',
            createdDate: '2024-02-01',
            size: '2.5 MB',
            status: 'completed'
        },
        {
            id: 2,
            name: 'Thống kê bệnh nhân tháng 1/2024',
            type: 'Bệnh nhân',
            createdDate: '2024-02-01',
            size: '1.8 MB',
            status: 'completed'
        },
        {
            id: 3,
            name: 'Báo cáo hiệu suất bác sĩ Q4/2023',
            type: 'Nhân sự',
            createdDate: '2024-01-15',
            size: '3.2 MB',
            status: 'completed'
        }
    ]

    const topDoctors = [
        { name: 'BS. Nguyễn Văn An', patients: 125, revenue: 12500000, rating: 4.9 },
        { name: 'BS. Trần Thị Bình', patients: 98, revenue: 9800000, rating: 4.8 },
        { name: 'PGS.TS Lê Văn Cường', patients: 87, revenue: 15400000, rating: 5.0 }
    ]

    const topServices = [
        { name: 'Khám tim mạch', count: 245, revenue: 12250000 },
        { name: 'Khám nhi khoa', count: 189, revenue: 7560000 },
        { name: 'Khám tổng quát', count: 156, revenue: 7800000 }
    ]

    const handleExport = () => {
        console.log(`Xuất báo cáo loại ${dateRange} đang được chọn...`)
        // Logic gọi API hoặc tạo file báo cáo
    }

    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">

            {/* 1. Header & Actions */}
            <ReportPageHeader
                dateRange={dateRange}
                setDateRange={setDateRange}
                onExport={handleExport}
            />

            {/* 2. Overview Stats */}
            <ReportStatistics overviewStats={overviewStats} />

            {/* 3. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">Biểu đồ doanh thu theo ngày/tuần</h3>
                        <BarChart3 className="w-5 h-5 text-gray-400" />
                    </div>
                    {/* Placeholder cho Biểu đồ Cột/Đường thực tế (nên dùng thư viện như Recharts/Nivo) */}
                    <div className="h-64 flex items-end justify-between space-x-2 border-b border-l pb-2 pl-2">
                        {[65, 80, 70, 90, 85, 95, 88].map((height, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center group cursor-pointer" title={`Doanh thu ngày/tuần ${index + 1}: ${height}M`}>
                                <div
                                    className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors relative"
                                    style={{ height: `${height}%` }}
                                />
                                <span className="text-xs text-gray-500 mt-2">T{index + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Services Chart (Đã chuyển sang TopPerformers để dễ quản lý bố cục) */}
                {/* Giữ lại đây nếu muốn tách riêng TopPerformers chỉ cho Doctors và Reports */}
                {/* Trong trường hợp này, tôi đã gộp TopServices vào TopPerformers để tiết kiệm không gian */}

            </div>

            {/* 4. Top Performers & Recent Reports */}
            <TopPerformers
                topDoctors={topDoctors}
                recentReports={recentReports}
                topServices={topServices}
            />

        </div>
    )
}