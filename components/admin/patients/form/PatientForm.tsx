import { useState, useEffect } from "react";
import { PatientBasicInfo } from "./PatientBasicInfo";
import PatientFormHeader from "./PatientFormHeader";
import { PatientFormProps } from "./PatientFormType";
import { PatientMedicalInfo } from "./PatientMedicalInfo";
import { PatientEmergencyContact } from "./PatientEmergencyContact";
import { PatientFormActions } from "./PatientFormActions";

export function PatientForm({ patient, onClose, onSubmit, mode }: PatientFormProps) {
    const [formData, setFormData] = useState({
        user_id: patient?.user_id || '',
        full_name: patient?.full_name || '',
        identity_number: patient?.identity_number || '',
        phone_number: patient?.phone_number || '',
        date_of_birth: patient?.date_of_birth || '',
        gender: patient?.gender || 'male',
        address: patient?.address || '',
        ethnicity: patient?.ethnicity || '',
        health_insurance_number: patient?.health_insurance_number || '',
        referral_code: patient?.referral_code || '',
        occupation: patient?.occupation || '',
        emergency_contact_name: patient?.emergency_contact_name || '',
        emergency_contact_phone: patient?.emergency_contact_phone || '',
        emergency_contact_relationship: patient?.emergency_contact_relationship || ''
    })

    const isReadOnly = mode === 'view'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <PatientFormHeader mode={mode} onClose={onClose} />
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <PatientBasicInfo 
                        formData={formData} 
                        setFormData={setFormData} 
                        isReadOnly={isReadOnly} 
                    />
                    <PatientMedicalInfo 
                        formData={formData} 
                        setFormData={setFormData} 
                        isReadOnly={isReadOnly} 
                    />
                    <PatientEmergencyContact 
                        formData={formData} 
                        setFormData={setFormData} 
                        isReadOnly={isReadOnly} 
                    />
                    <PatientFormActions 
                        onClose={onClose} 
                        isReadOnly={isReadOnly} 
                        mode={mode} 
                    />
                </form>
            </div>
        </div>
    )
}