import { Eye, Check, X, Search, Filter, Calendar, Clock, Video, Users, FileText, Phone } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AppointmentStatus } from "@/app/doctor/data";

export const AppointmentDetailModal = ({ appointment, onClose, onConfirm, onCancel }) => {
  if (!appointment) return null;
  
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết lịch hẹn</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img 
              className="h-16 w-16 rounded-full ring-2 ring-gray-200" 
              src={appointment.patient.avatar} 
              alt={appointment.patient.name} 
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{appointment.patient.name}</h3>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Phone className="h-4 w-4 mr-1" />
                {appointment.patient.phone}
              </p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center text-gray-600 mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Ngày khám</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{appointment.date}</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Thời gian</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{appointment.time}</p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center text-gray-600 mb-2">
                {appointment.type === 'online' ? <Video className="h-4 w-4 mr-2" /> : <Users className="h-4 w-4 mr-2" />}
                <span className="text-sm font-medium">Hình thức</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {appointment.type === 'online' ? 'Khám trực tuyến' : 'Khám trực tiếp'}
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center text-gray-600 mb-2">
                <FileText className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Trạng thái</span>
              </div>
              <StatusBadge status={appointment.status} />
            </div>
          </div>

          {/* Reason */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Lý do khám</h4>
            <p className="text-gray-700">{appointment.reason}</p>
          </div>

          {/* Actions */}
          {appointment.status === AppointmentStatus.PENDING && (
            <div className="flex space-x-3">
              <button 
                onClick={() => onConfirm(appointment.id)}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
              >
                <Check className="h-5 w-5 mr-2" />
                Xác nhận lịch hẹn
              </button>
              <button 
                onClick={() => onCancel(appointment.id)}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                <X className="h-5 w-5 mr-2" />
                Từ chối
              </button>
            </div>
          )}
          
          {appointment.status === AppointmentStatus.CONFIRMED && appointment.type === 'online' && (
            <button className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
              <Video className="h-5 w-5 mr-2" />
              Bắt đầu cuộc gọi video
            </button>
          )}
        </div>
      </div>
    </div>
  );
};