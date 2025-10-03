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
            allergies: formData.allergies.filter(a => a !== allergy)
        })
    }

    const addCondition = () => {
        if (newCondition && !formData.chronicConditions.includes(newCondition)) {
            setFormData({
                ...formData,
                chronicConditions: [...formData.chronicConditions, newCondition]
            })
            setNewCondition('')
        }
    }

    const removeCondition = (condition: string) => {
        setFormData({
            ...formData,
            chronicConditions: formData.chronicConditions.filter(c => c !== condition)
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
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên *
                                </label>
                                <input
                                    type="text"
                                    required
                                    disabled={isReadOnly}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    required
                                    disabled={isReadOnly}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    disabled={isReadOnly}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ngày sinh *
                                </label>
                                <input
                                    type="date"
                                    required
                                    disabled={isReadOnly}
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Giới tính
                                </label>
                                <select
                                    disabled={isReadOnly}
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Địa chỉ
                                </label>
                                <input
                                    type="text"
                                    disabled={isReadOnly}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div>
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
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Dị ứng
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.allergies.map((allergy) => (
                                    <span
                                        key={allergy}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                                    >
                                        {allergy}
                                        {!isReadOnly && (
                                            <button
                                                type="button"
                                                onClick={() => removeAllergy(allergy)}
                                                className="ml-2 text-red-600 hover:text-red-800"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {!isReadOnly && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newAllergy}
                                        onChange={(e) => setNewAllergy(e.target.value)}
                                        placeholder="Thêm dị ứng"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addAllergy}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Chronic Conditions */}
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bệnh mãn tính
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.chronicConditions.map((condition) => (
                                    <span
                                        key={condition}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                                    >
                                        {condition}
                                        {!isReadOnly && (
                                            <button
                                                type="button"
                                                onClick={() => removeCondition(condition)}
                                                className="ml-2 text-yellow-600 hover:text-yellow-800"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {!isReadOnly && (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newCondition}
                                        onChange={(e) => setNewCondition(e.target.value)}
                                        placeholder="Thêm bệnh mãn tính"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={addCondition}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Thêm
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Liên hệ khẩn cấp</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    disabled={isReadOnly}
                                    value={formData.emergencyContactName}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Số điện thoại
                                </label>
                                <input
                                    type="tel"
                                    disabled={isReadOnly}
                                    value={formData.emergencyContactPhone}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mối quan hệ
                                </label>
                                <input
                                    type="text"
                                    disabled={isReadOnly}
                                    value={formData.emergencyContactRelationship}
                                    onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />
                            </div>
                        </div>
                    </div>

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