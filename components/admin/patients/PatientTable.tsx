import React from 'react'
import { Edit, Trash2, Eye, Mail, Phone, Calendar, AlertTriangle, FileText } from 'lucide-react'
import { Patient } from './PatientTypes'

// Giả định các hàm tiện ích được truyền từ AdminPatients.tsx
interface PatientTableRowProps {
    patient: Patient
    getRiskColor: (risk: string) => string
    getRiskText: (risk: string) => string
    calculateAge: (dob: string) => number
    onView: (id: string) => void
    onEdit: (id: string) => void
    onDelete: (id: string) => void
}

const PatientTableRow: React.FC<PatientTableRowProps> = ({
    patient,
    getRiskColor,
    getRiskText,
    calculateAge,
    onView,
    onEdit,
    onDelete,
}) => (
    <tr key={patient.id} className="hover:bg-gray-50">
        {/* Cột 1: Bệnh nhân */}
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">{patient.name.charAt(0)}</span>
                </div>
                <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500">Mã: {patient.id}</div>
                </div>
            </div>
        </td>

        {/* Cột 2: Thông tin cơ bản */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <p>
                <Calendar className="w-4 h-4 inline mr-1 text-gray-400" />
                {calculateAge(patient.dateOfBirth)} tuổi ({patient.dateOfBirth})
            </p>
            <p className="mt-1">
                <AlertTriangle className="w-4 h-4 inline mr-1 text-gray-400" />
                {patient.bloodType} | {patient.gender === 'male' ? 'Nam' : 'Nữ'}
            </p>
        </td>

        {/* Cột 3: Liên hệ */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate max-w-xs">{patient.email}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{patient.phone}</span>
            </div>
        </td>

        {/* Cột 4: Lịch khám */}
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
                <FileText className="w-4 h-4" />
                <span>Tổng: {patient.totalVisits} lượt</span>
            </div>
            <p className={`mt-1 text-xs font-medium ${patient.nextAppointment ? 'text-blue-600' : 'text-gray-500'}`}>
                Hẹn tới: {patient.nextAppointment || 'Chưa đặt'}
            </p>
        </td>

        {/* Cột 5: Rủi ro */}
        <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(patient.riskLevel)}`}>
                {getRiskText(patient.riskLevel)}
            </span>
        </td>

        {/* Cột 6: Thao tác */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-2">
                <button onClick={() => onView(patient.id)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition">
                    <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => onEdit(patient.id)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition">
                    <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(patient.id)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </td>
    </tr>
)


// Component chính: PatientTable (Phần này không thay đổi)
interface PatientTableProps {
    filteredPatients: Patient[]
    calculateAge: (dob: string) => number
    getRiskColor: (risk: string) => string
    getRiskText: (risk: string) => string
    onViewPatient: (id: string) => void
    onEditPatient: (id: string) => void
    onDeletePatient: (id: string) => void
}

export default function PatientTable({
    filteredPatients,
    calculateAge,
    getRiskColor,
    getRiskText,
    onViewPatient,
    onEditPatient,
    onDeletePatient,
}: PatientTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Danh sách bệnh nhân
                    <span className="ml-2 text-sm text-gray-500">
                        ({filteredPatients.length} bệnh nhân)
                    </span>
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bệnh nhân
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thông tin
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Liên hệ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Lịch khám
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rủi ro
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPatients.map((patient) => (
                            <PatientTableRow
                                key={patient.id}
                                patient={patient}
                                calculateAge={calculateAge}
                                getRiskColor={getRiskColor}
                                getRiskText={getRiskText}
                                onView={onViewPatient}
                                onEdit={onEditPatient}
                                onDelete={onDeletePatient}
                            />
                        ))}
                        {filteredPatients.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500">
                                    Không tìm thấy bệnh nhân nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}