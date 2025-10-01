'use client'

import { useState } from 'react'
import { PermissionGate } from '@/lib/AuthGuard'
import {
    Calendar,
    Clock,
    User,
    Phone,
    MapPin,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
    Edit
} from 'lucide-react'

interface Appointment {
    id: string
    patientName: string
    patientId: string
    patientPhone: string
    patientEmail: string
    appointmentDate: string
    appointmentTime: string
    type: string
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    symptoms: string
    notes?: string
    room?: string
}

export default function DoctorAppointments() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [statusFilter, setStatusFilter] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Mock appointments data
    const appointments: Appointment[] = [
        {
            id: '1',
            patientName: 'Nguyễn Văn An',
            patientId: 'BN001',
            patientPhone: '0901234567',
            patientEmail: 'nva@email.com',
            appointmentDate: '2024-02-15',
            appointmentTime: '09:00',
            type: 'Khám tổng quát',
            status: 'confirmed',
            symptoms: 'Đau đầu, chóng mặt kéo dài 3 ngày',
            room: 'Phòng 201',
            notes: 'Bệnh nhân có tiền sử cao huyết áp'
        },
        {
            id: '2',
            patientName: 'Trần Thị Bình',
            patientId: 'BN002',
            patientPhone: '0901234568',
            patientEmail: 'ttb@email.com',
            appointmentDate: '2024-02-15',
            appointmentTime: '09:30',
            type: 'Tái khám',
            status: 'pending',
            symptoms: 'Kiểm tra sau điều trị',
            room: 'Phòng 201'
        },
        {
            id: '3',
            patientName: 'Lê Văn Cường',
            patientId: 'BN003',
            patientPhone: '0901234569',
            patientEmail: 'lvc@email.com',
            appointmentDate: '2024-02-15',
            appointmentTime: '10:00',
            type: 'Khám chuyên khoa',
            status: 'completed',
            symptoms: 'Đau ngực, khó thở',
            room: 'Phòng 201',
            notes: 'Đã thực hiện ECG, kết quả bình thường'
        }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'confirmed': return 'bg-blue-100 text-blue-800'
            case 'completed': return 'bg-green-100 text-green-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <AlertCircle className="w-4 h-4" />
            case 'confirmed': return <CheckCircle className="w-4 h-4" />
            case 'completed': return <CheckCircle className="w-4 h-4" />
            case 'cancelled': return <XCircle className="w-4 h-4" />
            default: return <AlertCircle className="w-4 h-4" />
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Chờ xác nhận'
            case 'confirmed': return 'Đã xác nhận'
            case 'completed': return 'Hoàn thành'
            case 'cancelled': return 'Đã hủy'
            default: return status
        }
    }

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
        const matchesDate = appointment.appointmentDate === selectedDate

        return matchesSearch && matchesStatus && matchesDate
    })

    const handleStatusChange = (appointmentId: string, newStatus: string) => {
        // In real app, this would be an API call
        console.log(`Changing appointment ${appointmentId} to ${newStatus}`)
    }

    return (
        <PermissionGate permission="doctor:appointments:view">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Lịch khám bệnh</h1>
                        <p className="text-gray-600">Quản lý lịch hẹn với bệnh nhân</p>
                    </div>
                    <div className="flex space-x-3">
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Tạo lịch hẹn
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Date Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày khám
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Tên bệnh nhân hoặc mã BN..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Appointments List */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Lịch hẹn ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}
                            <span className="ml-2 text-sm text-gray-500">
                                ({filteredAppointments.length} lịch hẹn)
                            </span>
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {filteredAppointments.length > 0 ? (
                            filteredAppointments.map((appointment) => (
                                <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-4 mb-3">
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                                                    <span className="font-medium text-gray-900">
                                                        {appointment.appointmentTime}
                                                    </span>
                                                </div>
                                                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                                                    {getStatusIcon(appointment.status)}
                                                    <span className="ml-1">{getStatusText(appointment.status)}</span>
                                                </div>
                                                {appointment.room && (
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {appointment.room}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <div className="flex items-center mb-2">
                                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="font-medium text-gray-900">
                                                            {appointment.patientName}
                                                        </span>
                                                        <span className="ml-2 text-sm text-gray-500">
                                                            ({appointment.patientId})
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center mb-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                                                        {appointment.patientPhone}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Loại khám:</span> {appointment.type}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Triệu chứng:</span>
                                                        <p className="mt-1">{appointment.symptoms}</p>
                                                    </div>
                                                    {appointment.notes && (
                                                        <div className="text-sm text-gray-600">
                                                            <span className="font-medium">Ghi chú:</span>
                                                            <p className="mt-1 text-blue-600">{appointment.notes}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            {appointment.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                                    >
                                                        Xác nhận
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                                                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                                    >
                                                        Hủy
                                                    </button>
                                                </div>
                                            )}

                                            {appointment.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusChange(appointment.id, 'completed')}
                                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                >
                                                    Hoàn thành
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center">
                                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch hẹn</h3>
                                <p className="text-gray-600">
                                    Không có lịch hẹn nào cho ngày đã chọn
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PermissionGate>
    )
}