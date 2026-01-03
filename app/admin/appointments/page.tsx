'use client'

import { useState, useMemo, useEffect } from 'react'
import Alert from '@/components/ui/Alert'
import { Calendar, CheckCircle, XCircle } from 'lucide-react'
import AppointmentStatistics from '@/components/admin/appointments/AppointmentStatistics'
import AppointmentFilters from '@/components/admin/appointments/AppointmentFilters'
import AppointmentTable from '@/components/admin/appointments/AppointmentTable'
import AppointmentHeader from '@/components/admin/appointments/AppointmentPageHeader'
import { AppointmentForm } from '@/components/admin/appointments/form/AppointmentForm'
import { useAppointment, Appointment, AppointmentStatus } from '@/contexts/AppointmentContext'
import { useDoctor } from '@/contexts/DoctorContext'
import { usePatient } from '@/contexts/PatientContext'

const getStatusColorAppointment = (availability: Appointment['status']) => {
    switch (availability) {
        case 'completed': return 'bg-green-100 text-green-800'
        case 'cancelled': return 'bg-red-100 text-red-800'
        default: return 'bg-yellow-100 text-yellow-800'
    }
}

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

export default function AdminAppointments() {
    const { appointments, loading, error, fetchAppointments, confirmAppointment, cancelAppointment, completeAppointment } = useAppointment()
    const { doctors, fetchDoctors } = useDoctor()
    const { patients, fetchPatients } = usePatient()
    
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [currentAppointment, setCurrentAppointment] = useState<Appointment | undefined>(undefined)
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null
    })
    const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create')

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([fetchAppointments(), fetchDoctors(), fetchPatients()])
            } catch (err) {
                console.error('Error loading appointments data:', err)
            }
        }
        loadData()
    }, [])

    // Filter logic
    const filteredAppointments = useMemo(() => {
        return appointments.filter(appt => {
            const matchesSearch = (appt.Patient?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt.Doctor?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appt.appointment_id.toLowerCase().includes(searchTerm.toLowerCase())) ?? false
            const matchesStatus = statusFilter === 'all' || appt.status === statusFilter
            return matchesSearch && matchesStatus
        })
    }, [appointments, searchTerm, statusFilter])

    // Pagination calculations
    const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage)

    // Reset to page 1 when filters change
    useMemo(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter])

    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type })
        setTimeout(() => {
            setAlert({ message: '', type: null })
        }, 5000)
    }

    const handleAddAppointment = () => {
        setCurrentAppointment(undefined)
        setFormMode('create')
        setIsFormOpen(true)
    }

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

    const handleDeleteAppointment = async (appointment: Appointment) => {
        if (window.confirm(`Bạn có chắc chắn muốn hủy lịch hẹn ${appointment.appointment_id} không?`)) {
            try {
                const result = await cancelAppointment(appointment.appointment_id, 'Hủy từ quản lý admin')
                showAlert(result.message, result.success ? 'success' : 'error')
                if (result.success) {
                    await fetchAppointments()
                }
            } catch (err) {
                showAlert('Lỗi khi hủy lịch hẹn', 'error')
            }
        }
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setCurrentAppointment(undefined)
    }

    const handleFormSubmit = async (data: Record<string, unknown>) => {
        try {
            if (formMode === 'create') {
                // Handle create appointment
                console.log('Creating appointment:', data)
                showAlert('Tạo lịch hẹn mới thành công', 'success')
            } else if (formMode === 'edit' && currentAppointment) {
                // Handle edit appointment
                console.log('Editing appointment:', data)
                showAlert(`Cập nhật lịch hẹn: ${currentAppointment.appointment_id} thành công`, 'success')
            }
            await fetchAppointments()
            handleFormClose()
        } catch (err) {
            showAlert('Lỗi khi xử lý lịch hẹn', 'error')
        }
    }

    if (loading && appointments.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Đang tải dữ liệu lịch hẹn...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
            <AppointmentHeader
                onAddAppointment={handleAddAppointment}
                onExport={() => showAlert('Chức năng xuất báo cáo đang được cập nhật', 'success')}
            />
            
            {alert.type && (
                <Alert message={alert.message} type={alert.type} duration={5000} />
            )}

            {error && (
                <Alert message={error} type="error" duration={5000} />
            )}

            <AppointmentStatistics appointments={appointments} />
            
            <AppointmentFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />
            
            <AppointmentTable
                filteredAppointments={paginatedAppointments}
                getStatusColorAppointment={getStatusColorAppointment}
                onView={handleViewAppointment}
                onEdit={handleEditAppointment}
                onDelete={handleDeleteAppointment}
            />

            {/* Pagination Controls */}
            {filteredAppointments.length > itemsPerPage && (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">
                        Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAppointments.length)} của {filteredAppointments.length} lịch hẹn
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded ${
                                    currentPage === page
                                        ? 'bg-blue-600 text-white'
                                        : 'border hover:bg-gray-50'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Sau
                        </button>
                    </div>
                </div>
            )}

            {isFormOpen && (
                <AppointmentForm
                    appointment={currentAppointment}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    mode={formMode}
                    doctors={doctors}
                    patients={patients}
                />
            )}
        </div>
    )
}