'use client'
import { useState } from 'react'
import { X } from 'lucide-react'

// Imports cho các component con
import { DoctorFormHeader } from './DoctorFormHeader'
import { DoctorBasicInfo } from './DoctorBasicInfo'
import { DoctorProfessionalInfo } from './DoctorProfessionalInfo'
import { DoctorLanguages } from './DoctorLanguages'
import { DoctorWorkingDays } from './DoctorWorkingDays'
import { DoctorFormActions } from './DoctorFormActions'

interface DoctorFormProps {
    doctor?: any
    onClose: () => void
    onSubmit: (data: any) => void
    mode: 'create' | 'edit' | 'view'
}

export function DoctorForm({ doctor, onClose, onSubmit, mode }: DoctorFormProps) {
    const [formData, setFormData] = useState({
        name: doctor?.name || '',
        email: doctor?.email || '',
        phone: doctor?.phone || '',
        specialization: doctor?.specialization || '',
        licenseNumber: doctor?.licenseNumber || '',
        qualification: doctor?.qualification || '',
        experience: doctor?.experience || 0,
        consultationFee: doctor?.consultationFee || 0,
        dateOfBirth: doctor?.dateOfBirth || '',
        gender: doctor?.gender || 'male',
        address: doctor?.address || '',
        bio: doctor?.bio || '',
        languages: doctor?.languages || ['Tiếng Việt'],
        education: doctor?.education || [],
        certifications: doctor?.certifications || [],
        workingDays: doctor?.workingDays || {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: false
        }
    })

    // State và Logic cho Ngôn ngữ (Giữ lại ở Parent để đơn giản)
    const [newLanguage, setNewLanguage] = useState('')
    const addLanguage = () => {
        if (newLanguage && !formData.languages.includes(newLanguage)) {
            setFormData(prev => ({
                ...prev,
                languages: [...prev.languages, newLanguage]
            }))
            setNewLanguage('')
        }
    }
    const removeLanguage = (lang: string) => {
        setFormData(prev => ({
            ...prev,
            languages: prev.languages.filter((l: string) => l !== lang)
        }))
    }

    const isReadOnly = mode === 'view'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

                <DoctorFormHeader mode={mode} onClose={onClose} />

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    <DoctorBasicInfo
                        formData={formData}
                        setFormData={setFormData}
                        isReadOnly={isReadOnly}
                    />

                    <DoctorProfessionalInfo
                        formData={formData}
                        setFormData={setFormData}
                        isReadOnly={isReadOnly}
                    />

                    {/* Languages */}
                    {!isReadOnly && (
                        <DoctorLanguages
                            languages={formData.languages}
                            newLanguage={newLanguage}
                            setNewLanguage={setNewLanguage}
                            addLanguage={addLanguage}
                            removeLanguage={removeLanguage}
                        />
                    )}

                    {/* Working Days */}
                    <DoctorWorkingDays
                        workingDays={formData.workingDays}
                        setFormData={setFormData}
                        isReadOnly={isReadOnly}
                    />

                    {/* Form Actions */}
                    <DoctorFormActions
                        mode={mode}
                        onClose={onClose}
                        isReadOnly={isReadOnly}
                    />

                </form>
            </div>
        </div>
    )
}