import React, { useMemo } from 'react';
import { Heart, Shield, Clock } from 'lucide-react';
import DateSelector from '@/components/client/appointments/DateSelector';
import TimeSlotSelector from '../../appointments/TimeSlotSelector';

interface DoctorSchedule {
  schedule_id: string;
  schedule_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

interface BookingPanelProps {
  schedules: DoctorSchedule[];
  selectedDate: string;
  selectedSchedule: DoctorSchedule | null;
  onSelectDate: (date: string) => void;
  onSelectSchedule: (schedule: DoctorSchedule) => void;
  onSubmit: () => void;
}

export default function BookingPanel({
  schedules,
  selectedDate,
  selectedSchedule,
  onSelectDate,
  onSelectSchedule,
  onSubmit,
}: BookingPanelProps) {
  // CHỈ LẤY CÁC NGÀY CÓ CA KHÁM is_available = true
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(
      schedules
        .filter(s => s.is_available === true)
        .map(s => s.schedule_date)
    )).sort();
    return dates;
  }, [schedules]);

  // CHỈ LẤY CÁC CA KHÁM is_available = true
  const filteredTimeSlots = useMemo(() => {
    return schedules.filter(s => s.schedule_date === selectedDate && s.is_available === true);
  }, [schedules, selectedDate]);

  const hasAvailableSlotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return false;
    return schedules.some(s => s.schedule_date === selectedDate && s.is_available === true);
  }, [schedules, selectedDate]);

  const isBookingButtonDisabled = !selectedSchedule;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sticky top-6 transition-all duration-300 hover:shadow-2xl">
      <div className="space-y-6">
        {schedules.length > 0 ? (
          <>
            <DateSelector
              availableDates={availableDates}
              schedules={schedules}
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
            />
            
            {selectedDate ? (
              hasAvailableSlotsForSelectedDate ? (
                <TimeSlotSelector
                  schedules={filteredTimeSlots}
                  selectedSchedule={selectedSchedule}
                  onSelectSchedule={onSelectSchedule}
                />
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Không có lịch khám</p>
                  <p className="text-sm text-gray-400 mt-1">Vui lòng chọn ngày khác</p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Chưa chọn ngày khám</p>
                <p className="text-sm text-gray-400 mt-1">Vui lòng chọn ngày để xem lịch khám</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Bác sĩ chưa có lịch khám</p>
            <p className="text-sm text-gray-400 mt-1">Vui lòng quay lại sau</p>
          </div>
        )}
      </div>
      
      <button
        onClick={onSubmit}
        disabled={isBookingButtonDisabled}
        className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
      >
        {isBookingButtonDisabled ? 'Chọn ngày và giờ khám' : 'Đặt lịch ngay'}
      </button>
      
      <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-green-600">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Bảo mật thông tin</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-rose-600">
            <Heart className="w-4 h-4" />
            <span className="font-medium">Cần đăng nhập để đặt lịch</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 leading-relaxed">
          Hệ thống sẽ gửi xác nhận qua email và SMS sau khi đặt lịch thành công
        </p>
      </div>
    </div>
  );
}