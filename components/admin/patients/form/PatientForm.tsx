import { useState } from "react";
import { PatientBasicInfo } from "./PatientBasicInfo";
import PatientFormHeader from "./PatientFormHeader";
import { PatientFormProps } from "./PatientFormType";
import { PatientMedicalInfo } from "./PatientMedicalInfo";
import { PatientAlleries } from "./PatientAllergies";
import { PatientEmergencyContact } from "./PatientEmergencyContact";
import { PatientFormActions } from "./PatientFormActions";

export function PatientForm({ patient, onClose, onSubmit, mode }: PatientFormProps) {
    const [formData, setFormData] = useState({
        name: patient?.name || '',
        email: patient?.email || '',
        phone: patient?.phone || '',
        dateOfBirth: patient?.dateOfBirth || '',
        gender: patient?.gender || 'male',
        address: patient?.address || '',
        insuranceNumber: patient?.insuranceNumber || '',
        bloodType: patient?.bloodType || '',
        height: patient?.height || '',
        weight: patient?.weight || '',
        allergies: patient?.allergies || [],
        chronicConditions: patient?.chronicConditions || [],
        emergencyContactName: patient?.emergencyContactName || '',
        emergencyContactPhone: patient?.emergencyContactPhone || '',
        emergencyContactRelationship: patient?.emergencyContactRelationship || ''
    })
    const isReadOnly = mode === 'view'
    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <PatientFormHeader mode={mode} onClose={onClose} />
                <form onSubmit={onSubmit} className="p-6 space-y-6">
                    <PatientBasicInfo formData={formData} setFormData={setFormData} isReadOnly={isReadOnly} />
                    <PatientMedicalInfo formData={formData} setFormData={setFormData} isReadOnly={isReadOnly} />
                    <PatientAlleries formData={formData} setFormData={setFormData} isReadOnly={isReadOnly} />
                    <PatientEmergencyContact formData={formData} setFormData={setFormData} isReadOnly={isReadOnly} />
                    <PatientFormActions onClose={onClose} isReadOnly={isReadOnly} mode={mode} />
                </form>
            </div>
        </div>
    )
}