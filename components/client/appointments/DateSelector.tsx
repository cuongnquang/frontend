import React, { useMemo, useRef } from 'react';
import { Calendar } from 'lucide-react';

interface DoctorSchedule {
  schedule_id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface DateSelectorProps {
  availableDates: string[];
  schedules: DoctorSchedule[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DateSelector({ availableDates, schedules, selectedDate, onSelectDate }: DateSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const dateItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Tạo danh sách 30 ngày tiếp theo
    const thirtyDays = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Đếm số ca khám có sẵn cho ngày này
      const availableCount = schedules.filter(
        s => s.schedule_date === dateStr && s.is_available
      ).length;
      
      const dayOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
      const day = date.getDate();
      const month = date.getMonth() + 1;
      
      const isToday = i === 0;
      const isTomorrow = i === 1;
      
      thirtyDays.push({
        dateStr,
        dayOfWeek,
        day,
        month,
        isToday,
        isTomorrow,
        availableCount,
        hasSchedule: availableCount > 0
      });
    }
    
    return thirtyDays;
  }, [schedules]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        <h4 className="text-lg font-semibold text-gray-900">Chọn ngày khám</h4>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
          style={{ scrollbarWidth: 'thin' }}
        >
          {dateItems.map(({ dateStr, dayOfWeek, day, month, isToday, isTomorrow, availableCount, hasSchedule }) => {
            const isSelected = selectedDate === dateStr;
            const displayText = isToday ? 'Hôm nay' : isTomorrow ? 'Ngày mai' : dayOfWeek;
            
            return (
              <button
                key={dateStr}
                onClick={() => onSelectDate(dateStr)}
                className={`flex-shrink-0 w-24 flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-600 text-white shadow-lg scale-105'
                    : !hasSchedule
                    ? 'bg-gray-50 border-gray-200 text-gray-600 cursor-pointer hover:border-gray-300 hover:bg-gray-100'
                    : isToday
                    ? 'bg-orange-50 border-orange-300 text-orange-700 hover:border-orange-400 hover:scale-105'
                    : 'bg-white border-gray-200 text-gray-800 hover:border-blue-300 hover:bg-blue-50 hover:scale-105'
                }`}
              >
                <span className={`text-xs font-semibold ${
                  isSelected ? 'text-blue-100' : hasSchedule ? 'text-gray-600' : 'text-gray-500'
                }`}>
                  {displayText}
                </span>
                <span className={`text-2xl font-bold my-1 ${
                  isSelected ? 'text-white' : !hasSchedule ? 'text-gray-500' : 'text-gray-900'
                }`}>
                  {day}
                </span>
                <span className={`text-[10px] ${
                  isSelected ? 'text-blue-100' : hasSchedule ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Tháng {month}
                </span>
                
                {hasSchedule ? (
                  <div className={`mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isSelected 
                      ? 'bg-white bg-opacity-30 text-white' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {availableCount} ca
                  </div>
                ) : (
                  <div className="mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-500">
                    Không có
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}