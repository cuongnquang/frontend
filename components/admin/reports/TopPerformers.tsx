import React from 'react'
import { FileText, Download, Activity, BarChart3 } from 'lucide-react'

interface DoctorPerformance {
    name: string
    patients: number
    revenue: number
    rating: number
}

interface RecentReport {
    id: number
    name: string
    type: string
    createdDate: string
    size: string
    status: string
}

interface TopPerformersProps {
    topDoctors: DoctorPerformance[]
    recentReports: RecentReport[]
    topServices: { name: string, count: number, revenue: number }[]
}

const formatCurrency = (value: number) => `₫${(value / 1000000).toFixed(1)}M`
const MAX_SERVICE_COUNT = 245 // Dựa trên mock data, nên được tính toán thực tế

export default function TopPerformers({ topDoctors, recentReports, topServices }: TopPerformersProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Doctors */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Bác sĩ hiệu suất cao 🌟</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {topDoctors.map((doctor, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{doctor.name}</h4>
                                        <p className="text-sm text-gray-600">{doctor.patients} bệnh nhân</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">{formatCurrency(doctor.revenue)}</p>
                                    <div className="flex items-center text-sm text-yellow-600 justify-end">
                                        <Activity className="w-3 h-3 mr-1" />
                                        {doctor.rating}/5
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Services Performance Chart/List */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Dịch vụ phổ biến 📈</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {topServices.map((service, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium text-gray-900">{service.name}</span>
                                    <span className="text-sm text-gray-600">{service.count} lượt</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${(service.count / MAX_SERVICE_COUNT) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-xs text-gray-500">{formatCurrency(service.revenue)}</span>
                                    <span className="text-xs text-gray-500">
                                        {Math.round((service.count / MAX_SERVICE_COUNT) * 100)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Reports - Full Width */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Báo cáo Gần đây 📁</h3>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        {recentReports.map((report) => (
                            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center">
                                    <FileText className="w-8 h-8 text-blue-600 mr-4" />
                                    <div>
                                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            {report.type} • {new Date(report.createdDate).toLocaleDateString('vi-VN')} • {report.size}
                                        </p>
                                    </div>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Tải xuống">
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Xem tất cả báo cáo →
                    </button>
                </div>
            </div>
        </div>
    )
}