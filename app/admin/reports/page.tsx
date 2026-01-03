'use client'

import { useState, useEffect } from 'react'
import {
    Calendar,
    TrendingUp,
    Users,
    Activity,
    CheckCircle,
    Clock,
    RefreshCw,
    BarChart3
} from 'lucide-react'
import { useAppointment } from '@/contexts/AppointmentContext'
import { useDoctor } from '@/contexts/DoctorContext'
import { usePatient } from '@/contexts/PatientContext'

export default function AdminReports() {
    const { appointments, statistics, loading, fetchAppointments } = useAppointment()
    const { doctors } = useDoctor()
    const { patients } = usePatient()
    const [dateRange, setDateRange] = useState('month')
    const [isRefreshing, setIsRefreshing] = useState(false)

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await fetchAppointments()
        } finally {
            setIsRefreshing(false)
        }
    }

    const overviewStats = {
        appointments: {
            current: statistics.total,
            completed: statistics.completed,
            pending: statistics.pending,
            cancelled: statistics.cancelled,
            confirmed: statistics.confirmed
        },
        patients: {
            current: patients.length,
            active: patients.length
        },
        doctors: {
            current: doctors.length,
            available: doctors.filter(d => d.is_available).length
        }
    }

    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Báo cáo & Thống kê</h1>
                    <p className="text-gray-600">Phân tích dữ liệu về lịch hẹn, bệnh nhân và bác sĩ</p>
                </div>
                <div className="flex space-x-3">
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-700 bg-white"
                    >
                        <option value="today">Hôm nay</option>
                        <option value="week">Tuần này</option>
                        <option value="month">Tháng này</option>
                        <option value="quarter">Quý này</option>
                        <option value="year">Năm này</option>
                        <option value="custom">Tùy chỉnh</option>
                    </select>
                    <button 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center space-x-2 transition"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span>{isRefreshing ? 'Đang tải...' : 'Làm mới'}</span>
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Appointments */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                            <Calendar className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Tổng lịch hẹn</h3>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.appointments.current}</p>
                    <p className="text-xs text-gray-500 mt-2">Hoàn thành: {overviewStats.appointments.completed}</p>
                </div>

                {/* Patients */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-green-100 text-green-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Bệnh nhân hoạt động</h3>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.patients.active}</p>
                    <p className="text-xs text-gray-500 mt-2">Tổng: {overviewStats.patients.current}</p>
                </div>

                {/* Doctors */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                            <Activity className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Bác sĩ sẵn sàng</h3>
                    <p className="text-2xl font-bold text-gray-900">{overviewStats.doctors.available}</p>
                    <p className="text-xs text-gray-500 mt-2">Tổng: {overviewStats.doctors.current}</p>
                </div>

                {/* Completion Rate */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                    <h3 className="text-sm text-gray-600 mb-1">Tỷ lệ hoàn thành</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        {overviewStats.appointments.current > 0 
                            ? ((overviewStats.appointments.completed / overviewStats.appointments.current) * 100).toFixed(1)
                            : 0}%
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Từ {overviewStats.appointments.current} lịch hẹn</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Appointment Status */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
                        Trạng thái lịch hẹn
                    </h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Hoàn thành', value: overviewStats.appointments.completed, color: 'bg-green-500' },
                            { name: 'Chờ xác nhận', value: overviewStats.appointments.pending, color: 'bg-yellow-500' },
                            { name: 'Đã xác nhận', value: overviewStats.appointments.confirmed, color: 'bg-blue-500' },
                            { name: 'Đã hủy', value: overviewStats.appointments.cancelled, color: 'bg-red-500' }
                        ].map((item, index) => (
                            <div key={index}>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                    <span className="text-sm text-gray-600">{item.value}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`${item.color} h-2 rounded-full transition-all`}
                                        style={{
                                            width: `${overviewStats.appointments.current > 0 
                                                ? (item.value / overviewStats.appointments.current) * 100
                                                : 0}%`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Lịch hẹn gần đây</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {appointments.length > 0 ? (
                            appointments.slice(0, 5).map((apt: any) => (
                                <div key={apt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{apt.patient_name}</p>
                                        <p className="text-xs text-gray-500">{apt.doctor_name}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium
                                        ${apt.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                        ${apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                        ${apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                                        ${apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                                    `}>
                                        {apt.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-4">Chưa có lịch hẹn</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}