'use client';

import React, { useMemo } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { TimeSlot } from '@/types/types'; // Assuming this path is correct
import { Calendar, Clock, AlertTriangle } from 'lucide-react';

/**
 * Props for the StepTwoDateTimeSelection component.
 */
interface StepTwoProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  selectedTime: string; // Now stores the 'id' of the selected TimeSlot
  setSelectedTime: (timeId: string) => void;
  timeSlots: TimeSlot[];
}

// Helper to convert day index (0=Sunday, 1=Monday, etc.) to Vietnamese day string
const dayIndexToVietnamese = (index: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const viDays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[index]; // We return the English name to match the 'day' property in TimeSlot
};

/**
 * Component for Step 2 of the appointment booking process: selecting date and time.
 *
 * @param {StepTwoProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered component.
 */
export default function StepTwoDateTimeSelection({ 
    selectedDate, 
    setSelectedDate, 
    selectedTime, 
    setSelectedTime, 
    timeSlots 
}: StepTwoProps): React.ReactElement {

  // 1. Filter time slots based on the selected date's day of the week
  const filteredTimeSlots = useMemo(() => {
    if (!selectedDate) {
      return [];
    }

    // Get the English day name (e.g., "Monday") to match the TimeSlot.day property
    const selectedDayName = dayIndexToVietnamese(selectedDate.getDay());

    return timeSlots.filter(slot => 
      slot.day === selectedDayName
    );
  }, [selectedDate, timeSlots]);

  // 2. Check for slot availability based on all criteria
  const getSlotAvailability = (slot: TimeSlot): boolean => {
    // Check general availability and if current patients is less than max
    return slot.isAvailable && slot.currentPatients < slot.maxPatients;
  };

  const handleDateSelect = (day: Date | undefined) => {
    // Reset selected time when a new date is chosen
    setSelectedTime(''); 
    setSelectedDate(day || null);
  };
  
  // --- Rendering ---
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Calendar className="w-6 h-6 mr-3 text-blue-600" />
        Chọn Ngày Khám
      </h2>
      <div className="flex text-black justify-center border rounded-lg p-2">
        <DayPicker
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleDateSelect}
          className="w-full"
          classNames={{
            head_cell: 'w-full font-semibold',
            cell: 'w-full text-center',
            day: 'w-10 h-10 rounded-full transition-colors',
            day_selected: 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none',
            day_today: 'bg-blue-100 text-blue-600',
            day_disabled: 'text-gray-400 cursor-not-allowed',
          }}
          // Disable all dates before today
          disabled={{ before: new Date() }}
        />
      </div>

      <hr className="my-8 border-gray-200" />

      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Clock className="w-6 h-6 mr-3 text-blue-600" />
        Chọn Giờ Khám
      </h2>
      
      {!selectedDate && (
          <div className="flex items-center p-3 mb-4 text-orange-700 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <p className="text-sm">Vui lòng chọn một ngày để xem các khung giờ khả dụng.</p>
          </div>
      )}

      {selectedDate && filteredTimeSlots.length === 0 && (
          <div className="flex items-center p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <p className="text-sm">Không có khung giờ nào khả dụng vào ngày đã chọn.</p>
          </div>
      )}

      <div className="grid text-black grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredTimeSlots.map((slot) => {
          const isAvailable = getSlotAvailability(slot);
          const timeDisplay = `${slot.startTime} - ${slot.endTime}`;
          
          return (
            <button
              key={slot.id}
              // We now pass the slot's ID to setSelectedTime
              onClick={() => setSelectedTime(slot.id)}
              disabled={!isAvailable}
              className={`p-3 rounded-lg text-center font-semibold transition-colors duration-200 shadow-sm text-sm border ${
                selectedTime === slot.id
                  ? 'bg-blue-600 text-white shadow-lg border-blue-600 transform scale-[1.02]'
                  : isAvailable
                    ? 'bg-gray-100 text-gray-800 hover:bg-blue-100 border-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed line-through opacity-70 border-gray-200'
              }`}
              title={!isAvailable ? 'Khung giờ đã đầy hoặc không khả dụng' : `Khả dụng: ${slot.maxPatients - slot.currentPatients} chỗ`}
            >
              {timeDisplay}
              {!isAvailable && <span className="block text-xs font-normal mt-1">Đã đầy</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}