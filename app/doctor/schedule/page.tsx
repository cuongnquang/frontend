'use client'

import { useState } from 'react'
import {
    Clock,
    Calendar,
    Plus,
    Edit,
    Trash2,
    Check,
    X,
    AlertCircle
} from 'lucide-react'

interface TimeSlot {
    id: string
    day: string
    startTime: string
    endTime: string
    maxPatients: number
    currentPatients: number
    isAvailable: boolean
}

export default function DoctorSchedule() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [showAddModal, setShowAddModal] = useState(false)

    // Mock schedule data
    const schedule: TimeSlot[] = [
        {
            id: '1',
            day: 'Thứ Hai',
            startTime: '08:00',
            endTime: '12:00',
            maxPatients: 20,
            currentPatients: 15,
            isAvailable: true
        },
        {
            id: '2',
            day: 'Thứ Hai',
            startTime: '14:00',
            endTime: '17:00',
            maxPatients: 15,
            currentPatients: 10,
            isAvailable: true
        },
        {
            id: '3',
            day: 'Thứ Ba',
            startTime: '08:00',
            endTime: '12:00',
            maxPatients: 20,
            currentPatients: 18,
            isAvailable: true
        },
        {
            id: '4',
            day: 'Thứ Tư',
            startTime: '08:00',
            endTime: '17:00',
            maxPatients: 30,
            currentPatients: 25,
            isAvailable: true
        },
        {
            id: '5',
            day: 'Thứ Năm',
            startTime: '08:00',
            endTime: '12:00',
            maxPatients: 20,
            currentPatients: 0,
            isAvailable: false
        }
    ]

    const weekDays = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']

    const getProgressColor = (current: number, max: number) => {
        const percentage = (current / max) * 100
        if (percentage >= 90) return 'bg-red-500'
        if (percentage >= 70) return 'bg-yellow-500'
        return 'bg-green-500'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lịch làm việc</h1>
                    <p className="text-gray-600">Quản lý thời gian khám bệnh</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm ca làm việc
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Tổng giờ/tuần</p>
                            <p className="text-2xl font-bold text-gray-900">40h</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-green-100 text-green-600 mr-4">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Ca làm/tuần</p>
                            <p className="text-2xl font-bold text-gray-900">10</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-purple-100 text-purple-600 mr-4">
                            <Check className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Đã đặt</p>
                            <p className="text-2xl font-bold text-gray-900">68</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-orange-100 text-orange-600 mr-4">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Còn trống</p>
                            <p className="text-2xl font-bold text-gray-900">37</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekly Schedule */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Lịch tuần này</h2>
                </div>

                <div className="p-6">
                    <div className="space-y-4">
                        {weekDays.map((day) => {
                            const daySchedule = schedule.filter(s => s.day === day)

                            return (
                                <div key={day} className="border rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">{day}</h3>

                                    {daySchedule.length > 0 ? (
                                        <div className="space-y-3">
                                            {daySchedule.map((slot) => (
                                                <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center space-x-4 flex-1">
                                                        <Clock className="w-5 h-5 text-gray-400" />
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <span className="font-medium text-gray-900">
                                                                    {slot.startTime} - {slot.endTime}
                                                                </span>
                                                                {!slot.isAvailable && (
                                                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                                        Không khả dụng
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex items-center space-x-4">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                                                                        <span>{slot.currentPatients}/{slot.maxPatients} bệnh nhân</span>
                                                                        <span>{Math.round((slot.currentPatients / slot.maxPatients) * 100)}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                                        <div
                                                                            className={`h-2 rounded-full ${getProgressColor(slot.currentPatients, slot.maxPatients)}`}
                                                                            style={{ width: `${(slot.currentPatients / slot.maxPatients) * 100}%` }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-2 ml-4">
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                            <p className="text-sm">Chưa có lịch làm việc</p>
                                            <button className="text-blue-600 text-sm mt-2 hover:underline">
                                                Thêm ca làm việc
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn sắp tới</h2>
                </div>
                <div className="p-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-semibold">NVA</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Nguyễn Văn An</h4>
                                    <p className="text-sm text-gray-600">Khám tổng quát</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">09:00 - 09:30</p>
                                <p className="text-xs text-gray-500">Hôm nay</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 font-semibold">TTB</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Trần Thị Bình</h4>
                                    <p className="text-sm text-gray-600">Tái khám</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">10:00 - 10:30</p>
                                <p className="text-xs text-gray-500">Hôm nay</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}