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
                patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.phone_number.includes(searchTerm) ||
                patient.identity_number?.includes(searchTerm)

            return matchesSearch
        })
    }, [patients, searchTerm])

    // --- Action Handlers ---
    const handleAddPatient = () => {
        setCurrentPatient(null)
        setFormMode('create')
        setIsFormOpen(true)
    }

    const handleViewPatient = async (patient: Patient) => {
        try {
            await fetchPatientById(patient.patient_id)
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

    const handleFormSubmit = async (data: any) => {
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
                filteredPatients={filteredPatients}
                calculateAge={calculateAge}
                onViewPatient={handleViewPatient}
            />

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