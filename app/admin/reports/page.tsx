'use client'

import { useState } from 'react'
import { ExportReportModal } from '@/components/admin/reports/form/ExportReport'
import {
    FileText,
    Download,
    Calendar,
    TrendingUp,
    Users,
    DollarSign,
    Activity,

    RefreshCw
} from 'lucide-react'

export default function AdminReportsEnhanced() {
    const [dateRange, setDateRange] = useState('month')
    const [showExportModal, setShowExportModal] = useState(false)
    const [selectedReport, setSelectedReport] = useState<{
        type: 'doctors' | 'patients' | 'appointments' | 'revenue'
        data: any[]
        title: string
    } | null>(null)

    const revenueData = [
        { date: '2024-02-01', revenue: 15000000, appointments: 45, newPatients: 12, expenses: 5000000, profit: 10000000 },
        { date: '2024-02-02', revenue: 18000000, appointments: 52, newPatients: 15, expenses: 6000000, profit: 12000000 },
        { date: '2024-02-03', revenue: 16000000, appointments: 48, newPatients: 10, expenses: 5500000, profit: 10500000 }
    ]

    const reportTypes = {
        id: 'revenue',
        title: 'Báo cáo Doanh thu',
        description: 'Chi tiết doanh thu, chi phí và lợi nhuận',
        icon: DollarSign,
        color: 'bg-green-100 text-green-600',
        data: revenueData,
        type: 'revenue' as const
    }



    const handleExportReport = (report: typeof reportTypes) => {
        setSelectedReport({
            type: report.type,
            data: report.data,
            title: report.title
        })
        setShowExportModal(true)
    }

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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
                    <p className="text-gray-600">Phân tích dữ liệu và xuất báo cáo chi tiết</p>
                </div>
                <div className="flex space-x-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
                    >
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="quarter">Quý này</option>
                        <option value="year">Năm này</option>
                        <option value="custom">Tùy chỉnh</option>
                    </select>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center" onClick={() => handleExportReport(reportTypes)}>
                        <Download className='w-4 h-4 mr-2' />
                        Xuất báo cáo
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-100 text-green-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="flex items-center text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{overviewStats.revenue.change}%</span>
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Doanh thu</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        ₫{(overviewStats.revenue.current / 1000000).toFixed(1)}M
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div className="flex items-center text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{overviewStats.appointments.change}%</span>
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Lượt khám</h3>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.appointments.current}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div className="flex items-center text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{overviewStats.newPatients.change}%</span>
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Bệnh nhân mới</h3>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.newPatients.current}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div className="flex items-center text-green-600">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">{overviewStats.satisfaction.change}%</span>
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Đánh giá TB</h3>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.satisfaction.current}/5</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Biểu đồ doanh thu</h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm">
                                Xem chi tiết
                            </button>
                        </div>
                        <div className="h-64 flex items-end justify-between space-x-2">
                            {[65, 80, 70, 90, 85, 95, 88].map((height, index) => (
                                <div key={index} className="flex-1 flex flex-col items-center">
                                    <div
                                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-pointer"
                                        style={{ height: `${height}%` }}
                                        title={`Tuần ${index + 1}: ${height}%`}
                                    />
                                    <span className="text-xs text-gray-500 mt-2">T{index + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Thống kê theo chuyên khoa</h3>
                            <button className="text-blue-600 hover:text-blue-700 text-sm">
                                Xem chi tiết
                            </button>
                        </div>
                        <div className="space-y-4">
                            {[
                                { name: 'Tim mạch', value: 245, color: 'bg-blue-500' },
                                { name: 'Nhi khoa', value: 189, color: 'bg-green-500' },
                                { name: 'Da liễu', value: 156, color: 'bg-yellow-500' },
                                { name: 'Ngoại khoa', value: 132, color: 'bg-purple-500' }
                            ].map((item, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                        <span className="text-sm text-gray-600">{item.value} lượt</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all`}
                                            style={{ width: `${(item.value / 245) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Lịch sử xuất báo cáo</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {[
                                {
                                    name: 'Báo cáo doanh thu tháng 1/2024',
                                    type: 'Excel',
                                    date: '2024-02-01 10:30',
                                    size: '2.5 MB',
                                    user: 'Admin System'
                                },
                                {
                                    name: 'Thống kê bệnh nhân Q4/2023',
                                    type: 'PDF',
                                    date: '2024-01-15 14:20',
                                    size: '1.8 MB',
                                    user: 'Admin System'
                                },
                                {
                                    name: 'Báo cáo hiệu suất bác sĩ',
                                    type: 'CSV',
                                    date: '2024-01-10 09:15',
                                    size: '856 KB',
                                    user: 'Admin System'
                                }
                            ].map((report, index) => (
                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900">{report.name}</h4>
                                            <p className="text-sm text-gray-600">
                                                {report.type} • {report.date} • {report.size} • Bởi {report.user}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-blue-600 hover:text-blue-700">
                                        <Download className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showExportModal && selectedReport && (
                <ExportReportModal
                    isOpen={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    reportType={selectedReport.type}
                    data={selectedReport.data}
                    title={selectedReport.title}
                />
            )}
        </div>
    )
}