import React from 'react'
import { Edit, Trash2, Eye, Mail, Phone, MapPin, Award, Star, Clock, CheckCircle, XCircle, PauseCircle } from 'lucide-react'
import { Doctor } from './DoctorTypes'

// --- Component phụ: DoctorTableRow ---
interface DoctorTableRowProps {
    doctor: Doctor
    getAvailabilityColor: (availability: Doctor['availability']) => string
    onView: (doctor: Doctor) => void
    onEdit: (doctor: Doctor) => void
    onDelete: (doctor: Doctor) => void
}

const getAvailabilityText = (availability: Doctor['availability']) => {
    switch (availability) {
        case 'available': return 'Sẵn sàng'
        case 'busy': return 'Đang bận'
        case 'off': return 'Nghỉ'
        default: return 'Không rõ'
    }
}

const DoctorTableRow: React.FC<DoctorTableRowProps> = ({
    doctor,
    getAvailabilityColor,
    onView,
    onEdit,
    onDelete,
}) => (
    <tr key={doctor.id} className="hover:bg-gray-50">
        {/* Cột 1: Bác sĩ */}
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">{doctor.name.charAt(4)}</span>
                </div>
                <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                    <div className="text-sm text-gray-500">Mã: {doctor.id}</div>
                </div>
            </div>
        </td>

        {/* Cột 2: Chuyên môn */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <p className="font-medium text-gray-900">{doctor.specialization}</p>
            <p className="text-xs mt-1 flex items-center">
                <Award className="w-3 h-3 inline mr-1 text-gray-400" />
                {doctor.qualification} ({doctor.experience} năm KN)
            </p>
        </td>

        {/* Cột 3: Liên hệ/Mã số */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{doctor.phone}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate max-w-xs">{doctor.licenseNumber}</span>
            </div>
        </td>

        {/* Cột 4: Đánh giá & Bệnh nhân */}
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" fill="#f59e0b" />
                <span>{doctor.rating.toFixed(1)} / 5.0</span>
            </div>
            <p className="mt-1 text-xs font-medium text-gray-500">
                {doctor.totalPatients.toLocaleString()} bệnh nhân
            </p>
        </td>

        {/* Cột 5: Tình trạng */}
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAvailabilityColor(doctor.availability)}`}>
                {getAvailabilityText(doctor.availability)}
            </span>
        </td>

        {/* Cột 6: Thao tác */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-2">
                <button onClick={() => onView(doctor)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition" title="Xem">
                    <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => onEdit(doctor)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition" title="Sửa">
                    <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(doctor)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition" title="Xóa">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </td>
    </tr>
)

// --- Component chính: DoctorTable ---
interface DoctorTableProps {
    filteredDoctors: Doctor[]
    getAvailabilityColor: (availability: Doctor['availability']) => string
    onViewDoctor: (doctor: Doctor) => void
    onEditDoctor: (doctor: Doctor) => void
    onDeleteDoctor: (doctor: Doctor) => void
}

export default function DoctorTable({
    filteredDoctors,
    getAvailabilityColor,
    onViewDoctor,
    onEditDoctor,
    onDeleteDoctor,
}: DoctorTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Danh sách Bác sĩ
                    <span className="ml-2 text-sm text-gray-500">
                        ({filteredDoctors.length} bác sĩ)
                    </span>
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bác sĩ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chuyên môn
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Liên hệ/Mã số
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Đánh giá
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tình trạng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDoctors.map((doctor) => (
                            <DoctorTableRow
                                key={doctor.id}
                                doctor={doctor}
                                getAvailabilityColor={getAvailabilityColor}
                                onView={onViewDoctor}
                                onEdit={onEditDoctor}
                                onDelete={onDeleteDoctor}
                            />
                        ))}
                        {filteredDoctors.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500">
                                    Không tìm thấy bác sĩ nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}