import { Clock } from 'lucide-react'
import { DoctorSchedule } from '@/types/types'

interface TimeSlotSelectorProps {
    schedules: DoctorSchedule[]
    selectedSchedule: DoctorSchedule | null
    onSelectSchedule: (schedule: DoctorSchedule) => void
}

export default function TimeSlotSelector({ schedules, selectedSchedule, onSelectSchedule }: TimeSlotSelectorProps) {
    if (schedules.length === 0) {
        return <p className="text-center text-gray-500 py-8">Không có khung giờ trống cho ngày này.</p>
    }

    return (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mt-4">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center"><Clock className="w-5 h-5 mr-2 text-blue-600" /> Chọn Khung Giờ</h4>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {schedules.map(schedule => {
                    const isSelected = selectedSchedule?.schedule_id === schedule.schedule_id
                    return (
                        <button
                            key={schedule.schedule_id}
                            onClick={() => onSelectSchedule(schedule)}
                            disabled={!schedule.is_available}
                            className={`p-3 rounded-lg border-2 transition-all font-semibold text-center text-sm ${
                                !schedule.is_available
                                    ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                    : isSelected
                                    ? 'border-blue-600 bg-blue-100 text-blue-700 shadow-md transform scale-[1.02]'
                                    : 'border-gray-200 bg-white hover:border-blue-400 text-gray-800 hover:bg-blue-50'
                            }`}
                        >
                            {schedule.start_time}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}