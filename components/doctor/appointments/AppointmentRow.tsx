import { Eye, Check, X, Calendar, Clock, Video, Users } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AppointmentStatus } from "@/app/doctor/data";

export const AppointmentRow = ({ appointment, onConfirm, onCancel, onViewDetails }) => (
  <div className="p-6 hover:bg-gray-50 transition-colors">
    <div className="flex items-center justify-between">
      {/* Thông tin bệnh nhân & lịch hẹn */}
      <div className="flex items-center space-x-4 flex-1">
        <img 
          className="h-12 w-12 rounded-full ring-2 ring-gray-100" 
          src={appointment.patient.avatar} 
          alt={appointment.patient.name} 
        />
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{appointment.patient.name}</h3>
          <div className="flex items-center space-x-4 mt-1">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1.5" />
              {appointment.date}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-1.5" />
              {appointment.time}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              {appointment.type === 'online' ? (
                <><Video className="h-4 w-4 mr-1.5 text-purple-500" /><span>Trực tuyến</span></>
              ) : (
                <><Users className="h-4 w-4 mr-1.5 text-blue-500" /><span>Trực tiếp</span></>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Trạng thái & Nút hành động */}
      <div className="flex items-center space-x-4">
        <StatusBadge status={appointment.status} />
        
        <div className="flex items-center space-x-2">
          {appointment.status === AppointmentStatus.PENDING ? (
            <>
              <button 
                onClick={() => onConfirm(appointment.id)}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                title="Xác nhận"
              >
                <Check className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onCancel(appointment.id)}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Từ chối"
              >
                <X className="h-5 w-5" />
              </button>
            </>
          ) : null}
          
          <button 
            onClick={() => onViewDetails(appointment)}
            className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            title="Xem chi tiết"
          >
            <Eye className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
    
    {/* Lý do khám */}
    <div className="mt-3 ml-16">
      <p className="text-sm text-gray-600">
        <span className="font-medium">Lý do khám:</span> {appointment.reason}
      </p>
    </div>
  </div>
);