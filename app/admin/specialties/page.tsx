// app/admin/specialties/page.tsx
'use client';

import React, { useState } from 'react';
import SpecialtyPageHeader from '@/components/admin/specialties/SpecialtyPageHeader';
import SpecialtyForm from '@/components/admin/specialties/SpecialtyForm';
import SpecialtyDetails from '@/components/admin/specialties/SpecialtyDetails';
import SpecialtyStatistics from '@/components/admin/specialties/SpecialtyStatistics';
import SpecialtyTable from '@/components/admin/specialties/SpecialtyTable';
import { useSpecialty, Specialty, CreateSpecialtyData } from '@/contexts/SpecialtyContext';
import Alert from '@/components/ui/Alert';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

type SpecialtyFormData = {
    name: string;
    description: string;
    image?: string | null;
};

export default function SpecialtyPage() {
    const {
        specialties,
        loading,
        error,
        createSpecialty,
        updateSpecialty,
        deleteSpecialty,
    } = useSpecialty();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
    const [viewingSpecialty, setViewingSpecialty] = useState<Specialty | null>(null);
    
    // THÊM STATE CHO CONFIRM DIALOG
    const [deleteConfirm, setDeleteConfirm] = useState<{
        isOpen: boolean;
        specialty: Specialty | null;
    }>({
        isOpen: false,
        specialty: null
    });

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

    const handleAddSpecialty = () => {
        setEditingSpecialty(null);
        setIsFormOpen(true);
    };

    const handleEditSpecialty = (specialty: Specialty) => {
        setEditingSpecialty(specialty);
        setIsFormOpen(true);
    };

    const handleViewSpecialty = (specialty: Specialty) => {
        setViewingSpecialty(specialty);
    };

    const handleCloseDetails = () => {
        setViewingSpecialty(null);
    };

    const handleDeleteClick = (specialty: Specialty) => {
        setDeleteConfirm({
            isOpen: true,
            specialty
        });
    };

    const handleCancelDelete = () => {
        setDeleteConfirm({
            isOpen: false,
            specialty: null
        });
    };

    const handleConfirmDelete = async () => {
        if (deleteConfirm.specialty) {
            const result = await deleteSpecialty(deleteConfirm.specialty.id);
            showAlert(result.message, result.success ? 'success' : 'error');
            setDeleteConfirm({
                isOpen: false,
                specialty: null
            });
        }
    };

    const handleSaveSpecialty = async (formData: SpecialtyFormData) => {
        const apiData: CreateSpecialtyData = {
            name: formData.name,
            description: formData.description,
            image_url: formData.image || undefined, // base64 string
        };

        let result;

        if (editingSpecialty) {
            result = await updateSpecialty(editingSpecialty.id, apiData);
        } else {
            result = await createSpecialty(apiData);
        }

        if (result.success) {
            showAlert(result.message, 'success');
            setIsFormOpen(false);
            setEditingSpecialty(null);
        } else {
            showAlert(result.message, 'error');
        }
    };

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <SpecialtyPageHeader onAddSpecialty={handleAddSpecialty} />

            {/* Alert thông báo */}
            {alert.type && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                />
            )}

            {/* Thống kê */}
            <SpecialtyStatistics specializations={specialties.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description || '',
                image: s.image || '',
                createdAt: s.createdAt,
                updatedAt: s.updatedAt
            }))} />

            {/* Bảng danh sách chuyên khoa */}
            <SpecialtyTable
                specialties={specialties}
                onViewSpecialty={handleViewSpecialty}
                onEditSpecialty={handleEditSpecialty}
                onDeleteSpecialty={handleDeleteClick}
            />

            {/* Modal cho Thêm/Sửa */}
            {isFormOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-opacity-50">
                    <SpecialtyForm
                        initialData={editingSpecialty}
                        isEditMode={!!editingSpecialty}
                        onSave={handleSaveSpecialty}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </div>
            )}

            {/* Modal xem chi tiết */}
            {viewingSpecialty && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-opacity-50">
                    <SpecialtyDetails
                        specialty={{
                            id: viewingSpecialty.id,
                            name: viewingSpecialty.name,
                            description: viewingSpecialty.description || '',
                            image: viewingSpecialty.image || '',
                            createdAt: viewingSpecialty.createdAt,
                            updatedAt: viewingSpecialty.updatedAt
                        }}
                        onClose={handleCloseDetails}
                    />
                </div>
            )}

            {/* Confirm Dialog cho xóa */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa chuyên khoa "${deleteConfirm.specialty?.name}"? Hành động này không thể hoàn tác.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Xóa"
                cancelText="Hủy"
                type="danger"
            />

            {/* Hiển thị trạng thái loading */}
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-white bg-opacity-80">
                    <div className="text-lg font-semibold text-gray-700">Đang tải...</div>
                </div>
            )}

            {/* Hiển thị lỗi từ context */}
            {error && (
                <Alert
                    message={error}
                    type="error"
                />
            )}
        </div>
    );
}