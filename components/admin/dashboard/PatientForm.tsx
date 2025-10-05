'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface PatientFormProps {
    patient?: any
    onClose: () => void
    onSubmit: (data: any) => void
    mode: 'create' | 'edit' | 'view'
}

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

    const [newAllergy, setNewAllergy] = useState('')
    const [newCondition, setNewCondition] = useState('')

    const isReadOnly = mode === 'view'

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const addAllergy = () => {
        if (newAllergy && !formData.allergies.includes(newAllergy)) {
            setFormData({
                ...formData,
                allergies: [...formData.allergies, newAllergy]
            })
            setNewAllergy('')
        }
    }

    const removeAllergy = (allergy: string) => {
        setFormData({
            ...formData,
            allergies: formData.allergies.filter((a: string) => a !== allergy)
        })
    }



    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {mode === 'create' ? 'Thêm Bệnh nhân Mới' :
                            mode === 'edit' ? 'Chỉnh sửa Thông tin Bệnh nhân' :
                                'Thông tin Bệnh nhân'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}


                    {/* Medical Information */}

                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin y tế</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Số BHYT
                            </label>
                            <input
                                type="text"
                                disabled={isReadOnly}
                                value={formData.insuranceNumber}
                                onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nhóm máu
                            </label>
                            <select
                                disabled={isReadOnly}
                                value={formData.bloodType}
                                onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            >
                                <option value="">Chọn nhóm máu</option>
                                <option value="A+">A+</option>
                                <option value="A-">A-</option>
                                <option value="B+">B+</option>
                                <option value="B-">B-</option>
                                <option value="AB+">AB+</option>
                                <option value="AB-">AB-</option>
                                <option value="O+">O+</option>
                                <option value="O-">O-</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Chiều cao (cm)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                disabled={isReadOnly}
                                value={formData.height}
                                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cân nặng (kg)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                disabled={isReadOnly}
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />
                        </div>
                    </div>

                    {/* Allergies */}

                    {/* Chronic Conditions */}


                    {/* Emergency Contact */}


                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            {isReadOnly ? 'Đóng' : 'Hủy'}
                        </button>
                        {!isReadOnly && (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                {mode === 'create' ? 'Thêm Bệnh nhân' : 'Cập nhật'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}