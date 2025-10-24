import { Clock, Trash2, CheckCircle, XCircle } from "lucide-react";

interface ScheduleCardProps {
  schedule: {
    id: string;
    schedule_date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    createdAt: string;
  };
  onDelete: (id: string) => void;
}

export const ScheduleCard = ({ schedule, onDelete }: ScheduleCardProps) => {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg p-2 hover:border-blue-300 hover:shadow-md transition-all duration-200">
      {/* Delete Button */}
      <button 
        onClick={() => onDelete(schedule.id)} 
        className="absolute top-1 right-1 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all opacity-0 group-hover:opacity-100"
        title="Xóa lịch"
      >
        <Trash2 className="h-3 w-3" />
      </button>

      {/* Time Display - Compact */}
      <div className="flex items-center space-x-1.5 mb-1.5">
        <Clock className="h-3 w-3 text-blue-600 flex-shrink-0" />
        <div className="text-xs font-semibold text-gray-900">
          {schedule.start_time}
        </div>
      </div>

      {/* Status Badge - Compact */}
      <div>
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
          schedule.is_available 
            ? 'bg-green-100 text-green-700' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          {schedule.is_available ? (
            <>
              <CheckCircle className="h-2.5 w-2.5 mr-0.5" />
              Trống
            </>
          ) : (
            <>
              <XCircle className="h-2.5 w-2.5 mr-0.5" />
              Đặt
            </>
          )}
        </span>
      </div>
    </div>
  );
};