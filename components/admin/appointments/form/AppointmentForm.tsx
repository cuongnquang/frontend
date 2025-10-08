'use client'
import { useState, useEffect } from 'react'

// Imports cho các component con
import { AppointmentFormHeader } from './AppointmentFormHeader'
import { AppointmentPatientInfo } from './AppointmentPatientInfo'
import { AppointmentBookingInfo } from './AppointmentBookingInfo'
import { AppointmentFormActions } from './AppointmentFormActions'
import { Doctor, Patient, Appointment } from '@/types/types'

interface AppointmentFormProps {
    appointment: Appointment // Dữ liệu lịch hẹn để chỉnh sửa/xem
    onClose: () => void
    onSubmit: (data: any) => void
    mode: 'create' | 'edit' | 'view'
    doctors: Doctor[] // Danh sách bác sĩ để chọn
    patients: Patient[] // Danh sách bệnh nhân để chọn
}

export function AppointmentForm({
    appointment,
    onClose,
    onSubmit,
    mode,
    doctors,
    patients
}: AppointmentFormProps) {
    const [formData, setFormData] = useState({
        patientId: appointment.patient_id,
        doctorId: appointment.doctor_id,
        appointmentDate: appointment.appointment_date,
        appointmentTime: appointment.appointment_time,
        reason: appointment.reason, 
        notes: appointment.notes,
        status: appointment.status || '',
        // Thông tin bệnh nhân mới (nếu không chọn từ danh sách)
        newPatient: {
            fullName: '',
            phone: '',
            email: 'cuongnquang@gmail.com',
            gender: 'male',
            dateOfBirth: ''
        }
    })

    const isReadOnly = mode === 'view'

    // Cập nhật form khi chọn bệnh nhân có sẵn
    useEffect(() => {
        if (formData.patientId) {
            const selectedPatient = patients.find(p => p.patient_id === formData.patientId);
            if (selectedPatient) {
                setFormData(prev => ({
                    ...prev,
                    newPatient: {
                        fullName: selectedPatient.full_name,
                        phone: selectedPatient.phone_number,
                        email: selectedPatient.User?.email || '',
                        gender: selectedPatient.gender,
                        dateOfBirth: selectedPatient.date_of_birth,
                    }
                }))
            }
        }
    }, [formData.patientId, patients])


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">

                <AppointmentFormHeader mode={mode} onClose={onClose} />

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <AppointmentPatientInfo
                        formData={formData}
                        setFormData={setFormData}
                        isReadOnly={isReadOnly}
                        patients={patients}
                    />

                    <AppointmentBookingInfo
                        formData={formData}
                        setFormData={setFormData}
                        isReadOnly={isReadOnly}
                        doctors={doctors}
                    />

                    <AppointmentFormActions mode={mode} onClose={onClose} isReadOnly={isReadOnly} />

                </form>
            </div>
        </div>
    )
}