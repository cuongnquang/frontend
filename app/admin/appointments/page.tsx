'use client'

import { useState, useMemo } from 'react'
import { Calendar, CheckCircle, XCircle } from 'lucide-react'
import AppointmentStatistics from '@/components/admin/appointments/AppointmentStatistics'
import { Appointment } from '@/components/admin/appointments/AppointmentType'
import { AppointmentStatus, Gender } from '@/types/emuns'
import AppointmentFilters from '@/components/admin/appointments/AppointmentFilters'
import AppointmentTable from '@/components/admin/appointments/AppointmentTable'
import AppointmentHeader from '@/components/admin/appointments/AppointmentPageHeader'
import { AppointmentForm } from '@/components/admin/appointments/form/AppointmentForm'
import { Doctor, Patient } from '@/types/types'


const getStatusColorAppointment = (availability: Appointment['status']) => {
    switch (availability) {
        case 'completed': return 'bg-green-100 text-green-800'
        case 'cancelled': return 'bg-red-100 text-red-800'
        default: return 'bg-yellow-100 text-yellow-800'
    }
}

// Mock data for doctors and patients, needed for the form
const mockDoctors: Doctor[] = [
    { doctor_id: 'BS001', full_name: 'BS. Nguyễn Văn An', Specialty: { name: 'Tim mạch' } },
    { doctor_id: 'BS002', full_name: 'BS. Trần Thị Bình', Specialty: { name: 'Da liễu' } },
    { doctor_id: 'BS003', full_name: 'BS. Lê Văn Cường', Specialty: { name: 'Nhi khoa' } },
    { doctor_id: 'BS004', full_name: 'BS. Phạm Thị Duyên', Specialty: { name: 'Tim mạch' } },
]

const mockPatients: Patient[] = [
    {
        patient_id: 'BN001',
        full_name: 'Nguyễn Văn An',
        phone_number: '0901234567',
        gender: Gender.MALE,
        date_of_birth: '1985-03-15',
        User: { email: 'nva@email.com' }
    },
    {
        patient_id: 'BN002',
        full_name: 'Trần Thị Bình',
        phone_number: '0901234568',
        gender: Gender.FEMALE,
        date_of_birth: '1990-07-22',
        User: { email: 'ttb@email.com' }
    },
    {
        patient_id: 'BN003',
        full_name: 'Lê Văn Cường',
        phone_number: '0901234569',
        gender: Gender.MALE,
        date_of_birth: '1995-12-05',
        User: { email: 'lvc@email.com' }
    },
    {
        patient_id: 'BN004',
        full_name: 'Phạm Thị Duyên',
        phone_number: '0901234570',
        gender: Gender.FEMALE,
        date_of_birth: '1970-01-01',
        User: { email: 'ptd@email.com' }
    }
]







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
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [currentAppointment, setCurrentAppointment] = useState<Appointment | undefined>(undefined)
    const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create')

    // Filter logic
    const filteredAppointments = useMemo(() => {
        return appointments.filter(appt => {
            const matchesSearch = appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt.id.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'all' || appt.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [appointments, searchTerm, statusFilter])

    const handleAddAppointment = () => {
        setCurrentAppointment(undefined)
        setFormMode('create')
        setIsFormOpen(true)
    }
    const handleExport = () => console.log('Mở dialog nhập dữ liệu bác sĩ')

    const handleViewAppointment = (appointment: Appointment) => {
       setCurrentAppointment(appointment)
       setFormMode('view')
       setIsFormOpen(true)
    }
    const handleEditAppointment = (appointment: Appointment) => {
        setCurrentAppointment(appointment)
        setFormMode('edit')
        setIsFormOpen(true)
    }
    const handleDeleteAppointment = (appointment: Appointment) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa lịch hẹn ${appointment.id} không?`)) {
            setAppointments(prev => prev.filter(a => a.id !== appointment.id))
            alert(`Đã xóa lịch hẹn ${appointment.id}`)
        }
    }
    const handleFormClose = () => {
       setIsFormOpen(false)
       setCurrentAppointment(undefined)
    };
    const handleFormSubmit = (data: any) => {
        console.log('Dữ liệu form đã gửi:', data);
        if (formMode === 'create') {
            const newAppointment = {
                ...data,
                id: `LH${Date.now().toString().slice(-4)}`,
                patientName: data.newPatient.fullName,
                doctorName: mockDoctors.find(d => d.doctor_id === data.doctorId)?.full_name || 'N/A',
            } as Appointment;
            setAppointments(prev => [newAppointment, ...prev]);
            alert(`Đã tạo lịch hẹn mới: ${newAppointment.id}`);
        } else if (formMode === 'edit' && currentAppointment) {
            setAppointments(prev => prev.map(a => a.id === currentAppointment.id ? { ...a, ...data } : a));
            alert(`Đã cập nhật lịch hẹn: ${currentAppointment.id}`);
        }
        handleFormClose();
    }
    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
                    <AppointmentHeader
                        onAddAppointment={handleAddAppointment}
                        onExport={handleExport}
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
                    {isFormOpen && (
                        <AppointmentForm
                            appointment={currentAppointment}
                            onClose={handleFormClose}
                            onSubmit={handleFormSubmit}
                            mode={formMode}
                            doctors={mockDoctors}
                            patients={mockPatients}
                        />
                    )}
                </div>
            )
}