'use client'

import { useState } from 'react'
import {
    Plus,

} from 'lucide-react'

// Import component AuthGuard để bảo vệ toàn bộ trang

import { Patient } from '@/types/types' // Sẽ định nghĩa ở dưới


export default function DoctorPatients() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [riskFilter, setRiskFilter] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)


    const handleViewDetails = (patient: Patient) => {
        setSelectedPatient(patient)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPatient(null)
    }

    return (
            <div className="space-y-6 p-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Danh sách Bệnh nhân</h1>
                        <p className="text-gray-600">Quản lý thông tin bệnh nhân</p>
                    </div>
            
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm bệnh nhân
                        </button>

                </div>

                
            </div>

    )
}