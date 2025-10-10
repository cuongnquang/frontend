'use client'

import React from 'react';
import { Calendar, Heart } from 'lucide-react';
import DateSelector from '@/components/client/appointments/DateSelector';
import TimeSlotSelector from '@/components/client/appointments/TimeSlotSelector';
import type { DoctorSchedule } from '@/types/types';

interface BookingPanelProps {
  schedules: DoctorSchedule[];
  selectedDate: string;
  selectedSchedule: DoctorSchedule | null;
  onSelectDate: (date: string) => void;
  onSelectSchedule: (schedule: DoctorSchedule) => void;
  onSubmit:() => void
}

export default function BookingPanel({
  schedules,
  selectedDate,
  selectedSchedule,
  onSelectDate,
  onSelectSchedule,
  onSubmit,
}: BookingPanelProps) {
  const availableDates = Array.from(new Set(
    schedules.filter(s => s.is_available).map(s => s.schedule_date)
  ));

  const filteredTimeSlots = schedules.filter(s => s.schedule_date === selectedDate);

  const isBookingButtonDisabled = !selectedSchedule;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-blue-600" />
        Đặt lịch khám
      </h3>
      
      <div className="space-y-4 mb-6">
        <DateSelector
          availableDates={availableDates}
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
        />
        
        {selectedDate && (
          <TimeSlotSelector
            schedules={filteredTimeSlots}
            selectedSchedule={selectedSchedule}
            onSelectSchedule={onSelectSchedule}
          />
        )}
      </div>
      
      <button
        onClick={onSubmit}
        disabled={isBookingButtonDisabled}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
      >
        Xác nhận đặt lịch
      </button>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
          <Heart className="w-4 h-4 text-red-500" />
          <span className="font-medium">Cam kết chất lượng</span>
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          {/* ... các cam kết ... */}
        </ul>
      </div>
    </div>
  );
}