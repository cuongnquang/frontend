import { Clock, Video, Users } from "lucide-react";

interface AppointmentCardProps {
  patient: string;
  time: string;
  type: "online" | "offline";
  status: "confirmed" | "pending";
  isUrgent: boolean;
}

export const AppointmentCard = ({ patient, time, type, status, isUrgent }: AppointmentCardProps) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg">
    <div className="flex items-center space-x-4">
      {/* Avatar */}
      <div className="relative">
        <img 
          className="h-12 w-12 rounded-full ring-2 ring-gray-100" 
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient}`} 
          alt={patient} 
        />
        {isUrgent && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </div>
      {/* Info */}
      <div>
        <p className="text-sm font-semibold text-gray-900">{patient}</p>
        <div className="flex items-center space-x-3 mt-1">
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{time}</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center text-xs text-gray-500">
            {type === 'online' ? (
              <><Video className="h-3.5 w-3.5 mr-1 text-purple-500" /><span>Trực tuyến</span></>
            ) : (
              <><Users className="h-3.5 w-3.5 mr-1 text-blue-500" /><span>Trực tiếp</span></>
            )}
          </div>
        </div>
      </div>
    </div>
    {/* Status & Action */}
    <div className="flex items-center space-x-3">
      <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
        status === 'confirmed' ? 'bg-green-50 text-green-700 border border-green-200' : 
        'bg-yellow-50 text-yellow-700 border border-yellow-200'
      }`}>
        {status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
      </span>
      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
);