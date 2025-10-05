'use client'

import { useState, useMemo } from 'react'
import { Doctor } from '@/components/admin/doctors/DoctorTypes'
import DoctorPageHeader from '@/components/admin/doctors/DoctorPageHeader'
import DoctorStatistics from '@/components/admin/doctors/DoctorStatistics'
import DoctorFilters from '@/components/admin/doctors/DoctorFilters'
import DoctorTable from '@/components/admin/doctors/DoctorTable'
import { DoctorForm } from '@/components/admin/doctors/form/DoctorForm'
import { ExportReportModal } from '@/components/admin/reports/form/ExportReport'
import { Users } from 'lucide-react'

// --- Hàm tiện ích ---
const getAvailabilityColor = (availability: Doctor['availability']) => {
    switch (availability) {
        case 'available': return 'bg-green-100 text-green-800'
        case 'busy': return 'bg-yellow-100 text-yellow-800'
        case 'off': return 'bg-red-100 text-red-800'
        default: return 'bg-gray-100 text-gray-800'
    }
}

// Mock doctors data (sử dụng dữ liệu gốc bạn cung cấp, đã sửa lỗi cú pháp)
const mockDoctors: Doctor[] = [
    {
        id: 'BS001',
        name: 'BS. Nguyễn Văn An',
        email: 'nva@youmed.vn',
        phone: '0901234567',
        specialization: 'Tim mạch',
        licenseNumber: 'BS-001-2024',
        qualification: 'Thạc sĩ',
        experience: 15,
        consultationFee: 500000,
        rating: 4.9,
        totalPatients: 1250,
        availability: 'available',
        status: 'active',
        joinDate: '2020-01-15'
    },
    {
        id: 'BS002',
        name: 'BS. Trần Thị Bình',
        email: 'ttb@youmed.vn',
        phone: '0901234568',
        specialization: 'Da liễu',
        licenseNumber: 'BS-002-2023',
        qualification: 'Tiến sĩ',
        experience: 8,
        consultationFee: 750000,
        rating: 4.5,
        totalPatients: 800,
        availability: 'busy',
        status: 'active',
        joinDate: '2021-05-20'
    },
    {
        id: 'BS003',
        name: 'BS. Lê Văn Cường',
        email: 'lvc@youmed.vn',
        phone: '0901234569',
        specialization: 'Nhi khoa',
        licenseNumber: 'BS-003-2022',
        qualification: 'Chuyên khoa I',
        experience: 5,
        consultationFee: 400000,
        rating: 4.2,
        totalPatients: 1500,
        availability: 'off',
        status: 'inactive',
        joinDate: '2022-11-01'
    },
    {
        id: 'BS004',
        name: 'BS. Phạm Thị Duyên',
        email: 'ptd@youmed.vn',
        phone: '0901234570',
        specialization: 'Tim mạch',
        licenseNumber: 'BS-004-2021',
        qualification: 'Bác sĩ',
        experience: 10,
        consultationFee: 500000,
        rating: 4.8,
        totalPatients: 950,
        availability: 'available',
        status: 'active',
        joinDate: '2019-03-10'
    }
]

export default function AdminDoctors() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [specializationFilter, setSpecializationFilter] = useState('all')
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState<Doctor | undefined>(undefined);
    const [formMode, setFormMode] = useState<'create' | 'edit' | 'view'>('create');
    const [doctors, setDoctors] = useState(mockDoctors);
    const [showExportModal, setShowExportModal] = useState(false)
    const [selectedReport, setSelectedReport] = useState<{
        type: 'doctors' | 'patients' | 'appointments' | 'revenue'
        data: any[]
        title: string
    } | null>(null)

    const availableSpecializations = useMemo(() => {
        const specs = new Set(doctors.map(d => d.specialization))
        return Array.from(specs).sort()
    }, [doctors])

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.phone.includes(searchTerm)
            const matchesStatus = statusFilter === 'all' || doctor.status === statusFilter
            const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter

            return matchesSearch && matchesStatus && matchesSpecialization
        })
    }, [doctors, searchTerm, statusFilter, specializationFilter])

    const handleAddDoctor = () => {
        setCurrentDoctor(undefined);
        setFormMode('create');
        setIsFormOpen(true);
    }
    const handleImport = () => console.log('Mở dialog nhập dữ liệu bác sĩ')

    const handleViewDoctor = (doctor: Doctor) => {
        setCurrentDoctor(doctor);
        setFormMode('view');
        setIsFormOpen(true);
    }
    const handleEditDoctor = (doctor: Doctor) => {
        setCurrentDoctor(doctor);
        setFormMode('edit');
        setIsFormOpen(true);
    }
    const handleDeleteDoctor = (doctor: Doctor) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa bác sĩ ${doctor.name} không?`)) {
            console.log(`Đã gửi yêu cầu xóa bác sĩ ${doctor.name}`)
        }
    }
    const handleFormClose = () => {
        setIsFormOpen(false);
        setCurrentDoctor(undefined); // Reset bác sĩ hiện tại khi đóng
    };
    const handleFormSubmit = (data: any) => {
        console.log('Dữ liệu form đã gửi:', data);

        if (formMode === 'create') {
            // Logic thêm mới
            const newDoctor = { ...data, id: Date.now() } as Doctor;
            setDoctors(prev => [...prev, newDoctor]);
            alert(`Đã thêm bác sĩ: ${data.name}`);
        } else if (formMode === 'edit' && currentDoctor) {
            // Logic chỉnh sửa
            setDoctors(prev => prev.map(d => d.id === currentDoctor.id ? { ...currentDoctor, ...data } : d));
            alert(`Đã cập nhật bác sĩ: ${data.name}`);
        }

        handleFormClose(); // Đóng form sau khi submit thành công
    };
    const reportTypes = {
        id: 'doctors',
        title: 'Báo cáo Bác sĩ',
        description: 'Danh sách và hiệu suất bác sĩ',
        icon: Users,
        color: 'bg-blue-100 text-blue-600',
        data: mockDoctors,
        type: 'doctors' as const
    }
    const handleExport = (report: typeof reportTypes) => {
        setSelectedReport({
            type: reportTypes.type,
            data: reportTypes.data,
            title: reportTypes.title
        })
        setShowExportModal(true)
    }


    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
            <DoctorPageHeader
                onAddDoctor={handleAddDoctor}
                onExport={handleExport}
                onImport={handleImport}
            />
            <DoctorStatistics doctors={doctors} />
            <DoctorFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                specializationFilter={specializationFilter}
                setSpecializationFilter={setSpecializationFilter}
                availableSpecializations={availableSpecializations}
            />
            <DoctorTable
                filteredDoctors={filteredDoctors}
                getAvailabilityColor={getAvailabilityColor}
                onViewDoctor={handleViewDoctor}
                onEditDoctor={handleEditDoctor}
                onDeleteDoctor={handleDeleteDoctor}
            />
            {isFormOpen && (
                <DoctorForm
                    doctor={currentDoctor}
                    onClose={handleFormClose}
                    onSubmit={handleFormSubmit}
                    mode={formMode}
                />
            )}
            {showExportModal && selectedReport && (
                <ExportReportModal
                    isOpen={showExportModal}
                    onClose={() => setShowExportModal(false)}
                    reportType={selectedReport.type}
                    data={selectedReport.data}
                    title={selectedReport.title}
                />
            )}
        </div>
    )
}