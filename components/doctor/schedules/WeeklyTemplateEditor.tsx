import { Calendar, Clock, Save, X } from "lucide-react";
import { useState } from "react";

interface WeeklyTemplateEditorProps {
  onCreateManySchedules: (schedules: Array<{ schedule_date: string; start_time: string; end_time: string }>) => void;
  onClose: () => void;
}

const dayNames = { 
  monday: 'Thứ 2', 
  tuesday: 'Thứ 3', 
  wednesday: 'Thứ 4', 
  thursday: 'Thứ 5', 
  friday: 'Thứ 6', 
  saturday: 'Thứ 7', 
  sunday: 'Chủ nhật' 
};

const timeSlots = {
  morning: { label: 'Ca sáng', start: '08:00', end: '11:30', slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
  afternoon: { label: 'Ca chiều', start: '13:00', end: '17:30', slots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'] }
};

export const WeeklyTemplateEditor = ({ onCreateManySchedules, onClose }: WeeklyTemplateEditorProps) => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedShifts, setSelectedShifts] = useState<{ [day: string]: string[] }>({});
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{ [day: string]: { [shift: string]: string[] } }>({});
  const [startDate, setStartDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = Object.keys(dayNames) as Array<keyof typeof dayNames>;

  const getMondayOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
    
    // Reset shifts and time slots when day is deselected
    if (selectedDays.includes(day)) {
      setSelectedShifts(prev => {
        const newShifts = { ...prev };
        delete newShifts[day];
        return newShifts;
      });
      setSelectedTimeSlots(prev => {
        const newTimeSlots = { ...prev };
        delete newTimeSlots[day];
        return newTimeSlots;
      });
    }
  };

  const handleShiftToggle = (day: string, shift: string) => {
    setSelectedShifts(prev => ({
      ...prev,
      [day]: prev[day]?.includes(shift)
        ? prev[day].filter(s => s !== shift)
        : [...(prev[day] || []), shift]
    }));

    // Reset time slots when shift is deselected
    if (selectedShifts[day]?.includes(shift)) {
      setSelectedTimeSlots(prev => ({
        ...prev,
        [day]: {
          ...prev[day],
          [shift]: []
        }
      }));
    }
  };

  const handleTimeSlotToggle = (day: string, shift: string, timeSlot: string) => {
    setSelectedTimeSlots(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [shift]: prev[day]?.[shift]?.includes(timeSlot)
          ? prev[day][shift].filter(t => t !== timeSlot)
          : [...(prev[day]?.[shift] || []), timeSlot]
      }
    }));
  };

  const formatDateToDDMMYYYY = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generateSchedules = () => {
    const schedules: Array<{ schedule_date: string; start_time: string; end_time: string }> = [];
    
    if (!startDate) {
      alert('Vui lòng chọn ngày bắt đầu');
      return [];
    }

    const start = new Date(startDate);
    const mondayStart = getMondayOfWeek(start);
    
    selectedDays.forEach(day => {
      const dayIndex = days.indexOf(day as keyof typeof dayNames);
      const scheduleDate = new Date(mondayStart);
      scheduleDate.setDate(mondayStart.getDate() + dayIndex);
      
      const shifts = selectedShifts[day] || [];
      shifts.forEach(shift => {
        const timeSlotsForShift = selectedTimeSlots[day]?.[shift] || [];
        timeSlotsForShift.forEach(slot => {
          // Tính giờ kết thúc (30 phút sau)
          const [hours, minutes] = slot.split(':').map(Number);
          const endTime = new Date();
          endTime.setHours(hours, minutes + 30, 0, 0);
          const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
          
          schedules.push({
            schedule_date: formatDateToDDMMYYYY(scheduleDate),
            start_time: slot,
            end_time: endTimeString
          });
          
          console.log('WeeklyTemplateEditor - Adding schedule:', {
            schedule_date: formatDateToDDMMYYYY(scheduleDate),
            start_time: slot,
            end_time: endTimeString
          });
        });
      });
    });

    return schedules;
  };

  const handleSubmit = async () => {
    const schedules = generateSchedules();
    
    if (schedules.length === 0) {
      alert('Vui lòng chọn ít nhất một ngày, ca và khung giờ cụ thể');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCreateManySchedules(schedules);
    } catch (error) {
      console.error('Error creating schedules:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getTotalSlots = () => {
    return Object.values(selectedTimeSlots).reduce((total, daySlots) => {
      return total + Object.values(daySlots).reduce((dayTotal, shiftSlots) => {
        return dayTotal + shiftSlots.length;
      }, 0);
    }, 0);
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Tạo lịch theo mẫu tuần
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Tạo nhiều lịch cùng lúc cho các ngày trong tuần (từ thứ 2)
          </p>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ngày bắt đầu tuần (sẽ tự động tính từ thứ 2)
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={getMinDate()}
            className="block w-full h-10 p-3 text-black rounded-lg border-gray-300 shadow-sm sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          {startDate && (
            <p className="text-xs text-gray-500 mt-1">
              Tuần sẽ bắt đầu từ: {formatDateToDDMMYYYY(getMondayOfWeek(new Date(startDate)))} (Thứ 2)
            </p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn các ngày trong tuần</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {days.map(day => (
              <div key={day} className="flex items-center">
                <input
                  type="checkbox"
                  id={day}
                  checked={selectedDays.includes(day)}
                  onChange={() => handleDayToggle(day)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={day} className="ml-2 text-sm text-gray-700">
                  {dayNames[day as keyof typeof dayNames]}
                </label>
              </div>
            ))}
          </div>
        </div>

        {selectedDays.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Chọn ca và khung giờ cụ thể</h3>
            <div className="space-y-4">
              {selectedDays.map(day => (
                <div key={day} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-800 mb-3">{dayNames[day as keyof typeof dayNames]}</h4>
                  <div className="space-y-3">
                    {Object.entries(timeSlots).map(([shiftKey, shift]) => (
                      <div key={shiftKey}>
                        <label className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            checked={selectedShifts[day]?.includes(shiftKey) || false}
                            onChange={() => handleShiftToggle(day, shiftKey)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {shift.label} ({shift.start} - {shift.end})
                          </span>
                        </label>
                        
                        {selectedShifts[day]?.includes(shiftKey) && (
                          <div className="ml-6">
                            <p className="text-xs text-gray-600 mb-2">Chọn khung giờ cụ thể:</p>
                            <div className="grid grid-cols-4 gap-2">
                              {shift.slots.map(slot => (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => handleTimeSlotToggle(day, shiftKey, slot)}
                                  className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                                    selectedTimeSlots[day]?.[shiftKey]?.includes(slot)
                                      ? 'bg-blue-600 text-white border-blue-600'
                                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {getTotalSlots() > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-blue-800">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                Sẽ tạo tổng cộng <strong>{getTotalSlots()}</strong> slot lịch khám
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || getTotalSlots() === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang tạo...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Tạo {getTotalSlots()} lịch
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};