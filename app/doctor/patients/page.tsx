'use client'

import { useState } from 'react'
import {
    Users,
    Search,
    Filter,
    User,
    Phone,
    Mail,
    Calendar,
    FileText,
    Eye,
    Edit,
    Plus,
    Heart,
    AlertTriangle,
} from 'lucide-react'

// Import component AuthGuard để bảo vệ toàn bộ trang
import { PermissionGate } from '@/lib/AuthGuard'
import { Role } from '@/types/emuns'

// Import các component con đã được chia nhỏ
import { PatientStatistics } from '@/components/doctor/PatientStatistics'
import { PatientTable } from '@/components/doctor/PatientTable'
import { PatientDetailModal } from '@/components/doctor/PatientDetailModal'
import { Patient } from '@/types/types' // Sẽ định nghĩa ở dưới

// Dữ liệu mock (tạm thời)
import { mockPatients } from '@/app/lib/mock-data' // Sẽ định nghĩa ở dưới

// Giả lập hook lấy vai trò người dùng hiện tại
const useCurrentUserRoles = (): Role[] => {
    return ['doctor']; // Thay đổi vai trò ở đây để test quyền
}

export default function DoctorPatients() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [riskFilter, setRiskFilter] = useState('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const currentUserRoles = useCurrentUserRoles()

    const filteredPatients = mockPatients.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm)
        const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
        const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter

        return matchesSearch && matchesStatus && matchesRisk
    })

    const handleViewDetails = (patient: Patient) => {
        setSelectedPatient(patient)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedPatient(null)
    }

    return (
        <PermissionGate requiredRoles={['doctor', 'admin']} userRoles={currentUserRoles} fallback={
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="p-8 bg-white rounded-xl shadow-lg text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Truy cập bị từ chối</h2>
                    <p className="text-gray-600">Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên.</p>
                </div>
            </div>
        }>
            <div className="space-y-6 p-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Danh sách Bệnh nhân</h1>
                        <p className="text-gray-600">Quản lý thông tin bệnh nhân</p>
                    </div>
                    <PermissionGate requiredRoles={['doctor']} userRoles={currentUserRoles}>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm bệnh nhân
                        </button>
                    </PermissionGate>
                </div>

                {/* Statistics Cards */}
                <PatientStatistics patients={mockPatients} />

                {/* Patient Table with Filters */}
                <PatientTable
                    patients={filteredPatients}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    riskFilter={riskFilter}
                    setRiskFilter={setRiskFilter}
                    onViewDetails={handleViewDetails}
                />

                {/* Patient Detail Modal */}
                {selectedPatient && (
                    <PatientDetailModal
                        patient={selectedPatient}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </PermissionGate>
    )
}