import { Eye, Check, X, Calendar, Clock } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Appointment } from "@/contexts/AppointmentContext";

interface AppointmentRowProps {
  appointment: Appointment;
  onConfirm: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onViewDetails: (appointment: Appointment) => void;
  isLoading: boolean;
}

export const AppointmentRow = ({ appointment, onConfirm, onCancel, onViewDetails, isLoading }: AppointmentRowProps) => (
  <div className="p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
    <div className="flex items-center justify-between mb-3">
      {/* Thông tin bệnh nhân & lịch hẹn */}
      <div className="flex items-center space-x-4 flex-1">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
          {appointment.patient_name?.charAt(0).toUpperCase() || 'P'}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{appointment.patient_name}</h3>
          <div className="flex items-center space-x-4 mt-1 flex-wrap">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1.5" />
              {appointment.schedule_date}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1.5" />
              {appointment.start_time} - {appointment.end_time}
            </div>
          </div>
        </div>
      </div>
      
      {/* Trạng thái & Nút hành động */}
      <div className="flex items-center space-x-4">
        <StatusBadge status={appointment.status} />
        
        <div className="flex items-center space-x-2">
          {appointment.status === 'pending' ? (
            <>
              <button 
                onClick={() => onConfirm(appointment.id)}
                disabled={isLoading}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xác nhận"
              >
                <Check className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onCancel(appointment.id)}
                disabled={isLoading}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Từ chối"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : null}
          
          <button 
            onClick={() => onViewDetails(appointment)}
            disabled={isLoading}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Xem chi tiết"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
    
    {/* Thông tin thêm */}
    <div className="ml-16 flex items-center space-x-4 text-xs text-gray-500">
      {appointment.symptoms && (
        <div>
          <span className="font-medium">Triệu chứng:</span> {appointment.symptoms}
        </div>
      )}
      <div className="flex-shrink-0">
        <span className="font-medium">Tạo:</span> {new Date(appointment.createdAt).toLocaleDateString('vi-VN')}
      </div>
    </div>
  </div>
);