import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { ScheduleCard } from "./ScheduleCard";

export const ScheduleList = ({ schedules, onEdit, onDelete, onAddSchedule }) => {
  const groupedSchedules = schedules.reduce((acc, schedule) => {
    (acc[schedule.schedule_date] = acc[schedule.schedule_date] || []).push(schedule);
    return acc;
  }, {});

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Lịch đã đăng ký</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="h-5 w-5 text-gray-600" /></button>
          <span className="text-sm font-medium text-gray-700">Tuần 42, 2025</span>
          <button className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="h-5 w-5 text-gray-600" /></button>
        </div>
      </div>
      
      <div className="p-6">
        {Object.keys(groupedSchedules).length === 0 ? (
          <div className="text-center py-12">
            <CalendarDays className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Chưa có lịch làm việc nào</p>
            <button onClick={onAddSchedule} className="text-blue-600 hover:text-blue-700 font-medium">Thêm lịch đầu tiên</button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSchedules).map(([date, daySchedules]) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center"><div className="h-1 w-1 rounded-full bg-blue-600 mr-2"></div>{date} - {daySchedules[0].day}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {daySchedules.map(schedule => <ScheduleCard key={schedule.id} schedule={schedule} onEdit={onEdit} onDelete={onDelete} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};