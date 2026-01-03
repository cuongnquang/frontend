import { Calendar, Clock, CreditCard, X, MapPin, User, AlertCircle, ChevronDown } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { PatientAppointment } from '@/hooks/usePatientAppointments'

interface AppointmentsListProps {
    appointments: PatientAppointment[]
    setShowCancelModal: Dispatch<SetStateAction<string | number | null>>
    isLoading: boolean
    onCancelSuccess?: () => void
}

type TabType = 'all' | 'pending' | 'completed' | 'cancelled'

const getStatusColor = (status: string) => {
    switch (status) {
        case 'confirmed':
            return 'bg-green-100 text-green-800 border border-green-300';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
        case 'completed':
            return 'bg-blue-100 text-blue-800 border border-blue-300';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border border-red-300';
        default:
            return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'confirmed':
            return '✓ Đã xác nhận';
        case 'pending':
            return '⏳ Chờ xác nhận';
        case 'completed':
            return '✔ Đã hoàn thành';
        case 'cancelled':
            return '✕ Đã hủy';
        default:
            return status;
    }
};

export default function AppointmentsList({ 
    appointments, 
    setShowCancelModal, 
    isLoading, 
    onCancelSuccess 
}: AppointmentsListProps) {
    const [activeTab, setActiveTab] = useState<TabType>('all')

    // Lọc lịch hẹn theo trạng thái và sắp xếp theo ngày mới nhất
    const getFilteredAndSortedAppointments = () => {
        let filtered = appointments;
        
        if (activeTab === 'pending') {
            filtered = appointments.filter(a => a.status === 'pending');
        } else if (activeTab === 'completed') {
            filtered = appointments.filter(a => a.status === 'completed');
        } else if (activeTab === 'cancelled') {
            filtered = appointments.filter(a => a.status === 'cancelled');
        }

        // Sắp xếp theo ngày mới nhất (từ cao xuống thấp)
        return filtered.sort((a, b) => {
            const dateA = new Date(a.schedule_date).getTime();
            const dateB = new Date(b.schedule_date).getTime();
            return dateB - dateA;
        });
    }

    const filteredAppointments = getFilteredAndSortedAppointments();
    
    const tabCounts = {
        all: appointments.length,
        pending: appointments.filter(a => a.status === 'pending').length,
        completed: appointments.filter(a => a.status === 'completed').length,
        cancelled: appointments.filter(a => a.status === 'cancelled').length,
    }

    if (isLoading) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (appointments.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
                    <p className="text-gray-600 mb-6">Bạn chưa đặt lịch khám bệnh. Hãy tìm bác sĩ phù hợp và đặt lịch ngay!</p>
                    <a href="/client/doctors" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Đặt lịch khám
                    </a>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">Lịch hẹn của tôi</h1>
                <p className="text-gray-600 mt-1">Quản lý và theo dõi các lịch hẹn khám bệnh ({appointments.length} lịch)</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="px-6 flex flex-wrap gap-2 py-4">
                    {(['all', 'pending', 'completed', 'cancelled'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <span className="capitalize">
                                {tab === 'all' ? 'Tất cả' : tab === 'pending' ? 'Chờ xác nhận' : tab === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                            </span>
                            <span className="ml-2 text-sm opacity-75">({tabCounts[tab]})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Appointments List */}
            <div className="p-6">
                {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">
                            {activeTab === 'pending' && 'Không có lịch hẹn nào đang chờ xác nhận'}
                            {activeTab === 'completed' && 'Không có lịch hẹn nào đã hoàn thành'}
                            {activeTab === 'cancelled' && 'Không có lịch hẹn nào bị hủy'}
                            {activeTab === 'all' && 'Không có lịch hẹn nào'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredAppointments.map((appointment) => {
                            const appointmentDate = new Date(appointment.schedule_date);
                            const isUpcoming = appointmentDate > new Date();
                            const initials = appointment.doctor_name
                                .split(' ')
                                .map(n => n[0])
                                .join('')
                                .toUpperCase();

                            return (
                                <div 
                                    key={appointment.id} 
                                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-4 flex-1">
                                            {/* Doctor Avatar */}
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                                {initials}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                {/* Doctor Info */}
                                                <div className="mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">BS. {appointment.doctor_name}</h3>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                                        <span className="text-blue-600 font-medium">{appointment.doctor_specialty || 'Chuyên khoa'}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center">
                                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                                            {appointment.hospital || 'Bệnh viện'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Appointment Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                    <div className="flex items-center space-x-2 text-gray-700">
                                                        <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                        <span className="text-sm">
                                                            {appointmentDate.toLocaleDateString('vi-VN', {
                                                                weekday: 'short',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center space-x-2 text-gray-700">
                                                        <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                        <span className="text-sm">
                                                            {appointment.start_time} - {appointment.end_time}
                                                        </span>
                                                    </div>
                                                    {appointment.price && (
                                                        <div className="flex items-center space-x-2 text-gray-700">
                                                            <CreditCard className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                                            <span className="text-sm font-medium">{appointment.price}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Symptoms/Notes */}
                                                {appointment.symptoms && (
                                                    <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                                                        <p className="text-xs font-medium text-blue-900 mb-1">Triệu chứng:</p>
                                                        <p className="text-sm text-blue-800">{appointment.symptoms}</p>
                                                    </div>
                                                )}

                                                {appointment.notes && (
                                                    <div className="bg-gray-50 border border-gray-200 rounded p-2">
                                                        <p className="text-xs font-medium text-gray-600 mb-1">Ghi chú:</p>
                                                        <p className="text-sm text-gray-700">{appointment.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex flex-col items-end space-y-2 ml-4">
                                            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
                                                {getStatusText(appointment.status)}
                                            </span>

                                            <div className="flex gap-2">
                                                {isUpcoming && (appointment.status === 'confirmed' || appointment.status === 'pending') && (
                                                    <button
                                                        onClick={() => setShowCancelModal(appointment.id)}
                                                        disabled={isLoading}
                                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <X className="w-4 h-4 mr-1" />
                                                        Hủy
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}