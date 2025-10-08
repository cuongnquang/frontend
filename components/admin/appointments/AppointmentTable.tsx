import React from 'react'
import { Edit, Trash2, Eye, Phone, MapPin, Award } from 'lucide-react'
import { Appointment } from '@/types/types'

interface AppointmentTableRowProps {
    appointment: Appointment
    getStatusColorAppointment: (availability: Appointment['status']) => string
    onView: (appointment: Appointment) => void
    onEdit: (appointment: Appointment) => void
    onDelete: (appointment: Appointment) => void
}

const getStatusText = (availability: Appointment['status']) => {
    switch (availability) {
        case 'completed': return 'Hoàn thành'
        case 'cancelled': return 'Đã hủy'
        case 'confirmed': return 'Đã xác nhận'
        case 'pending': return 'Chờ xác nhận'
        default: return 'Không rõ'
    }
}

const AppointmentTableRow: React.FC<AppointmentTableRowProps> = ({
    appointment,
    getStatusColorAppointment,
    onView,
    onEdit,
    onDelete,
}) => (
    <tr key={appointment.appointment_id} className="hover:bg-gray-50">
        {/* Cột 1: Bệnh nhân */}
        <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">{appointment.Patient.full_name.charAt(0)}</span>
                </div>
                <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{appointment.Patient.full_name}</div>
                    <div className="text-sm text-gray-500">Mã: {appointment.patient_id}</div>
                </div>
            </div>
        </td>

        {/* Cột 2: Bác sĩ */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <p className="font-medium text-gray-900">{appointment.Doctor.full_name}</p>
            <p className="text-xs mt-1 flex items-center">
                <Award className="w-3 h-3 inline mr-1 text-gray-400" />
                {appointment.Doctor.Specialty.name}
            </p>
        </td>

        {/* Cột 3: Thời gian*/}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
            <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{new Date(appointment.DoctorSchedule.schedule_date).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="truncate max-w-xs">{appointment.DoctorSchedule.start_time} - {appointment.DoctorSchedule.end_time}</span>
            </div>
        </td>

        {/* Cột 4: Trạng Thái */}
        <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColorAppointment(appointment.status)}`}>
                {getStatusText(appointment.status)}
            </span>
        </td>

        {/* Cột 5: Triệu chứng */}
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {appointment.symptoms}
        </td>

        {/* Cột 6: Thao tác */}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-2">
                <button onClick={() => onView(appointment)} className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition" title="Xem">
                    <Eye className="w-5 h-5" />
                </button>
                <button onClick={() => onEdit(appointment)} className="text-yellow-600 hover:text-yellow-900 p-1 rounded hover:bg-yellow-50 transition" title="Sửa">
                    <Edit className="w-5 h-5" />
                </button>
                <button onClick={() => onDelete(appointment)} className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition" title="Xóa">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </td>
    </tr>
)


interface AppointmentTableProps {
    filteredAppointments: Appointment[]
    getStatusColorAppointment: (availability: Appointment['status']) => string
    onView: (appointment: Appointment) => void
    onEdit: (appointment: Appointment) => void
    onDelete: (appointment: Appointment) => void
}
export default function AppointmentTable({
    filteredAppointments,
    getStatusColorAppointment,
    onView,
    onEdit,
    onDelete,
}: AppointmentTableProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                    Danh sách Lịch hẹn
                    <span className="ml-2 text-sm text-gray-500">
                        ({filteredAppointments.length} Lịch hẹn)
                    </span>
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bệnh nhân
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bác sĩ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thời gian
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Triệu chứng
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAppointments.map((appointment) => (
                            <AppointmentTableRow
                                key={appointment.appointment_id}
                                appointment={appointment}
                                getStatusColorAppointment={getStatusColorAppointment}
                                onView={onView}
                                onEdit={onEdit}
                                onDelete={onDelete}                            />
                        ))}
                        {filteredAppointments.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-10 text-gray-500">
                                    Không tìm thấy lịch hẹn nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}