'use client'

import { useState, useMemo } from 'react'
import { usePatient, Patient } from '@/contexts/PatientContext'
import PatientPageHeader from '@/components/admin/patients/PatientPageHeader'
import PatientStatistics from '@/components/admin/patients/PatientStatistics'
import PatientFilters from '@/components/admin/patients/PatientFilters'
import PatientTable from '@/components/admin/patients/PatientTable'
import { PatientForm } from '@/components/admin/patients/form/PatientForm'
import Alert from '@/components/ui/Alert'

// Các hàm tiện ích
const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
    }
    return age
}

export default function AdminPatients() {
    const { 
        patients, 
        loading, 
        error, 
        fetchPatients, 
        createPatient,
        fetchPatientById
    } = usePatient()
    
    const [searchTerm, setSearchTerm] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [currentPatient, setCurrentPatient] = useState<Patient | null>(null)
    const [formMode, setFormMode] = useState<'create' | 'view'>('create')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null,
    })

    // Hiển thị alert và tự động ẩn sau 5 giây
    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type })
        setTimeout(() => {
            setAlert({ message: '', type: null })
        }, 5000)
    }

    const filteredPatients = useMemo(() => {
        return patients.filter(patient => {
            const matchesSearch = patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.phone_number.includes(searchTerm) ||
                patient.identity_number?.includes(searchTerm)

            return matchesSearch
        })
    }, [patients, searchTerm])

    // Pagination calculations
    const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage)

    // Reset to page 1 when search changes
    useMemo(() => {
        setCurrentPage(1)
    }, [searchTerm])

    // --- Action Handlers ---
    const handleAddPatient = () => {
        setCurrentPatient(null)
        setFormMode('create')
        setIsFormOpen(true)
    }

    const handleViewPatient = async (patient: Patient) => {
        try {
            await fetchPatientById(patient.id)
            setCurrentPatient(patient)
            setFormMode('view')
            setIsFormOpen(true)
        } catch (err) {
            console.error('Error viewing patient:', err)
            showAlert('Không thể xem thông tin bệnh nhân', 'error')
        }
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setCurrentPatient(null)
    }

    const handleFormSubmit = async (data: Record<string, unknown>) => {
        if (formMode === 'create') {
            const patientData = {
                user_id: data.user_id || `user_${Date.now()}`,
                full_name: data.full_name,
                identity_number: data.identity_number || '',
                phone_number: data.phone_number,
                date_of_birth: data.date_of_birth,
                gender: data.gender,
                address: data.address || '',
                ethnicity: data.ethnicity || '',
                health_insurance_number: data.health_insurance_number || '',
                referral_code: data.referral_code || '',
                occupation: data.occupation || ''
            }

            const result = await createPatient(patientData)
            showAlert(result.message, result.success ? 'success' : 'error')
            
            if (result.success) {
                await fetchPatients()
            }
        }
        handleFormClose()
    }

    const handleExport = () => {
        console.log('Exporting patients data...')
        showAlert('Đang xuất dữ liệu bệnh nhân', 'success')
    }

    if (loading && patients.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Đang tải dữ liệu bệnh nhân...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <PatientPageHeader
                onAddPatient={handleAddPatient}
                onExport={handleExport}
            />

            {/* Alert thông báo */}
            {alert.type && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                />
            )}

            {/* Hiển thị lỗi từ context */}
            {error && (
                <Alert
                    message={error}
                    type="error"
                />
            )}

            {/* Statistics */}
            <PatientStatistics patients={patients} />

            {/* Filters */}
            <PatientFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            {/* Patients Table */}
            <PatientTable
                filteredPatients={paginatedPatients}
                calculateAge={calculateAge}
                onViewPatient={handleViewPatient}
            />

            {/* Pagination Controls */}
            {filteredPatients.length > itemsPerPage && (
                <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600">
                        Hiển thị {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredPatients.length)} của {filteredPatients.length} bệnh nhân
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

            {/* Patient Form Modal */}
            {isFormOpen && (
                <PatientForm
                    patient={currentPatient}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    mode={formMode}
                />
            )}
        </div>
    )
}