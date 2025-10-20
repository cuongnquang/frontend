import { Calendar, Clock, CreditCard, X, Star } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface Appointment {
    id: number
    doctorName: string
    doctorSpecialty: string
    hospital: string
    date: string
    time: string
    status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
    price: string
    notes?: string
}

interface AppointmentsListProps {
    appointments: Appointment[]
    setShowCancelModal: Dispatch<SetStateAction<number | null>>
    isLoading: boolean
    getStatusColor: (status: string) => string
    getStatusText: (status: string) => string
}

export default function AppointmentsList({ appointments, setShowCancelModal, isLoading, getStatusColor, getStatusText }: AppointmentsListProps) {
    if (appointments.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
                    <p className="text-gray-600 mb-6">Bạn chưa đặt lịch khám bệnh. Hãy tìm bác sĩ phù hợp và đặt lịch ngay!</p>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Đặt lịch khám
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
                <p className="text-gray-600 mt-1">Quản lý và theo dõi các lịch hẹn khám bệnh</p>
            </div>

            <div className="p-6 space-y-4">
                {appointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{appointment.doctorName}</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                        {getStatusText(appointment.status)}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">
                                    Chuyên khoa: **{appointment.doctorSpecialty}** | Bệnh viện: **{appointment.hospital}**
                                </p>

                                <div className="flex items-center space-x-6 text-gray-700 text-sm">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-1.5 text-blue-500" />
                                        <span>Ngày: {new Date(appointment.date).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-1.5 text-blue-500" />
                                        <span>Giờ: {appointment.time}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <CreditCard className="w-4 h-4 mr-1.5 text-blue-500" />
                                        <span>Chi phí: {appointment.price}</span>
                                    </div>
                                </div>

                                {appointment.notes && (
                                    <p className="mt-3 text-sm text-gray-500 italic">Ghi chú: {appointment.notes}</p>
                                )}
                            </div>

                            <div className="flex flex-col space-y-2 ml-4">
                                {(appointment.status === 'confirmed' || appointment.status === 'pending') && (
                                    <button
                                        onClick={() => setShowCancelModal(appointment.id)}
                                        disabled={isLoading}
                                        className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Hủy lịch
                                    </button>
                                )}
                                {appointment.status === 'completed' && (
                                    <button
                                        className="flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <Star className="w-4 h-4 mr-2" />
                                        Đánh giá
                                    </button>
                                )}
                                <button
                                    className="flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}