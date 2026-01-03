import { Check, X, Calendar, Clock, FileText } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Appointment } from "@/contexts/AppointmentContext";

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const AppointmentDetailModal = ({ appointment, onClose, onConfirm, onCancel, onComplete, isLoading }: AppointmentDetailModalProps) => {
  if (!appointment) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Chi tiết lịch hẹn</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={isLoading}
            title="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-2xl">
              {appointment.patient_name?.charAt(0).toUpperCase() || 'P'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{appointment.patient_name}</h3>
              <p className="text-sm text-gray-600 mt-1">ID: {appointment.patient_id}</p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Ngày khám</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{appointment.schedule_date}</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Thời gian</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{appointment.start_time} - {appointment.end_time}</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg col-span-2">
              <div className="flex items-center text-gray-600 mb-2">
                <FileText className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Trạng thái</span>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Symptoms */}
          {appointment.symptoms && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Triệu chứng</h4>
              <p className="text-gray-700">{appointment.symptoms}</p>
            </div>
          )}

          {/* Notes */}
          {appointment.notes && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Ghi chú</h4>
              <p className="text-gray-700">{appointment.notes}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="p-4 bg-gray-50 rounded-lg space-y-2">
            <div className="text-xs text-gray-600">
              <span className="font-medium">Tạo lúc:</span> {new Date(appointment.createdAt).toLocaleString('vi-VN')}
            </div>
            <div className="text-xs text-gray-600">
              <span className="font-medium">Cập nhật:</span> {new Date(appointment.updatedAt).toLocaleString('vi-VN')}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {appointment.status === 'pending' && (
              <>
                <button 
                  onClick={() => onConfirm(appointment.id)}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Xác nhận
                </button>
                <button 
                  onClick={() => onCancel(appointment.id)}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <X className="h-5 w-5 mr-2" />
                  Hủy bỏ
                </button>
              </>
            )}
            
            {appointment.status === 'confirmed' && (
              <button 
                onClick={() => onComplete(appointment.id)}
                disabled={isLoading}
                className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Check className="h-5 w-5 mr-2" />
                Hoàn thành khám
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};