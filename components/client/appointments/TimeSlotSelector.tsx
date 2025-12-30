import React, { useMemo } from 'react';
import { Clock, CheckCircle } from 'lucide-react';

interface DoctorSchedule {
  schedule_id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface TimeSlotSelectorProps {
  schedules: DoctorSchedule[];
  selectedSchedule: DoctorSchedule | null;
  onSelectSchedule: (schedule: DoctorSchedule) => void;
}

export default function TimeSlotSelector({ schedules, selectedSchedule, onSelectSchedule }: TimeSlotSelectorProps) {
  // CHỈ LẤY CÁC CA KHÁM CÓ is_available = true
  const availableSchedules = useMemo(() => {
    return schedules.filter(schedule => schedule.is_available === true);
  }, [schedules]);

  const sortedSchedules = useMemo(() => {
    return [...availableSchedules].sort((a, b) => {
      const timeA = a.start_time.split(':').map(Number);
      const timeB = b.start_time.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
  }, [availableSchedules]);

  if (sortedSchedules.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Không có ca khám nào</p>
        <p className="text-sm text-gray-400 mt-1">Vui lòng chọn ngày khác</p>
      </div>
    );
  }

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const getTimeLabel = (startTime: string) => {
    const hour = parseInt(startTime.split(':')[0]);
    if (hour < 12) return 'Sáng';
    if (hour < 18) return 'Chiều';
    return 'Tối';
  };

  const groupedSchedules = useMemo(() => {
    const groups: { [key: string]: DoctorSchedule[] } = {
      'Sáng': [],
      'Chiều': [],
      'Tối': []
    };
    
    sortedSchedules.forEach(schedule => {
      const label = getTimeLabel(schedule.start_time);
      groups[label].push(schedule);
    });
    
    return Object.entries(groups).filter(([_, schedules]) => schedules.length > 0);
  }, [sortedSchedules]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        <h4 className="text-lg font-semibold text-gray-900">Chọn giờ khám</h4>
        <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {sortedSchedules.length} ca trống
        </span>
      </div>
      
      <div className="space-y-4">
        {groupedSchedules.map(([timeLabel, schedules]) => (
          <div key={timeLabel}>
            <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {timeLabel}
              <span className="text-xs text-gray-500 font-normal">({schedules.length} ca)</span>
            </h5>
            <div className="grid grid-cols-3 gap-2">
              {schedules.map(schedule => {
                const isSelected = selectedSchedule?.schedule_id === schedule.schedule_id;
                
                return (
                  <button
                    key={schedule.schedule_id}
                    onClick={() => onSelectSchedule(schedule)}
                    className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-green-500 bg-green-50 text-green-700 shadow-md scale-105'
                        : 'border-gray-200 bg-white text-gray-800 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700'
                    }`}
                  >
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-green-500 absolute -top-1.5 -right-1.5 bg-white rounded-full" />
                    )}
                    
                    <div className="text-center">
                      <div className={`text-base font-bold ${
                        isSelected ? 'text-green-600' : 'text-current'
                      }`}>
                        {formatTime(schedule.start_time)}
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5">
                        {formatTime(schedule.end_time)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}