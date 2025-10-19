import React from 'react'
import { Eye, User, Calendar, Phone, MapPin, IdCard } from 'lucide-react'
import { Patient } from '@/contexts/PatientContext'

interface PatientTableRowProps {
    patient: Patient
    calculateAge: (dob: string) => number
    onView: (patient: Patient) => void
}

const PatientTableRow: React.FC<PatientTableRowProps> = ({
    patient,
    calculateAge,
    onView,
}) => {
    return (
        <tr className="hover:bg-gray-50 border-b border-gray-200"> {/* ĐÃ XÓA key Ở ĐÂY */}
            {/* Cột 1: Bệnh nhân */}
            <td className="px-4 py-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-gray-900 truncate">
                            {patient.full_name}
                        </h3>
                        <p className="text-xs font-medium text-gray-500 mt-1">
                            Mã: {patient.patient_id}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 capitalize">
                            {patient.gender === 'male' ? 'Nam' : patient.gender === 'female' ? 'Nữ' : 'Khác'}
                        </p>
                    </div>
                </div>
            </td>

            {/* Cột 2: Thông tin cá nhân */}
            <td className="px-4 py-4">
                <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{calculateAge(patient.date_of_birth)} tuổi</span>
                    </div>
                    {patient.occupation && (
                        <p className="text-xs text-gray-500">
                            Nghề nghiệp: {patient.occupation}
                        </p>
                    )}
                    {patient.ethnicity && (
                        <p className="text-xs text-gray-500">
                            Dân tộc: {patient.ethnicity}
                        </p>
                    )}
                </div>
            </td>

            {/* Cột 3: Liên hệ & Định danh */}
            <td className="px-4 py-4">
                <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{patient.phone_number}</span>
                    </div>
                    {patient.identity_number && (
                        <div className="flex items-center text-xs text-gray-500">
                            <IdCard className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span>CMND: {patient.identity_number}</span>
                        </div>
                    )}
                </div>
            </td>

            {/* Cột 4: Địa chỉ & BHYT */}
            <td className="px-4 py-4">
                <div className="space-y-2">
                    {patient.address && (
                        <div className="flex items-start text-xs text-gray-500">
                            <MapPin className="w-3 h-3 mr-1 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{patient.address}</span>
                        </div>
                    )}
                    {patient.health_insurance_number && (
                        <div className="text-xs">
                            <span className="font-medium text-green-600">BHYT: </span>
                            <span className="text-gray-500">{patient.health_insurance_number}</span>
                        </div>
                    )}
                </div>
            </td>

            {/* Cột 5: Ngày tạo */}
            <td className="px-4 py-4">
                <div className="text-center">
                    <p className="text-sm font-bold text-gray-900">
                        {new Date(patient.created_at).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-xs text-gray-500">
                        Ngày tạo
                    </p>
                </div>
            </td>

            {/* Cột 6: Thao tác (chỉ xem) */}
            <td className="px-4 py-4">
                <div className="flex justify-center">
                    <button 
                        onClick={() => onView(patient)} 
                        className="inline-flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-900 rounded-lg hover:bg-blue-50 transition" 
                        title="Xem chi tiết"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                </div>
            </td>
        </tr>
    )
}

interface PatientTableProps {
    filteredPatients: Patient[]
    calculateAge: (dob: string) => number
    onViewPatient: (patient: Patient) => void
}

export default function PatientTable({
    filteredPatients,
    calculateAge,
    onViewPatient,
}: PatientTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                        Danh sách Bệnh nhân
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                        {filteredPatients.length} bệnh nhân
                    </span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide w-1/4">
                                Bệnh nhân
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide w-1/6">
                                Thông tin
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide w-1/6">
                                Liên hệ & Định danh
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide w-1/4">
                                Địa chỉ & BHYT
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide w-1/6">
                                Ngày tạo
                            </th>
                            <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wide w-1/12">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredPatients.map((patient) => (
                            <PatientTableRow
                                key={patient.patient_id}
                                patient={patient}
                                calculateAge={calculateAge}
                                onView={onViewPatient}
                            />
                        ))}
                    </tbody>
                </table>
                
                {/* Empty State */}
                {filteredPatients.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-500 mb-2">Không tìm thấy bệnh nhân</h3>
                        <p className="text-sm text-gray-400">Hãy thử thay đổi từ khóa tìm kiếm hoặc thêm bệnh nhân mới</p>
                    </div>
                )}
            </div>
        </div>
    )
}