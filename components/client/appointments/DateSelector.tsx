import { ChevronRight, ChevronLeft } from 'lucide-react'

interface DateSelectorProps {
    availableDates: string[]
    selectedDate: string | null
    onSelectDate: (date: string) => void
}


const daysInMonth = 31 
const firstDayOfWeek = 4 

const getDayInfo = (day: number, availableDates: string[], selectedDate: string | null) => {
    const date = `2025-10-${String(day).padStart(2, '0')}`
    const isAvailable = availableDates.includes(date)
    const isSelected = selectedDate === date
    const isToday = day === 9
    return { date, isAvailable, isSelected, isToday }
}


export default function DateSelector({ availableDates, selectedDate, onSelectDate }: DateSelectorProps) {
    return (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-gray-800">Tháng 10/2025</h4>
                <div className="flex space-x-2">
                    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-200"><ChevronLeft className="w-5 h-5" /></button>
                    <button className="p-2 rounded-full text-gray-500 hover:bg-gray-200"><ChevronRight className="w-5 h-5" /></button>
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
                    const { date, isAvailable, isSelected, isToday } = getDayInfo(day, availableDates, selectedDate)
                    
                    return (
                        <button
                            key={date}
                            onClick={() => isAvailable && onSelectDate(date)}
                            disabled={!isAvailable}
                            className={`h-10 rounded-full text-sm font-medium transition-colors border ${
                                !isAvailable
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : isSelected
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                    : isToday
                                    ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                                    : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
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