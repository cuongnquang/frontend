// components/admin/doctors/DoctorPageHeader.tsx
'use client'

import React, { useState } from 'react'
import { Plus, Download, UserCheck } from 'lucide-react'
import DoctorActivationModal from './DoctorActivationModal'

interface DoctorPageHeaderProps {
    onAddDoctor: () => void
    onExport: (type: any) => void
    onActivateDoctor: (doctorId: string) => Promise<{ success: boolean; message: string }>
}

export default function DoctorPageHeader({ onAddDoctor, onExport, onActivateDoctor }: DoctorPageHeaderProps) {
    const [showActivationModal, setShowActivationModal] = useState(false)

    return (
        <>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Bác sĩ 🧑‍⚕️</h1>
                    <p className="text-gray-600">Quản lý hồ sơ, chuyên môn và lịch làm việc của đội ngũ bác sĩ.</p>
                </div>
                <div className="flex space-x-3">
                    {/* Nút xuất Excel */}
                    <button
                        onClick={onExport}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center transition"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Xuất Excel
                    </button>
                    
                    {/* Nút thêm bác sĩ */}
                    <button
                        onClick={onAddDoctor}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm Bác sĩ
                    </button>
                    
                    {/* Nút kích hoạt bác sĩ */}
                    <button
                        onClick={() => setShowActivationModal(true)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center transition"
                    >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Kích hoạt Bác sĩ
                    </button>
                </div>
            </div>

            {/* Modal kích hoạt bác sĩ */}
            <DoctorActivationModal
                isOpen={showActivationModal}
                onClose={() => setShowActivationModal(false)}
                onActivateDoctor={onActivateDoctor}
            />
        </>
    )
}