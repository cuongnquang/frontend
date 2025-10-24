import { Clock, CalendarDays, CalendarPlus, TrendingUp } from "lucide-react";

interface ScheduleStatsProps {
  schedules: Array<{
    id: string;
    doctor_name: string;
    schedule_date: string;
    start_time: string;
    end_time: string;
    is_available: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
}

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${className}`}>
    {children}
  </div>
);

export const ScheduleStats = ({ schedules }: ScheduleStatsProps) => {
  // Tính toán thống kê
  const totalSchedules = schedules.length;
  const availableSchedules = schedules.filter(s => s.is_available).length;
  const unavailableSchedules = totalSchedules - availableSchedules;
  
  // Tính tổng giờ làm việc
  const totalHours = schedules.reduce((total, schedule) => {
    const startTime = new Date(schedule.start_time);
    const endTime = new Date(schedule.end_time);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return total + durationHours;
  }, 0);

  // Tính tỷ lệ đặt chỗ (giả sử mỗi slot có thể có 1 bệnh nhân)
  const bookingRate = totalSchedules > 0 ? Math.round((availableSchedules / totalSchedules) * 100) : 0;

  // Lọc lịch trong tuần này
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
  
  const thisWeekSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.schedule_date);
    return scheduleDate >= startOfWeek && scheduleDate <= endOfWeek;
  });

  const thisWeekHours = thisWeekSchedules.reduce((total, schedule) => {
    const startTime = new Date(schedule.start_time);
    const endTime = new Date(schedule.end_time);
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationHours = durationMs / (1000 * 60 * 60);
    return total + durationHours;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng giờ tuần này</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {thisWeekHours.toFixed(1)}h
            </p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tổng số lịch</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totalSchedules}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <CalendarDays className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Lịch có thể đặt</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {availableSchedules}
            </p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <CalendarPlus className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Tỷ lệ khả dụng</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {bookingRate}%
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </Card>
    </div>
  );
};