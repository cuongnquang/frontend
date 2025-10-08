'use client'

import { useState, useMemo } from 'react'
import { Calendar, CheckCircle, XCircle } from 'lucide-react'
import AppointmentStatistics from '@/components/admin/appointments/AppointmentStatistics'
import AppointmentFilters from '@/components/admin/appointments/AppointmentFilters'
import AppointmentTable from '@/components/admin/appointments/AppointmentTable'
import AppointmentHeader from '@/components/admin/appointments/AppointmentPageHeader'
import { AppointmentForm } from '@/components/admin/appointments/form/AppointmentForm'
import { Doctor, Patient, Appointment, Specialty, DoctorSchedule, User, AppointmentStatus, Role, Gender} from '@/types/types'


const getStatusColorAppointment = (availability: Appointment['status']) => {
    switch (availability) {
        case 'completed': return 'bg-green-100 text-green-800'
        case 'cancelled': return 'bg-red-100 text-red-800'
        default: return 'bg-yellow-100 text-yellow-800'
    }
}

// Mock data for doctors and patients, needed for the form
const mockUsers: User[] = [
    { user_id: '1', email: 'doctor.an@email.com', role: Role.DOCTOR, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { user_id: '2', email: 'doctor.binh@email.com', role: Role.DOCTOR, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { user_id: '3', email: 'patient.cuong@email.com', role: Role.PATIENT, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
    { user_id: '4', email: 'patient.duyen@email.com', role: Role.PATIENT, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

const mockSpecialties: Specialty[] = [
    { specialty_id: '1', name: 'Tim mạch', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), Doctors: [] },
    { specialty_id: '2', name: 'Da liễu', created_at: new Date().toISOString(), updated_at: new Date().toISOString(), Doctors: [] },
];

const mockDoctors: Doctor[] = [
    { doctor_id: 'BS001', user_id: '1', specialty_id: '1', full_name: 'BS. Nguyễn Văn An', experience_years: 10, is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), User: mockUsers[0], Specialty: mockSpecialties[0], Schedules: [], Appointments: [] },
    { doctor_id: 'BS002', user_id: '2', specialty_id: '2', full_name: 'BS. Trần Thị Bình', experience_years: 5, is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), User: mockUsers[1], Specialty: mockSpecialties[1], Schedules: [], Appointments: [] },
]

const mockPatients: Patient[] = [
    { patient_id: 'BN001', user_id: '3', full_name: 'Lê Văn Cường', phone_number: '0901234569', date_of_birth: '1995-12-05', gender: Gender.MALE, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), User: mockUsers[2], Appointments: [] },
    { patient_id: 'BN002', user_id: '4', full_name: 'Phạm Thị Duyên', phone_number: '0901234570', date_of_birth: '1970-01-01', gender: Gender.FEMALE, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), User: mockUsers[3], Appointments: [] },
]

const mockSchedules: DoctorSchedule[] = [
    { schedule_id: '1', doctor_id: 'BS001', schedule_date: '2024-03-10', start_time: '09:00', end_time: '11:00', is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), Doctor: mockDoctors[0], Appointments: [] },
    { schedule_id: '2', doctor_id: 'BS002', schedule_date: '2024-03-11', start_time: '14:00', end_time: '16:00', is_available: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), Doctor: mockDoctors[1], Appointments: [] },
];

// --- 2. DỮ LIỆU MOCK (Thay thế bằng fetch API thực tế) ---
const mockAppointments: Appointment[] = [
    {
        appointment_id: 'LH001',
        patient_id: 'BN001',
        doctor_id: 'BS001',
        schedule_id: '1',
        symptoms: 'Đau ngực, khó thở',
        status: AppointmentStatus.COMPLETED,
        created_at: '2024-03-01T10:00:00Z',
        updated_at: '2024-03-01T10:00:00Z',
        Patient: mockPatients[0],
        Doctor: mockDoctors[0],
        DoctorSchedule: mockSchedules[0],
    },
    {
        appointment_id: 'LH002',
        patient_id: 'BN002',
        doctor_id: 'BS002',
        schedule_id: '2',
        symptoms: 'Phát ban, ngứa',
        status: AppointmentStatus.CONFIRMED,
        created_at: '2024-03-05T14:30:00Z',
        updated_at: '2024-03-05T14:30:00Z',
        Patient: mockPatients[1],
        Doctor: mockDoctors[1],
        DoctorSchedule: mockSchedules[1],
    },
    {
        appointment_id: 'LH003',
        patient_id: 'BN001',
        doctor_id: 'BS002',
        schedule_id: '2',
        symptoms: 'Ho, sốt',
        status: AppointmentStatus.CANCELLED,
        cancellation_reason: 'Bệnh nhân bận đột xuất',
        created_at: '2024-03-08T09:00:00Z',
        updated_at: '2024-03-08T09:00:00Z',
        Patient: mockPatients[0],
        Doctor: mockDoctors[1],
        DoctorSchedule: mockSchedules[1],
    },
    {
        appointment_id: 'LH004',
        patient_id: 'BN002',
        doctor_id: 'BS001',
        schedule_id: '1',
        symptoms: 'Kiểm tra định kỳ',
        status: AppointmentStatus.PENDING,
        created_at: '2024-03-09T16:00:00Z',
        updated_at: '2024-03-09T16:00:00Z',
        Patient: mockPatients[1],
        Doctor: mockDoctors[0],
        DoctorSchedule: mockSchedules[0],
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
            const matchesSearch = appt.Patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt.Doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt.appointment_id.toLowerCase().includes(searchTerm.toLowerCase())
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
        if (window.confirm(`Bạn có chắc chắn muốn xóa lịch hẹn ${appointment.appointment_id} không?`)) {
            setAppointments(prev => prev.filter(a => a.appointment_id !== appointment.appointment_id))
            alert(`Đã xóa lịch hẹn ${appointment.appointment_id}`)
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
            alert(`Đã tạo lịch hẹn mới: ${newAppointment.appointment_id}`);
        } else if (formMode === 'edit' && currentAppointment) {
            setAppointments(prev => prev.map(a => a.appointment_id === currentAppointment.appointment_id ? { ...a, ...data } : a));
            alert(`Đã cập nhật lịch hẹn: ${currentAppointment.appointment_id}`);
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