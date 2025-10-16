// components/admin/specialties/SpecialtyTable.tsx

import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Specialty } from '@/contexts/SpecialtyContext'


interface SpecialtyTableRowProps {
    specialty: Specialty
    onView: (specialty: Specialty) => void
    onEdit: (specialty: Specialty) => void
    onDelete: (specialty: Specialty) => void
}

const SpecialtyTableRow: React.FC<SpecialtyTableRowProps> = ({
    specialty,
    onView,
    onEdit,
    onDelete,
}) => (
    <tr className="hover:bg-gray-50 transition-colors">
        {/* Hình ảnh */}
        <td className="px-4 py-4 whitespace-nowrap w-24">
            {specialty.image ? (
                <img src={specialty.image} alt={specialty.name} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
            ) : (
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                    Không có ảnh
                </div>
            )}
        </td>
        {/* Tên Chuyên khoa */}
        <td className="px-6 py-4 w-48">
            <span className="font-semibold text-gray-900 text-base">{specialty.name}</span>
        </td>
        {/* Mô tả */}
        <td className="px-6 py-4 flex-1">
            <span className="text-sm text-gray-600 line-clamp-2">
                {specialty.description || <span className="text-gray-400 italic">Không có mô tả</span>}
            </span>
        </td>
        {/* Thời gian tạo */}
        <td className="px-6 py-4 w-32 whitespace-nowrap">
            <span className="text-sm text-gray-600">
                {specialty.createdAt ? new Date(specialty.createdAt).toLocaleDateString('vi-VN') : '-'}
            </span>
        </td>
        {/* Thời gian cập nhật */}
        <td className="px-6 py-4 w-32 whitespace-nowrap">
            <span className="text-sm text-gray-600">
                {specialty.updatedAt ? new Date(specialty.updatedAt).toLocaleDateString('vi-VN') : '-'}
            </span>
        </td>
        {/* Thao tác */}
        <td className="px-4 py-4 whitespace-nowrap w-28">
            <div className="flex space-x-1">
                <button 
                    onClick={() => onView(specialty)} 
                    className="inline-flex items-center justify-center w-8 h-8 text-indigo-600 hover:text-indigo-900 rounded hover:bg-indigo-50 transition" 
                    title="Xem chi tiết"
                >
                    <Eye className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => onEdit(specialty)} 
                    className="inline-flex items-center justify-center w-8 h-8 text-yellow-600 hover:text-yellow-900 rounded hover:bg-yellow-50 transition" 
                    title="Sửa"
                >
                    <Edit className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => onDelete(specialty)} 
                    className="inline-flex items-center justify-center w-8 h-8 text-red-600 hover:text-red-900 rounded hover:bg-red-50 transition" 
                    title="Xóa"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </td>
    </tr>
)

interface SpecialtyTableProps {
    specialties: Specialty[]
    onViewSpecialty: (specialty: Specialty) => void
    onEditSpecialty: (specialty: Specialty) => void
    onDeleteSpecialty: (specialty: Specialty) => void
}

export default function SpecialtyTable({
    specialties,
    onViewSpecialty,
    onEditSpecialty,
    onDeleteSpecialty,
}: SpecialtyTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold text-lg text-gray-900">Danh sách chuyên khoa</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 w-24 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Ảnh</th>
                            <th className="px-6 py-3 w-48 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Tên chuyên khoa</th>
                            <th className="px-6 py-3 flex-1 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Mô tả</th>
                            <th className="px-6 py-3 w-32 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Ngày tạo</th>
                            <th className="px-6 py-3 w-32 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide">Cập nhật</th>
                            <th className="px-4 py-3 w-28 text-center text-xs font-semibold text-gray-700 uppercase tracking-wide">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {specialties.length > 0 ? (
                            specialties.map(specialty => (
                                <SpecialtyTableRow
                                    key={specialty.id}
                                    specialty={specialty}
                                    onView={onViewSpecialty}
                                    onEdit={onEditSpecialty}
                                    onDelete={onDeleteSpecialty}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}