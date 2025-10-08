import React from 'react'
import { Edit, Trash2, Eye, User, Star, Users, ArrowRight, BookOpen } from 'lucide-react'
import { Specialization } from './SpecializationTypes'

// --- Component phụ: SpecialtyTableRow ---
interface SpecialtyTableRowProps {
    specialty: Specialization
    onView: (specialty: Specialization) => void
    onEdit: (specialty: Specialization) => void
    onDelete: (specialty: Specialization) => void
}

const SpecialtyTableRow: React.FC<SpecialtyTableRowProps> = ({
    specialty,
    onView,
    onEdit,
    onDelete,
}) => (
    <tr key={specialty.id} className="hover:bg-gray-50">
        {/* Cột 1: Tên Chuyên khoa */}
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: specialty.colorCode }}></span>
                        {specialty.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <BookOpen className="w-3 h-3 inline mr-1 text-gray-400" />
                        Mã: {specialty.id}
                    </div>
                </div>
            </div>
        </td>

        {/* Cột 2: Trưởng khoa */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <div className="flex items-center">
                <User className="w-4 h-4 text-indigo-400 mr-2" />
                <span>{specialty.leadDoctor}</span>
            </div>
        </td>

        {/* Cột 3: Mô tả */}
        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
            {specialty.description}
        </td>

        {/* Cột 4: Thống kê */}
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-4 h-4 text-blue-500" />
                <span>{specialty.totalDoctors} BS</span>
            </div>
            <div className="mt-1 flex items-center space-x-2 text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" fill="#f59e0b" />
                <span>{specialty.avgRating.toFixed(1)} / 5.0</span>
            </div>
        </td>

        {/* Cột 5: Thao tác */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-2">
                <button onClick={() => onView(specialty)} className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition" title="Xem chi tiết">
                    <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => onEdit(specialty)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition" title="Sửa">
                    <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(specialty)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition" title="Xóa">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </td>
    </tr>
)

// --- Component chính: SpecialtyTable ---
interface SpecialtyTableProps {
    specializations: Specialization[]
    onViewSpecialty: (specialty: Specialization) => void
    onEditSpecialty: (specialty: Specialization) => void
    onDeleteSpecialty: (specialty: Specialization) => void
}

export default function SpecialtyTable({
    specializations,
    onViewSpecialty,
    onEditSpecialty,
    onDeleteSpecialty,
}: SpecialtyTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                    Danh sách Chuyên khoa
                    <span className="ml-2 text-sm text-gray-500">
                        ({specializations.length} chuyên khoa)
                    </span>
                </h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
                    Xem tất cả bác sĩ
                    <ArrowRight className="w-4 h-4 ml-1" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chuyên khoa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trưởng khoa
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mô tả
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thống kê
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {specializations.map((specialty) => (
                            <SpecialtyTableRow
                                key={specialty.id}
                                specialty={specialty}
                                onView={onViewSpecialty}
                                onEdit={onEditSpecialty}
                                onDelete={onDeleteSpecialty}
                            />
                        ))}
                        {specializations.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-gray-500">
                                    Không có chuyên khoa nào được tìm thấy.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}