import { CalendarDays, Clock, Edit2, Trash2 } from "lucide-react";

export const ScheduleCard = ({ schedule, onEdit, onDelete }) => {
  const bookedPercentage = (schedule.booked / schedule.slots) * 100;
  const availableSlots = schedule.slots - schedule.booked;
  
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1"><CalendarDays className="h-5 w-5 text-blue-600" /><h3 className="font-semibold text-gray-900">{schedule.day}</h3></div>
          <p className="text-sm text-gray-600">{schedule.schedule_date}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button onClick={() => onEdit(schedule)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Chỉnh sửa"><Edit2 className="h-4 w-4" /></button>
          <button onClick={() => onDelete(schedule.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Xóa" disabled={schedule.booked > 0}><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-700"><Clock className="h-4 w-4 mr-2 text-gray-500" /><span className="font-medium">{schedule.start_time} - {schedule.end_time}</span></div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${availableSlots === 0 ? 'bg-red-100 text-red-700' : availableSlots <= 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{availableSlots} slots trống</span>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1"><span>Đã đặt: {schedule.booked}/{schedule.slots}</span><span>{bookedPercentage.toFixed(0)}%</span></div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className={`h-2 rounded-full transition-all ${bookedPercentage === 100 ? 'bg-red-500' : bookedPercentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${bookedPercentage}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};