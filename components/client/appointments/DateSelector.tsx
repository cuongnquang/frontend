import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { toYYYYMMDD } from '@/lib/utils'; // Assuming this utility function exists


interface DateSelectorProps {
    availableDates: Date[]; // Change to Date[]
    selectedDate: Date | null; // Change to Date | null
    onSelectDate: (date: Date) => void; // Change to (date: Date) => void
}

export default function DateSelector({ availableDates, selectedDate, onSelectDate }: DateSelectorProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const { year, month } = useMemo(() => ({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth(),
    }), [currentDate]);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)); // Keep day as 1 to avoid issues with months having fewer days
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)); // Keep day as 1
    };

    const getDayInfo = (day: number) => {
        const dateObj = new Date(year, month, day);
        const dateString = toYYYYMMDD(dateObj);

        // Check if this date is in the availableDates array (which now contains Date objects)
        const isAvailable = availableDates.some(d => toYYYYMMDD(d) === dateString);
        // Check if this date is the selectedDate
        const isSelected = selectedDate && toYYYYMMDD(selectedDate) === dateString;

        const today = new Date();
        const isToday = toYYYYMMDD(today) === dateString;

        return { dateObj, dateString, isAvailable, isSelected, isToday };
    };

    const handleDayClick = (day: number) => {
        const { dateObj, isAvailable } = getDayInfo(day);
        if (isAvailable) onSelectDate(dateObj); // Pass the Date object
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800">
                    {`Tháng ${month + 1}, ${year}`}
                </h4>
                <div className="flex space-x-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-200"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-200"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-7 text-center text-sm font-semibold text-gray-500 mb-2">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => <div key={day}>{day}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {/* Cells trống đầu tháng */}
                {Array.from({ length: firstDayOfWeek }).map((_, index) => <div key={`empty-${index}`} className="h-10"></div>)}

                {/* Các ngày trong tháng */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1
                    const { dateObj, dateString, isAvailable, isSelected, isToday } = getDayInfo(day);
                    
                    return (
                        <button
                            key={dateString} // Use the YYYY-MM-DD string as the key
                            onClick={() => handleDayClick(day)}
                            className={`h-10 rounded-full text-sm font-medium transition-colors border ${
                                isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                    : isToday
                                    ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                                    : isAvailable
                                    ? 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                                    : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                            }`}
                        >
                            {day}
                        </button>
                    )
                })}
            </div>
            <div className="flex justify-start mt-4 text-xs space-x-4">
                <div className="flex items-center text-black"><span className="w-3 h-3 rounded-full bg-blue-600 mr-1.5"></span>Đã chọn</div>
                <div className="flex items-center text-black"><span className="w-3 h-3 rounded-full bg-blue-50 border border-blue-300 mr-1.5"></span>Hôm nay</div>
                <div className="flex items-center text-black"><span className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-1.5"></span>Có lịch</div>
            </div>
        </div>
    )
}