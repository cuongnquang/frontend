import React from 'react'
import { Download } from 'lucide-react'

interface ReportPageHeaderProps {
    dateRange: string
    setDateRange: (range: string) => void
    onExport: () => void
}

export default function ReportPageHeader({ dateRange, setDateRange, onExport }: ReportPageHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê 📊</h1>
                <p className="text-gray-600">Phân tích dữ liệu và xuất báo cáo</p>
            </div>
            <div className="flex space-x-3">
                {/* Time Range Filter */}
                <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                    <option value="week">Tuần này</option>
                    <option value="month">Tháng này</option>
                    <option value="quarter">Quý này</option>
                    <option value="year">Năm này</option>
                </select>

                {/* Export Button */}
                <button
                    onClick={onExport}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                >
                    <Download className="w-4 h-4 mr-2" />
                    Xuất báo cáo
                </button>
            </div>
        </div>
    )
}