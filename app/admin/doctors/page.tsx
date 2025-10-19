'use client'

import { useState, useMemo } from 'react'
import { useDoctor } from '@/contexts/DoctorContext'
import DoctorPageHeader from '@/components/admin/doctors/DoctorPageHeader'
import DoctorStatistics from '@/components/admin/doctors/DoctorStatistics'
import DoctorFilters from '@/components/admin/doctors/DoctorFilters'
import DoctorTable from '@/components/admin/doctors/DoctorTable'
import { DoctorForm } from '@/components/admin/doctors/form/DoctorForm'
import { ExportReportModal } from '@/components/admin/reports/form/ExportReport'
import Alert from '@/components/ui/Alert'
import { Users } from 'lucide-react'

export default function AdminDoctors() {
    const { doctors, loading, error, fetchDoctors, fetchDoctorById, createDoctor, patchDoctor } = useDoctor()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [specializationFilter, setSpecializationFilter] = useState('all')
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState<any>(undefined);
    const [formMode, setFormMode] = useState<'create' | 'view'>('create');
    const [showExportModal, setShowExportModal] = useState(false)
    const [selectedReport, setSelectedReport] = useState<{
        type: 'doctors' | 'patients' | 'appointments' | 'revenue'
        data: any[]
        title: string
    } | null>(null)
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({
        message: '',
        type: null,
    });

    // Hiển thị alert và tự động ẩn sau 5 giây
    const showAlert = (message: string, type: 'success' | 'error') => {
        setAlert({ message, type });
        setTimeout(() => {
            setAlert({ message: '', type: null });
        }, 5000);
    };

    const availableSpecializations = useMemo(() => {
        const specs = new Set(doctors.map(d => d.specialty_name).filter(Boolean))
        return Array.from(specs).sort() as string[]
    }, [doctors])

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor => {
            const matchesSearch = doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doctor.id.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'all' || 
                (statusFilter === 'active' ? doctor.is_available : !doctor.is_available)
            const matchesSpecialization = specializationFilter === 'all' || 
                doctor.specialty_name === specializationFilter

            return matchesSearch && matchesStatus && matchesSpecialization
        })
    }, [doctors, searchTerm, statusFilter, specializationFilter])

    const handleAddDoctor = () => {
        setCurrentDoctor(undefined);
        setFormMode('create');
        setIsFormOpen(true);
    }

    const handleViewDoctor = async (doctor: any) => {
        try {
            await fetchDoctorById(doctor.id);
            setCurrentDoctor(doctor);
            setFormMode('view');
            setIsFormOpen(true);
        } catch (err) {
            console.error('Error fetching doctor details:', err);
            showAlert('Không thể tải thông tin bác sĩ', 'error');
        }
    }

    const handleFormClose = () => {
        setIsFormOpen(false);
        setCurrentDoctor(undefined);
    };

    const handleFormSubmit = async (data: any) => {
        if (formMode === 'create') {
            const result = await createDoctor({
                email: data.email,
                specialty_name: data.specialty_name,
                full_name: data.full_name,
                title: data.title || '',
                introduction: data.introduction || '',
                avatar_url: data.avatar_url || '',
                specializations: data.specializations || '',
                work_experience: data.work_experience || '',
                achievements: data.achievements || '',
                experience_years: data.experience_years || 0,
                is_available: false // Mặc định là false
            });

            if (result.success) {
                showAlert(result.message, 'success');
                await fetchDoctors(); // Refresh the list
            } else {
                showAlert(result.message, 'error');
            }
        }
        handleFormClose();
    };

    // Hàm kích hoạt bác sĩ từ DoctorActivationModal
    const handleActivateDoctor = async (doctorId: string) => {
        const result = await patchDoctor(doctorId, { is_available: true });
        
        if (result.success) {
            showAlert(result.message, 'success');
            await fetchDoctors(); // Refresh danh sách
        } else {
            showAlert(result.message, 'error');
        }
        
        return result;
    };

    const reportTypes = {
        id: 'doctors',
        title: 'Báo cáo Bác sĩ',
        description: 'Danh sách và hiệu suất bác sĩ',
        icon: Users,
        color: 'bg-blue-100 text-blue-600',
        data: doctors,
        type: 'doctors' as const
    }

    const handleExport = (report: typeof reportTypes) => {
        setSelectedReport({
            type: report.type,
            data: report.data,
            title: report.title
        })
        setShowExportModal(true)
    }

    if (loading && doctors.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Đang tải dữ liệu...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6 md:p-8 bg-gray-50 min-h-screen">
            <DoctorPageHeader
                onAddDoctor={handleAddDoctor}
                onExport={() => handleExport(reportTypes)}
                onActivateDoctor={handleActivateDoctor}
            />
            
            {/* Alert thông báo */}
            {alert.type && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                />
            )}

            {/* Hiển thị lỗi từ context */}
            {error && (
                <Alert
                    message={error}
                    type="error"
                />
            )}

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
                onViewDoctor={handleViewDoctor}
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