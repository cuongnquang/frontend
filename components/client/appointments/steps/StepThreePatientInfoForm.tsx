import React from 'react'
import { PatientInfo } from '../AppointmentTypes'

interface StepThreeProps {
    patientInfo: PatientInfo
    handlePatientInfoChange: (field: string, value: string) => void
}

const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

export default function StepThreePatientInfoForm({ patientInfo, handlePatientInfoChange }: StepThreeProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông tin bệnh nhân
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={patientInfo.fullName}
                        onChange={(e) => handlePatientInfoChange('fullName', e.target.value)}
                        className={inputClass}
                        placeholder="Nhập họ và tên"
                        required
                    />
                </div>
                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        value={patientInfo.phone}
                        onChange={(e) => handlePatientInfoChange('phone', e.target.value)}
                        className={inputClass}
                        placeholder="Nhập số điện thoại"
                        required
                    />
                </div>
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        value={patientInfo.email}
                        onChange={(e) => handlePatientInfoChange('email', e.target.value)}
                        className={inputClass}
                        placeholder="Nhập email"
                        required
                    />
                </div>
                {/* Birth Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                    </label>
                    <input
                        type="date"
                        value={patientInfo.birthDate}
                        onChange={(e) => handlePatientInfoChange('birthDate', e.target.value)}
                        className={inputClass}
                    />
                </div>
                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giới tính
                    </label>
                    <select
                        value={patientInfo.gender}
                        onChange={(e) => handlePatientInfoChange('gender', e.target.value)}
                        className={inputClass}
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </select>
                </div>
                {/* Address */}
                <div className='md:col-span-2'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ
                    </label>
                    <input
                        type="text"
                        value={patientInfo.address}
                        onChange={(e) => handlePatientInfoChange('address', e.target.value)}
                        className={inputClass}
                        placeholder="Nhập địa chỉ"
                    />
                </div>
                {/* Symptoms */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Triệu chứng/Lý do khám
                    </label>
                    <textarea
                        value={patientInfo.symptoms}
                        onChange={(e) => handlePatientInfoChange('symptoms', e.target.value)}
                        rows={3}
                        className={inputClass}
                        placeholder="Mô tả triệu chứng hoặc lý do khám bệnh"
                    />
                </div>
                {/* Notes */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú thêm
                    </label>
                    <textarea
                        value={patientInfo.notes}
                        onChange={(e) => handlePatientInfoChange('notes', e.target.value)}
                        rows={2}
                        className={inputClass}
                        placeholder="Ghi chú thêm (không bắt buộc)"
                    />
                </div>
            </div>
        </div>
    )
}