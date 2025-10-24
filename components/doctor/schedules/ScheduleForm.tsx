import { Save, X, Clock, Calendar } from "lucide-react";
import { useState } from "react";

interface ScheduleFormProps {
  editingSchedule?: any;
  onSubmit: (data: Array<{ schedule_date: string; start_time: string; end_time: string }>) => void;
  onClose: () => void;
}

const FormInput = ({ label, icon: Icon, ...props }: { label: string; icon?: any; [key: string]: any }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
      {Icon && <Icon className="h-4 w-4 mr-2 text-gray-500" />}
      {label}
    </label>
    <input 
      {...props} 
      className="block w-full h-10 p-3 text-black rounded-lg border-gray-300 shadow-sm sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
    />
  </div>
);

const TimeSlotButton = ({ 
  time, 
  selected, 
  onClick, 
  disabled = false 
}: { 
  time: string; 
  selected: boolean; 
  onClick: () => void; 
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
      selected 
        ? 'bg-blue-600 text-white border-blue-600' 
        : disabled 
        ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    }`}
  >
    {time}
  </button>
);

export const ScheduleForm = ({ editingSchedule, onSubmit, onClose }: ScheduleFormProps) => {
  const [selectedDate, setSelectedDate] = useState(editingSchedule?.schedule_date || '');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Các khung giờ có sẵn theo backend service
  const timeSlots = [
    { label: 'Ca sáng', slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00'] },
    { label: 'Ca chiều', slots: ['13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'] }
  ];

  const handleTimeSlotToggle = (time: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const formatDateToDDMMYYYY = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate || selectedTimeSlots.length === 0) {
      alert('Vui lòng chọn đầy đủ ngày và ít nhất một khung giờ khám');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const schedules = selectedTimeSlots.map(timeSlot => {
        // Tính toán giờ kết thúc (30 phút sau giờ bắt đầu)
        const [hours, minutes] = timeSlot.split(':').map(Number);
        const endTime = new Date();
        endTime.setHours(hours, minutes + 30, 0, 0);
        const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

        const schedule = {
          schedule_date: formatDateToDDMMYYYY(selectedDate),
          start_time: timeSlot,
          end_time: endTimeString
        };
        
        return schedule;
      });

      await onSubmit(schedules);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          {editingSchedule ? 'Chỉnh sửa lịch' : 'Thêm lịch mới'}
        </h2>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <FormInput 
          label="Ngày làm việc" 
          type="date" 
          icon={Calendar}
          value={selectedDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
          min={getMinDate()}
          required 
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            Chọn khung giờ khám (có thể chọn nhiều slot, mỗi slot 30 phút)
          </label>
          
          <div className="space-y-4">
            {timeSlots.map((shift) => (
              <div key={shift.label}>
                <h4 className="text-sm font-medium text-gray-800 mb-2">{shift.label}</h4>
                <div className="grid grid-cols-4 gap-2">
                  {shift.slots.map((time) => (
                    <TimeSlotButton
                      key={time}
                      time={time}
                      selected={selectedTimeSlots.includes(time)}
                      onClick={() => handleTimeSlotToggle(time)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTimeSlots.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center text-sm text-blue-800 mb-2">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                Đã chọn <strong>{selectedTimeSlots.length}</strong> khung giờ:
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {selectedTimeSlots.sort().map((time) => {
                const [hours, minutes] = time.split(':').map(Number);
                const endTime = new Date();
                endTime.setHours(hours, minutes + 30, 0, 0);
                const endTimeString = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
                return (
                  <div key={time} className="text-blue-700">
                    {time} - {endTimeString}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            disabled={isSubmitting || !selectedDate || selectedTimeSlots.length === 0}
            className="w-full flex justify-center items-center rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xử lý...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingSchedule ? 'Cập nhật lịch' : `Thêm ${selectedTimeSlots.length} lịch`}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};