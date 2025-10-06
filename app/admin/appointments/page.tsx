'use client'

import { useState } from 'react'
import { Calendar, User,  CheckCircle, XCircle, Plus, Filter } from 'lucide-react'
import AppointmentStatistics from '@/components/admin/appointments/AppointmentStatistics'
import { Appointment } from '@/components/admin/appointments/AppointmentType'
import { AppointmentStatus } from '@/types/emuns'
import AppointmentFilters from '@/components/admin/appointments/AppointmentFilters'
import AppointmentTable from '@/components/admin/appointments/AppointmentTable'
import AppointmentHeader from '@/components/client/appointments/AppointmentHeader'

const getStatusColorAppointment = (availability: Appointment['status']) => {
    switch (availability) {
        case 'completed': return 'bg-green-100 text-green-800'
        case 'cancelled': return 'bg-red-100 text-red-800'
        default: return 'bg-yellow-100 text-yellow-800'
    }
}

// --- 2. DỮ LIỆU MOCK (Thay thế bằng fetch API thực tế) ---
const mockAppointments: Appointment[] = [
    {
        id: 'LH001',
        patientName: 'Nguyễn Văn An',
        patientId: 'BN001',
        doctorName: 'BS. Nguyễn Văn An',
        doctorId: 'BS001',
        specialization: 'Tim mạch',
        date: '2024-03-01',
        time: '10:00',
        status: AppointmentStatus.Completed,
        reason: 'Khám tổng quát',
        consultationFee: 500000,
    },
    {
        id: 'LH002',
        patientName: 'Trần Thị Bình',
        patientId: 'BN002',
        doctorName: 'BS. Trần Thị Bình',
        doctorId: 'BS002',
        specialization: 'Da liễu',
        date: '2024-02-28',
        time: '14:30',
        status: AppointmentStatus.Completed,
        reason: 'Tái khám da liễu',
        consultationFee: 750000,
    },
    {
        id: 'LH003',
        patientName: 'Lê Văn Cường',
        patientId: 'BN003',
        doctorName: 'BS. Lê Văn Cường',
        doctorId: 'BS003',
        specialization: 'Nhi khoa',
        date: '2024-03-05',
        time: '09:00',
        status: AppointmentStatus.Cancelled,
        reason: 'Cảm cúm thông thường',
        consultationFee: 400000,
    },
    {
        id: 'LH004',
        patientName: 'Phạm Thị Duyên',
        patientId: 'BN004',
        doctorName: 'BS. Phạm Thị Duyên',
        doctorId: 'BS004',
        specialization: 'Tim mạch',
        date: '2024-03-10',
        time: '16:00',
        status: AppointmentStatus.Pending,
        reason: 'Kiểm tra huyết áp',
        consultationFee: 500000,
    },
]

// --- 3. HELPER FUNCTIONS ---
const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
        case 'completed':
            return <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full"><CheckCircle className="w-3 h-3 mr-1" /> Hoàn thành</span>
        case 'cancelled':
            return <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full"><XCircle className="w-3 h-3 mr-1" /> Đã hủy</span>
        case 'pending':
            return <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full"><Calendar className="w-3 h-3 mr-1" /> Chờ xác nhận</span>
        default:
            return <span className="inline-flex items-center px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">Không rõ</span>
    }
}

const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
}

export default function AdminAppointments() {
    const [appointments, setAppointments] = useState(mockAppointments)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    // Filter logic
    
    const filteredAppointments = appointments.filter(appt =>
        statusFilter === 'all' || appt.status === statusFilter
    )

    const handleAddAppointment = () => {
        
    }
    const handleImport = () => console.log('Mở dialog nhập dữ liệu bác sĩ')
    const handleExport = () => console.log('Mở dialog nhập dữ liệu bác sĩ')

    const handleViewAppointment = (appointment: Appointment) => {
       
    }
    const handleEditAppointment = (appointment: Appointment) => {
        
    }
    const handleDeleteAppointment = (appointment: Appointment) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bác sĩ không?`)) {
            console.log(`Đã gửi yêu cầu xóa bác sĩ`)
        }
    }
    const handleFormClose = () => {
       
    };
    const handleFormSubmit = (data: any) => {
        
    const reportTypes = {
        id: 'doctors',
        title: 'Báo cáo Bác sĩ',
        description: 'Danh sách và hiệu suất bác sĩ',
        // icon: ,
        color: 'bg-blue-100 text-blue-600',
        data: mockAppointments,
        type: 'doctors' as const
    }
    }
    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
                    <AppointmentHeader
                        onAdd={handleAddAppointment}
                        onExport={handleExport}
                        onImport={handleImport}
                    />
                    <AppointmentStatistics appointments={appointments} />
                    <AppointmentFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                    <AppointmentTable
                        filteredAppointments={filteredAppointments}
                        getStatusColorAppointment={getStatusColorAppointment}
                        onView={handleViewAppointment}
                        onEdit={handleEditAppointment}
                        onDelete={handleDeleteAppointment}
                    />
                </div>
            )
}