import { Calendar, Clock, CreditCard, X, MapPin, User, AlertCircle, ChevronDown } from 'lucide-react'
import { Dispatch, SetStateAction, useState } from 'react'

// Mock LoadingSpinner component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

interface PatientAppointment {
  id: number
  doctor_name: string
  doctor_avatar?: string
  schedule_date: string
  start_time: string
  end_time: string
  price?: string
  symptoms?: string
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}

interface AppointmentsListProps {
  appointments: PatientAppointment[]
  setShowCancelModal: Dispatch<SetStateAction<number | null>>
  isLoading: boolean
  onCancelSuccess?: () => void
}

type TabType = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'confirmed':
      return {
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: '✓',
        text: 'Đã xác nhận'
      };
    case 'pending':
      return {
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: '⏳',
        text: 'Chờ xác nhận'
      };
    case 'completed':
      return {
        color: 'bg-blue-50 text-blue-700 border-blue-200',
        icon: '✔',
        text: 'Đã hoàn thành'
      };
    case 'cancelled':
      return {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: '✕',
        text: 'Đã hủy'
      };
    default:
      return {
        color: 'bg-gray-50 text-gray-700 border-gray-200',
        icon: '•',
        text: status
      };
  }
};

export default function AppointmentsList({ 
  appointments = [],
  setShowCancelModal, 
  isLoading, 
  onCancelSuccess 
}: AppointmentsListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('all')

  const getFilteredAndSortedAppointments = () => {
    let filtered = appointments;
    
    if (activeTab !== 'all') {
      filtered = appointments.filter(a => a.status === activeTab);
    }

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
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (appointments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Chưa có lịch hẹn nào</h3>
          <p className="text-gray-500 mb-6">Bạn chưa đặt lịch khám bệnh. Hãy tìm bác sĩ phù hợp và đặt lịch ngay!</p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Đặt lịch khám
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'all' as TabType, label: 'Tất cả' },
    { key: 'pending' as TabType, label: 'Chờ xác nhận' },
    { key: 'confirmed' as TabType, label: 'Đã xác nhận' },
    { key: 'completed' as TabType, label: 'Hoàn thành' },
    { key: 'cancelled' as TabType, label: 'Đã hủy' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Lịch hẹn của tôi</h2>
        <p className="text-gray-500">Quản lý và theo dõi các lịch hẹn khám bệnh ({appointments.length} lịch)</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {tabCounts[tab.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">
            {activeTab === 'pending' && 'Không có lịch hẹn nào đang chờ xác nhận'}
            {activeTab === 'confirmed' && 'Không có lịch hẹn nào đã xác nhận'}
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
            const canCancel = (appointment.status === 'pending' || appointment.status === 'confirmed') && isUpcoming;
            const statusConfig = getStatusConfig(appointment.status);

            return (
              <div
                key={appointment.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Doctor Avatar */}
                    <div className="flex-shrink-0">
                      {appointment.doctor_avatar ? (
                        <img
                          src={appointment.doctor_avatar}
                          alt={appointment.doctor_name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                          {appointment.doctor_name
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Doctor Name & Status */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            BS. {appointment.doctor_name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color} whitespace-nowrap`}>
                            <span className="mr-1">{statusConfig.icon}</span>
                            {statusConfig.text}
                          </span>
                          {canCancel && (
                            <button
                              onClick={() => setShowCancelModal(appointment.id)}
                              disabled={isLoading}
                              className="inline-flex items-center justify-center p-1.5 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Hủy lịch hẹn"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Appointment Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">
                            {appointmentDate.toLocaleDateString('vi-VN', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-700">
                            {appointment.start_time} - {appointment.end_time}
                          </span>
                        </div>
                        {appointment.price && (
                          <div className="flex items-center gap-2 text-sm">
                            <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 font-medium">{appointment.price}</span>
                          </div>
                        )}
                      </div>

                      {/* Symptoms & Notes */}
                      {(appointment.symptoms || appointment.notes) && (
                        <div className="space-y-2 mb-3">
                          {appointment.symptoms && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-xs font-medium text-gray-500 mb-1">Triệu chứng</p>
                              <p className="text-sm text-gray-700">{appointment.symptoms}</p>
                            </div>
                          )}
                          {appointment.notes && (
                            <div className="bg-blue-50 rounded-lg p-3">
                              <p className="text-xs font-medium text-blue-600 mb-1">Ghi chú</p>
                              <p className="text-sm text-gray-700">{appointment.notes}</p>
                            </div>
                          )}
                        </div>
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
  );
}