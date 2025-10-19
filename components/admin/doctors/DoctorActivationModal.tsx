// components/admin/doctors/DoctorActivationModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { X, CheckCircle, User } from 'lucide-react'
import { useDoctor } from '@/contexts/DoctorContext'

interface DoctorActivationModalProps {
    isOpen: boolean
    onClose: () => void
    onActivateDoctor: (doctorId: string) => Promise<{ success: boolean; message: string }>
}

export default function DoctorActivationModal({ isOpen, onClose, onActivateDoctor }: DoctorActivationModalProps) {
    const { doctors } = useDoctor()
    const [loading, setLoading] = useState<string | null>(null)

    // Lọc danh sách bác sĩ chưa được kích hoạt
    const inactiveDoctors = doctors.filter(doctor => !doctor.is_available)

    const handleActivateDoctor = async (doctorId: string) => {
        setLoading(doctorId)
        
        try {
            const result = await onActivateDoctor(doctorId)
            // Alert sẽ được hiển thị từ parent component
        } finally {
            setLoading(null)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Kích hoạt Bác sĩ</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Danh sách bác sĩ chưa được kích hoạt trong hệ thống
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                        aria-label="Đóng"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {inactiveDoctors.length === 0 ? (
                        <div className="text-center py-8">
                            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Không có bác sĩ nào cần kích hoạt</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Tất cả bác sĩ đã được kích hoạt trong hệ thống
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {inactiveDoctors.map((doctor) => (
                                <div
                                    key={doctor.id}
                                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                            {doctor.avatar_url ? (
                                                <img
                                                    src={doctor.avatar_url}
                                                    alt={doctor.full_name}
                                                    className="w-12 h-12 object-cover"
                                                />
                                            ) : (
                                                <User className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {doctor.title} {doctor.full_name}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {doctor.specialty_name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {doctor.experience_years} năm kinh nghiệm
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleActivateDoctor(doctor.id)}
                                        disabled={loading === doctor.id}
                                        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        {loading === doctor.id ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                <span>Đang kích hoạt...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span>Kích hoạt</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Tổng số: {inactiveDoctors.length} bác sĩ chưa kích hoạt</span>
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}