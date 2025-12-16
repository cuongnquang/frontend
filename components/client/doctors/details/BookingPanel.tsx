import React from 'react';
import { Calendar, Clock, Info } from 'lucide-react';
import type { DoctorSchedule } from '@/types/types';
import DateSelector from '@/components/client/appointments/DateSelector';
import TimeSlotSelector from '@/components/client/appointments/TimeSlotSelector';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface BookingPanelProps {
    availableDates: Date[]
    schedules: DoctorSchedule[]
    selectedDate: Date | null
    selectedSchedule: DoctorSchedule | null
    onSelectDate: (date: Date) => void
    onSelectSchedule: (schedule: DoctorSchedule) => void
    onSubmit: () => void
    isLoading: boolean
    isLoadingDates?: boolean
    error: string | null
}

export default function BookingPanel({
    availableDates,
    schedules,
    selectedDate,
    selectedSchedule,
    onSelectDate,
    onSelectSchedule,
    onSubmit,
    isLoading,
    isLoadingDates,
    error
}: BookingPanelProps) {
     return (
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                Đặt Lịch Khám
            </h3>

            {/* Date Selector */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Chọn Ngày Khám
                </label>
                {isLoadingDates ? (
                    <div className="flex justify-center items-center py-8 bg-gray-50 rounded-lg">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <DateSelector
                        availableDates={availableDates}
                        selectedDate={selectedDate}
                        onSelectDate={onSelectDate}
                    />
                )}
            </div>

            {/* Time Slot Section */}
            <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Chọn Khung Giờ
                </label>
                {!selectedDate ? (
                    <div className="text-center text-sm text-gray-500 bg-gray-50 p-6 rounded-lg border border-dashed">
                        <Info className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        Vui lòng chọn ngày khám để xem các khung giờ có sẵn.
                    </div>
                ) : (
                    <TimeSlotSelector
                        schedules={schedules}
                        selectedSchedule={selectedSchedule}
                        onSelectSchedule={onSelectSchedule}
                        error={error}
                    />
                )}
            </div>

            {/* Submit Button */}
            <button
                onClick={onSubmit}
                disabled={!selectedSchedule || isLoading}
                className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
                    selectedSchedule && !isLoading
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                        : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                {isLoading ? 'Đang tải...' : 'Đặt Lịch Ngay'}
            </button>

            {/* Info Text */}
            <p className="text-xs text-gray-500 mt-4 text-center">
                {selectedDate && selectedSchedule ? (
                    <>
                        Bạn đã chọn: <strong>{selectedDate.toLocaleDateString('vi-VN')}</strong> lúc{' '}
                        <strong>{selectedSchedule.start_time}</strong>.
                    </>
                ) : (
                    'Vui lòng chọn ngày và giờ khám'
                )}
            </p>
        </div>
    );
}