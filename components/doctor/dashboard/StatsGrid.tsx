import { Calendar, CheckCircle2, Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Appointment } from "@/contexts/AppointmentContext";

interface StatsGridProps {
  appointments: Appointment[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, change, icon, color }: StatCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && <p className="text-xs text-green-600 mt-1">{change}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

export const StatsGrid = ({ appointments }: StatsGridProps) => {
  const today = new Date().toISOString().split('T')[0];
  const appointmentsToday = appointments.filter(a => a.schedule_date === today);
  const completedToday = appointmentsToday.filter(a => a.status === 'completed').length;
  const pendingToday = appointmentsToday.filter(a => a.status === 'pending').length;
  const confirmedToday = appointmentsToday.filter(a => a.status === 'confirmed').length;

  const stats = [
    {
      title: "Lịch hẹn hôm nay",
      value: appointmentsToday.length,
      change: `${confirmedToday} xác nhận`,
      icon: <Calendar className="h-6 w-6" />,
      color: "blue"
    },
    {
      title: "Đã hoàn thành",
      value: completedToday,
      icon: <CheckCircle2 className="h-6 w-6" />,
      color: "green"
    },
    {
      title: "Chờ xác nhận",
      value: pendingToday,
      icon: <Clock className="h-6 w-6" />,
      color: "yellow"
    },
    {
      title: "Bệnh nhân duy nhất",
      value: new Set(appointments.map(a => a.patient_id)).size,
      icon: <Users className="h-6 w-6" />,
      color: "purple"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map(stat => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};