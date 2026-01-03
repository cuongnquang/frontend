import { Card } from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";
import { Appointment } from "@/contexts/AppointmentContext";

interface WeeklyPerformanceProps {
  appointments: Appointment[];
}

export const WeeklyPerformance = ({ appointments }: WeeklyPerformanceProps) => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  const weekAppointments = appointments.filter(a => {
    const apptDate = new Date(a.schedule_date);
    return apptDate >= weekAgo && apptDate <= today;
  });

  const completedThisWeek = weekAppointments.filter(a => a.status === 'completed').length;
  const totalThisWeek = weekAppointments.length;
  const completionRate = totalThisWeek > 0 ? Math.round((completedThisWeek / totalThisWeek) * 100) : 0;
  const averagePatients = totalThisWeek > 0 ? (totalThisWeek / 7).toFixed(1) : '0';
  const confirmedThisWeek = weekAppointments.filter(a => a.status === 'confirmed').length;
  const confirmationRate = totalThisWeek > 0 ? Math.round((confirmedThisWeek / totalThisWeek) * 100) : 0;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Hiệu suất tuần này</h2>
        <TrendingUp className="h-5 w-5 text-green-500" />
      </div>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Lịch hẹn hoàn thành</span>
            <span className="font-semibold text-gray-900">{completedThisWeek}/{totalThisWeek}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-500 h-2.5 rounded-full transition-all" style={{width: `${completionRate}%`}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{completionRate}% hoàn thành</p>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Tỷ lệ xác nhận</span>
            <span className="font-semibold text-gray-900">{confirmationRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{width: `${confirmationRate}%`}}></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{confirmedThisWeek} trong {totalThisWeek} được xác nhận</p>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Bệnh nhân/ngày (trung bình)</span>
            <span className="font-semibold text-gray-900">{averagePatients} lần</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">Tổng {totalThisWeek} lịch hẹn trong 7 ngày qua</p>
        </div>
      </div>
    </Card>
  );
};