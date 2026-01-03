import { Appointment } from "@/contexts/AppointmentContext";
import { Clock } from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-50 text-green-700 border border-green-200';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
    case 'completed':
      return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'cancelled':
      return 'bg-red-50 text-red-700 border border-red-200';
    default:
      return 'bg-gray-50 text-gray-700 border border-gray-200';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'confirmed':
      return '✓ Xác nhận';
    case 'pending':
      return '⏳ Chờ xác nhận';
    case 'completed':
      return '✔ Hoàn thành';
    case 'cancelled':
      return '✕ Đã hủy';
    default:
      return status;
  }
};

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const initials = appointment.patient_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{appointment.patient_name}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{appointment.start_time} - {appointment.end_time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {appointment.symptoms && (
            <div className="text-xs px-2 py-1 bg-gray-100 rounded text-gray-600">
              {appointment.symptoms}
            </div>
          )}
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(appointment.status)}`}>
            {getStatusLabel(appointment.status)}
          </span>
        </div>
      </div>
    </div>
  );
};