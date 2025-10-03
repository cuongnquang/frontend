import React from 'react'

import { TimeSlot } from '@/components/client/appointments/AppointmentTypes';
import { generateCalendarDays } from '@/utils/appointment';

interface StepTwoProps {
    selectedDate: Date | null
    selectedTime: string
    timeSlots: TimeSlot[]
    setSelectedDate: (date: Date) => void
    setSelectedTime: (time: string) => void
}

export default function StepTwoDateTimeSelection({
    selectedDate,
    selectedTime,
    timeSlots,
    setSelectedDate,
    setSelectedTime,
}: StepTwoProps) {
    const calendarDays = generateCalendarDays()

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Chọn ngày và giờ khám
            </h2>

            {/* Calendar */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Chọn ngày</h3>
                <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((date, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`p-3 rounded-lg text-center transition-all ${selectedDate?.toDateString() === date.toDateString()
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                        >
                            <div className="text-xs mb-1">
                                {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                            </div>
                            <div className="font-semibold">
                                {date.getDate()}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Time slots */}
            {selectedDate ? (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Chọn giờ</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot.time}
                                disabled={!slot.available}
                                onClick={() => setSelectedTime(slot.time)}
                                className={`p-3 rounded-lg text-center transition-all ${!slot.available
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : selectedTime === slot.time
                                        ? 'bg-blue-600 text-white border-2 border-blue-700'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {slot.time}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center p-6 bg-yellow-50 text-yellow-800 rounded-lg">
                    Vui lòng chọn ngày khám để xem các khung giờ có sẵn.
                </div>
            )}
        </div>
    )
}