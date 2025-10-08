'use client'

import React, { useState } from 'react'
import SpecialtyPageHeader from '@/components/admin/specialties/SpecialtyPageHeader'
import SpecialtyStatistics from '@/components/admin/specialties/SpecialtyStatistics'
import SpecialtyTable from '@/components/admin/specialties/SpecialtyTable'
import SpecialtyForm from '@/components/admin/specialties/SpecialtyForm'
import SpecialtyDetails from '@/components/admin/specialties/SpecialtyDetails' 
import { Specialization, mockSpecializations } from '@/components/admin/specialties/SpecializationTypes'

// Helper function để tạo ID ngẫu nhiên cho chuyên khoa mới
const generateNewId = (prefix: string, currentLength: number) => {
    return `${prefix}${String(currentLength + 1).padStart(3, '0')}`
}

// Kiểu dữ liệu form cho cả thêm mới và sửa
type SpecializationFormData = Omit<Specialization, 'id' | 'totalDoctors' | 'avgRating'> 

export default function SpecialtyPage() {
    const [specialties, setSpecialties] = useState<Specialization[]>(mockSpecializations)
    
    // State quản lý Modal cho Thêm/Sửa
    const [isFormOpen, setIsFormOpen] = useState(false) 
    const [editingSpecialty, setEditingSpecialty] = useState<Specialization | null>(null)

    // State quản lý Modal Xem chi tiết
    const [viewingSpecialty, setViewingSpecialty] = useState<Specialization | null>(null)

    // --- Xử lý Thêm/Sửa ---
    const handleAddSpecialty = () => {
        setEditingSpecialty(null) // Chuyển sang chế độ Thêm mới
        setIsFormOpen(true)
    }

    const handleEditSpecialty = (specialty: Specialization) => {
        setEditingSpecialty(specialty) // Đặt đối tượng cần sửa
        setIsFormOpen(true)
    }

    const handleSaveSpecialty = (formData: SpecializationFormData) => {
        if (editingSpecialty) {
            // Logic Sửa (Edit)
            setSpecialties(prev => prev.map(s => 
                s.id === editingSpecialty.id 
                    ? { ...s, ...formData } // Cập nhật các trường từ form
                    : s
            ))
            alert(`Đã cập nhật chuyên khoa: ${formData.name}`)
        } else {
            // Logic Thêm mới (Add)
            const newSpecialty: Specialization = {
                id: generateNewId('SP', specialties.length),
                name: formData.name,
                description: formData.description,
                leadDoctor: formData.leadDoctor,
                colorCode: formData.colorCode,
                totalDoctors: 0, 
                avgRating: 0, 
            }
            setSpecialties(prev => [...prev, newSpecialty])
            alert(`Đã thêm chuyên khoa mới: ${newSpecialty.name}`)
        }
        
        // Đóng form và reset state
        setIsFormOpen(false)
        setEditingSpecialty(null)
    }

    // --- Xử lý Xem chi tiết ---
    const handleViewSpecialty = (specialty: Specialization) => {
        setViewingSpecialty(specialty)
    }

    // --- Xử lý Xóa ---
    const handleDeleteSpecialty = (specialty: Specialization) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa chuyên khoa "${specialty.name}"?`)) {
            setSpecialties(prev => prev.filter(s => s.id !== specialty.id))
            alert(`Đã xóa chuyên khoa ${specialty.name}`)
        }
    }

    // --- Các hàm khác ---
    const handleExport = () => alert('Xuất dữ liệu chuyên khoa ra Excel.')

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <SpecialtyPageHeader
                onAddSpecialty={handleAddSpecialty}
                onExport={handleExport}
            />

            <SpecialtyStatistics specializations={specialties} />

            <SpecialtyTable
                specializations={specialties}
                onViewSpecialty={handleViewSpecialty} // Gọi hàm mở modal xem chi tiết
                onEditSpecialty={handleEditSpecialty} // Gọi hàm mở modal sửa
                onDeleteSpecialty={handleDeleteSpecialty}
            />

            {/* Modal cho Thêm/Sửa */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <SpecialtyForm
                        initialData={editingSpecialty} // Truyền dữ liệu nếu đang sửa
                        isEditMode={!!editingSpecialty} // Xác định chế độ Thêm/Sửa
                        onSave={handleSaveSpecialty} 
                        onCancel={() => setIsFormOpen(false)} 
                    />
                </div>
            )}

            {/* Modal Xem chi tiết */}
            {viewingSpecialty && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <SpecialtyDetails
                        specialty={viewingSpecialty}
                        onClose={() => setViewingSpecialty(null)}
                    />
                </div>
            )}
        </div>
    )
}