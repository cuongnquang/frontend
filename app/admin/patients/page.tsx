// src/components/admin/patients/AdminPatients.tsx

'use client'

import { useState, useMemo } from 'react'
import { Patient } from '@/components/admin/patients/PatientTypes'
import PatientPageHeader from '@/components/admin/patients/PatientPageHeader'
import PatientStatistics from '@/components/admin/patients/PatientStatistics'
import PatientFilters from '@/components/admin/patients/PatientFilters'
import PatientTable from '@/components/admin/patients/PatientTable'
// import các utils nếu chúng nằm trong file riêng
// import { calculateAge, getRiskColor, getRiskText } from '../../utils/patientUtils'

// Các hàm tiện ích (tạm thời giữ trong component gốc)
const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--
    }
    return age
}

const getRiskColor = (risk: string) => {
    switch (risk) {
        case 'low': return 'bg-green-100 text-green-800'
        case 'medium': return 'bg-yellow-100 text-yellow-800'
        case 'high': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

const getRiskText = (risk: string) => {
    switch (risk) {
        case 'low': return 'Thấp'
        case 'medium': return 'TB'
        case 'high': return 'Cao'
        default: return risk
    }
}

// Mock patients data (thường sẽ được fetch từ API)
const mockPatients: Patient[] = [
    {
        id: 'BN001',
        name: 'Nguyễn Văn An',
        email: 'nva@email.com',
        phone: '0901234567',
        dateOfBirth: '1985-03-15',
        gender: 'male',
        address: 'Hà Nội',
        insuranceNumber: 'INS001',
        bloodType: 'O+',
        lastVisit: '2024-02-10',
        nextAppointment: '2024-02-20',
        totalVisits: 15,
        status: 'active',
        riskLevel: 'high'
    },
    {
        id: 'BN002',
        name: 'Trần Thị Bình',
        email: 'ttb@email.com',
        phone: '0901234568',
        dateOfBirth: '1990-07-22',
        gender: 'female',
        address: 'TP.HCM',
        insuranceNumber: 'INS002',
        bloodType: 'A+',
        lastVisit: '2024-02-08',
        totalVisits: 8,
        status: 'active',
        riskLevel: 'medium'
    },
    {
        id: 'BN003',
        name: 'Lê Văn Cường',
        email: 'lvc@email.com',
        phone: '0901234569',
        dateOfBirth: '1995-12-05',
        gender: 'male',
        address: 'Đà Nẵng',
        insuranceNumber: 'INS003',
        bloodType: 'B+',
        lastVisit: '2024-02-12',
        totalVisits: 3,
        status: 'active',
        riskLevel: 'low'
    },
    {
        id: 'BN004',
        name: 'Phạm Thị Duyên',
        email: 'ptd@email.com',
        phone: '0901234570',
        dateOfBirth: '1970-01-01',
        gender: 'female',
        address: 'Cần Thơ',
        insuranceNumber: 'INS004',
        bloodType: 'AB-',
        lastVisit: '2024-01-01',
        totalVisits: 25,
        status: 'inactive',
        riskLevel: 'high'
    }
]

export default function AdminPatients() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [riskFilter, setRiskFilter] = useState('all')

    const patients = mockPatients // Trong thực tế, đây sẽ là state hoặc kết quả từ hook API

    const filteredPatients = useMemo(() => {
        return patients.filter(patient => {
            const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                patient.phone.includes(searchTerm)
            const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
            const matchesRisk = riskFilter === 'all' || patient.riskLevel === riskFilter

            return matchesSearch && matchesStatus && matchesRisk
        })
    }, [patients, searchTerm, statusFilter, riskFilter])

    // --- Action Handlers ---
    const handleAddPatient = () => alert('Mở form thêm bệnh nhân')
    const handleExport = () => alert('Tiến hành xuất dữ liệu')
    const handleImport = () => alert('Mở dialog nhập dữ liệu')
    const handleViewPatient = (id: string) => alert(`Xem chi tiết bệnh nhân: ${id}`)
    const handleEditPatient = (id: string) => alert(`Chỉnh sửa bệnh nhân: ${id}`)
    const handleDeletePatient = (id: string) => {
        if (confirm(`Bạn có chắc chắn muốn xóa bệnh nhân ${id}?`)) {
            alert(`Xóa bệnh nhân ${id}`)
            // Thực hiện logic xóa API
        }
    }

    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
            {/* 1. Header */}
            <PatientPageHeader
                onAddPatient={handleAddPatient}
                onExport={handleExport}
                onImport={handleImport}
            />

            {/* 2. Statistics */}
            <PatientStatistics patients={patients} />

            {/* 3. Filters */}
            <PatientFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                riskFilter={riskFilter}
                setRiskFilter={setRiskFilter}
            />

            {/* 4. Patients Table */}
            <PatientTable
                filteredPatients={filteredPatients}
                calculateAge={calculateAge}
                getRiskColor={getRiskColor}
                getRiskText={getRiskText}
                onViewPatient={handleViewPatient}
                onEditPatient={handleEditPatient}
                onDeletePatient={handleDeletePatient}
            />
        </div>
    )
}