'use client'

import { useState } from 'react'
import { X, Clock, Mail, Plus } from 'lucide-react'

interface ScheduledReport {
    id: string
    name: string
    type: string
    schedule: string
    format: string
    recipients: string[]
    lastRun?: string
    nextRun: string
    active: boolean
}

export function ScheduledReportsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [schedules, setSchedules] = useState<ScheduledReport[]>([
        {
            id: '1',
            name: 'Báo cáo doanh thu hàng tuần',
            type: 'revenue',
            schedule: 'Thứ 2 hàng tuần, 8:00 AM',
            format: 'Excel',
            recipients: ['admin@youmed.vn', 'manager@youmed.vn'],
            lastRun: '2024-02-12 08:00',
            nextRun: '2024-02-19 08:00',
            active: true
        },
        {
            id: '2',
            name: 'Thống kê bệnh nhân hàng tháng',
            type: 'patients',
            schedule: 'Ngày 1 hàng tháng, 9:00 AM',
            format: 'PDF',
            recipients: ['admin@youmed.vn'],
            lastRun: '2024-02-01 09:00',
            nextRun: '2024-03-01 09:00',
            active: true
        }
    ])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Báo cáo tự động</h2>
                        <p className="text-sm text-gray-600">Lên lịch xuất báo cáo định kỳ</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Lịch trình ({schedules.length})
                        </h3>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm lịch mới
                        </button>
                    </div>

                    <div className="space-y-4">
                        {schedules.map((schedule) => (
                            <div key={schedule.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3">
                                            <h4 className="font-semibold text-gray-900">{schedule.name}</h4>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${schedule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {schedule.active ? 'Đang chạy' : 'Tạm dừng'}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2" />
                                                {schedule.schedule}
                                            </div>
                                            <div className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {schedule.recipients.join(', ')}
                                            </div>
                                            <p>
                                                <span className="font-medium">Định dạng:</span> {schedule.format} •
                                                <span className="font-medium ml-2">Chạy tiếp theo:</span> {schedule.nextRun}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded">
                                            Sửa
                                        </button>
                                        <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded">
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}