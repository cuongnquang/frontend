import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Plus, Sun, Moon } from "lucide-react";
import { ScheduleCard } from "./ScheduleCard";

interface ScheduleListProps {
  schedules: Array<{
    id: string;
    doctor_name: string;
    schedule_date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  onEdit: (schedule: any) => void;
  onDelete: (id: string) => void;
  onAddSchedule: () => void;
}

export const ScheduleList = ({ schedules, onEdit, onDelete, onAddSchedule }: ScheduleListProps) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Helper: Get start of week (Monday)
  const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getCurrentWeekRange = () => {
    const today = new Date();
    today.setDate(today.getDate() + currentWeekOffset * 7);
    const weekStart = getWeekStart(today);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return { weekStart, weekEnd };
  };

  const { weekStart, weekEnd } = getCurrentWeekRange();

  // Filter schedules for current week
  const weekSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.schedule_date);
    return scheduleDate >= weekStart && scheduleDate <= weekEnd;
  });

  // Group by date
  const groupedSchedules = weekSchedules.reduce((acc, schedule) => {
    const date = schedule.schedule_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(schedule);
    return acc;
  }, {} as Record<string, typeof schedules>);

  // Generate all days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const formatWeekRange = () => {
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const month = weekStart.toLocaleDateString('vi-VN', { month: 'long' });
    const year = weekStart.getFullYear();
    return `${startDay} - ${endDay} ${month}, ${year}`;
  };

  const formatDayHeader = (date: Date) => {
    const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
    const dayNum = date.getDate();
    return { dayName, dayNum };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getDateKey = (date: Date) => date.toISOString().split('T')[0];

  // Phân loại ca sáng & ca chiều
  const isMorningShift = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const total = h + m / 60;
    return total >= 8 && total <= 11.5;
  };

  const isAfternoonShift = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    const total = h + m / 60;
    return total >= 13 && total <= 17.5;
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-6 w-6 mr-2 text-blue-600" />
            Lịch làm việc của tôi
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentWeekOffset(prev => prev - 1)}
              className="p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              onClick={() => setCurrentWeekOffset(0)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currentWeekOffset === 0
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
            >
              Tuần này
            </button>
            <button
              onClick={() => setCurrentWeekOffset(prev => prev + 1)}
              className="p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 font-medium">{formatWeekRange()}</p>
      </div>

      {/* Week Grid */}
      <div className="p-6">
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((date, index) => {
            const { dayName, dayNum } = formatDayHeader(date);
            const dateKey = getDateKey(date);
            const allSchedules = (groupedSchedules[dateKey] || []).sort((a, b) =>
              a.start_time.localeCompare(b.start_time)
            );

            const morningSchedules = allSchedules.filter(s => isMorningShift(s.start_time));
            const afternoonSchedules = allSchedules.filter(s => isAfternoonShift(s.start_time));
            const today = isToday(date);

            return (
              <div
                key={index}
                className="flex flex-col h-full border-gray-100"
              >
                {/* Day Header */}
                <div
                  className={`text-center mb-3 pb-2 border-b-2 ${today ? 'border-blue-600' : 'border-gray-200'
                    }`}
                >
                  <div
                    className={`text-xs font-semibold uppercase mb-1 ${today ? 'text-blue-600' : 'text-gray-500'
                      }`}
                  >
                    {dayName}
                  </div>
                  <div
                    className={`text-2xl font-bold ${today ? 'text-blue-600' : 'text-gray-900'
                      }`}
                  >
                    {dayNum}
                  </div>
                </div>

                {/* Ca sáng */}
                <div className="flex flex-col flex-1 min-h-[140px]">
                  <div className="flex items-center justify-center mb-2 text-xs font-semibold text-amber-600">
                    <Sun className="h-3.5 w-3.5 mr-1" /> Ca sáng
                  </div>
                  <div className="flex-1">
                    {morningSchedules.length > 0 ? (
                      <div className="space-y-1.5">
                        {morningSchedules.map(schedule => (
                          <ScheduleCard
                            key={schedule.id}
                            schedule={schedule}
                            onDelete={onDelete}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-xs py-4">
                        Không có lịch
                      </div>
                    )}
                  </div>
                </div>

                {/* Đường ngăn cách giữa ca sáng & ca chiều */}
                <div className="border-t border-dashed border-gray-200 mt-3 pt-3" />

                {/* Ca chiều */}
                <div className="flex flex-col flex-1 min-h-[140px]">
                  <div className="flex items-center justify-center mb-2 text-xs font-semibold text-indigo-600">
                    <Moon className="h-3.5 w-3.5 mr-1" /> Ca chiều
                  </div>
                  <div className="flex-1">
                    {afternoonSchedules.length > 0 ? (
                      <div className="space-y-1.5">
                        {afternoonSchedules.map(schedule => (
                          <ScheduleCard
                            key={schedule.id}
                            schedule={schedule}
                            onDelete={onDelete}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 text-xs py-4">
                        Không có lịch
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        </div>

        {/* Empty State */}
        {weekSchedules.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl mt-6">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4 font-medium">Chưa có lịch làm việc nào trong tuần này</p>
            <button
              onClick={onAddSchedule}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Thêm lịch làm việc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
