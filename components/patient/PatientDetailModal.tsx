import React from 'react'
import {
    User, Phone, Mail, MapPin, Calendar, FileText, Heart, AlertTriangle, CheckCircle,
    X
} from 'lucide-react'
import { Patient } from '@/types/types' // Import interface Patient

interface PatientDetailModalProps {
    patient: Patient
    isOpen: boolean
    onClose: () => void
}

const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'low': return 'text-green-600 bg-green-100'
        case 'medium': return 'text-yellow-600 bg-yellow-100'
        case 'high': return 'text-red-600 bg-red-100'
        default: return 'text-gray-600 bg-gray-100'
    }
}

const getRiskText = (risk: string) => {
    switch (risk) {
        case 'low': return 'Thấp'
        case 'medium': return 'Trung bình'
        case 'high': return 'Cao'
        default: return risk
    }
}

const getRiskIcon = (risk: string) => {
    switch (risk) {
        case 'low': return <Heart className="w-4 h-4" />
        case 'medium': return <AlertTriangle className="w-4 h-4" />
        case 'high': return <AlertTriangle className="w-4 h-4" />
        default: return <Heart className="w-4 h-4" />
    }
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, isOpen, onClose }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="relative p-8 bg-white w-full max-w-2xl mx-auto rounded-xl shadow-lg transform transition-all duration-300 scale-95 md:scale-100">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                >
                    <X className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                    <User className="w-6 h-6 text-indigo-600" />
                    <span>Hồ sơ Bệnh nhân: {patient.name}</span>
                </h2>

                <div className="space-y-6">
                    {/* General Information */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chung</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-500" />
                                <div><p className="text-sm font-medium">Email</p><p className="text-sm text-gray-600">{patient.email}</p></div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-gray-500" />
                                <div><p className="text-sm font-medium">Điện thoại</p><p className="text-sm text-gray-600">{patient.phone}</p></div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <div><p className="text-sm font-medium">Địa chỉ</p><p className="text-sm text-gray-600">{patient.address}</p></div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <div><p className="text-sm font-medium">Ngày sinh</p><p className="text-sm text-gray-600">{patient.dateOfBirth}</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Information */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Hồ sơ y tế</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="font-medium text-gray-800 mb-2">Tiền sử bệnh lý:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                    {patient.medicalHistory.map((item, index) => <li key={index}>{item}</li>)}
                                    {patient.medicalHistory.length === 0 && <li>Không có thông tin</li>}
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 mb-2">Dị ứng:</p>
                                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                    {patient.allergies.map((item, index) => <li key={index}>{item}</li>)}
                                    {patient.allergies.length === 0 && <li>Không có thông tin</li>}
                                </ul>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 mb-2">Mức độ nguy cơ:</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${getRiskColor(patient.riskLevel)}`}>
                                    {getRiskIcon(patient.riskLevel)}
                                    <span className="ml-1">{getRiskText(patient.riskLevel)}</span>
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800 mb-2">Số thẻ bảo hiểm:</p>
                                <p className="text-sm text-gray-600">{patient.insuranceNumber || 'Không có'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Emergency Contact */}
                    {patient.emergencyContact && (
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Liên hệ khẩn cấp</h3>
                            <div className="flex items-center space-x-3">
                                <User className="w-5 h-5 text-gray-500" />
                                <div>
                                    <p className="text-sm font-medium">{patient.emergencyContact.name}</p>
                                    <p className="text-sm text-gray-600">({patient.emergencyContact.relationship}) - {patient.emergencyContact.phone}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer buttons */}
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}