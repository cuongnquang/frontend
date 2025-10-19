import React from 'react'
import { Eye, Mail, Phone, Award, Star, Clock } from 'lucide-react'
import { Doctor } from '@/contexts/DoctorContext'

interface DoctorTableRowProps {
    doctor: Doctor
    onView: (doctor: Doctor) => void
}

const getAvailabilityText = (isAvailable: boolean) => {
    return isAvailable ? 'Sẵn sàng' : 'Không khả dụng'
}

const getAvailabilityColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
}

const DoctorTableRow: React.FC<DoctorTableRowProps> = ({
    doctor,
    onView,
}) => (
    <tr key={doctor.id} className="hover:bg-gray-50">
        {/* Cột 1: Bác sĩ - Thu hẹp lại */}
        <td className="px-4 py-4 whitespace-nowrap w-48">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden">
                    {doctor.avatar_url ? (
                        <img 
                            src={doctor.avatar_url} 
                            alt={doctor.full_name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    <div 
                        className={`w-full h-full flex items-center justify-center bg-indigo-100 ${
                            doctor.avatar_url ? 'hidden' : 'flex'
                        }`}
                    >
                        <span className="text-indigo-600 font-semibold text-sm">
                            {doctor.full_name?.charAt(0) || 'B'}
                        </span>
                    </div>
                </div>
                <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                        {doctor.title} {doctor.full_name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">Mã: {doctor.id}</div>
                </div>
            </div>
        </td>

        {/* Cột 2: Chuyên môn - Thu hẹp lại */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 w-40">
            <p className="font-medium text-gray-900">{doctor.specialty_name}</p>
            <p className="text-xs mt-1 flex items-center">
                <Award className="w-3 h-3 inline mr-1 text-gray-400" />
                {doctor.experience_years} năm KN
            </p>
        </td>

        {/* Cột 3: Kinh nghiệm - Thu hẹp lại */}
        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 w-32">
            <div className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span>{doctor.experience_years} năm</span>
            </div>
        </td>

        {/* Cột 4: Giới thiệu - Mở rộng hơn */}
        <td className="px-4 py-4 text-sm text-gray-600 min-w-80 max-w-96">
            <p className="line-clamp-2">
                {doctor.introduction || 'Chưa có giới thiệu'}
            </p>
        </td>

        {/* Cột 5: Tình trạng - Căn giữa và giữ bên phải */}
        <td className="px-4 py-4 whitespace-nowrap text-center w-28">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAvailabilityColor(doctor.is_available)}`}>
                {getAvailabilityText(doctor.is_available)}
            </span>
        </td>

        {/* Cột 6: Thao tác - Căn giữa và giữ bên phải */}
        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-center w-28">
            <div className="flex justify-center">
                <button 
                    onClick={() => onView(doctor)} 
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition" 
                    title="Xem chi tiết"
                >
                    <Eye className="w-5 h-5" />
                </button>
            </div>
        </td>
    </tr>
)

interface DoctorTableProps {
    filteredDoctors: Doctor[]
    onViewDoctor: (doctor: Doctor) => void
}

export default function DoctorTable({
    filteredDoctors,
    onViewDoctor,
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
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-48">
                                Bác sĩ
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-40">
                                Chuyên môn
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-32">
                                Kinh nghiệm
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider min-w-80">
                                Giới thiệu
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-28">
                                Tình trạng
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-20">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDoctors.map((doctor) => (
                            <DoctorTableRow
                                key={doctor.id}
                                doctor={doctor}
                                onView={onViewDoctor}
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