import { useMemo } from 'react';
import { Clock, AlertTriangle, Sun, Moon, Sunset } from 'lucide-react';
import { DoctorSchedule } from '@/types/types';

interface TimeSlotSelectorProps {
    schedules: DoctorSchedule[]
    selectedSchedule: DoctorSchedule | null
    onSelectSchedule: (schedule: DoctorSchedule) => void
    error: string | null
}

export default function TimeSlotSelector({ schedules, selectedSchedule, onSelectSchedule, error }: TimeSlotSelectorProps) {
    // Phân loại các khung giờ vào các buổi Sáng, Chiều, Tối
    const { morningSlots, afternoonSlots, eveningSlots } = useMemo(() => {
        const morning: DoctorSchedule[] = [];
        const afternoon: DoctorSchedule[] = [];
        const evening: DoctorSchedule[] = [];

        schedules.forEach(schedule => {
            const hour = parseInt(schedule.start_time.split(':')[0]);
            if (hour < 12) {
                morning.push(schedule);
            } else if (hour < 18) {
                afternoon.push(schedule);
            } else {
                evening.push(schedule);
            }
        });

        // Sắp xếp các khung giờ trong mỗi buổi
        morning.sort((a, b) => a.start_time.localeCompare(b.start_time));
        afternoon.sort((a, b) => a.start_time.localeCompare(b.start_time));
        evening.sort((a, b) => a.start_time.localeCompare(b.start_time));

        return { morningSlots: morning, afternoonSlots: afternoon, eveningSlots: evening };
    }, [schedules]);

    // Component để render một nhóm các khung giờ
    const TimeSlotGroup = ({ title, slots, icon }: { title: string, slots: DoctorSchedule[], icon: React.ReactNode }) => (
        slots.length > 0 && (
            <div className="mb-6 animate-fade-in-up">
                <h5 className="font-bold text-gray-700 mb-3 flex items-center">{icon}{title}</h5>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {slots.map(schedule => {
                        const isSelected = selectedSchedule?.schedule_id === schedule.schedule_id;
                        return (
                            <button
                                key={schedule.schedule_id + schedule.start_time}
                                onClick={() => onSelectSchedule(schedule)}
                                disabled={!schedule.is_available}
                                aria-pressed={isSelected}
                                aria-label={
                                    schedule.is_available
                                        ? isSelected
                                            ? `Đã chọn khung giờ ${schedule.start_time}`
                                            : `Chọn khung giờ ${schedule.start_time}`
                                        : `Khung giờ ${schedule.start_time} không có sẵn`
                                }
                                className={`
                                    h-12 w-full rounded-full transition-colors font-medium text-center text-sm border
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                    ${
                                        !schedule.is_available
                                        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        : isSelected
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                        : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                                    }
                                    `}
                            >
                                {schedule.start_time}
                            </button>
                        );
                    })}
                </div>
            </div>
        )
    );

    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mt-4">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-600" /> Chọn Khung Giờ</h4>
            {error ? (
                <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 mr-2" /> {error}
                </div>
            ) : schedules.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Không có khung giờ trống cho ngày này.</p>
            ) : (
                <div>
                    <TimeSlotGroup key="morning" title="Buổi Sáng" slots={morningSlots} icon={<Sun className="w-5 h-5 mr-2 text-yellow-500" />} />
                    <TimeSlotGroup key="afternoon" title="Buổi Chiều" slots={afternoonSlots} icon={<Sunset className="w-5 h-5 mr-2 text-orange-500" />} />
                    <TimeSlotGroup key="evening" title="Buổi Tối" slots={eveningSlots} icon={<Moon className="w-5 h-5 mr-2 text-indigo-500" />} />
                </div>
            )}
        </div>
    )
}