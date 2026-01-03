import { Card } from "@/components/ui/Card";
import { AppointmentCard } from "./AppointmentCard";
import { Appointment } from "@/contexts/AppointmentContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Link from "next/link";

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  loading?: boolean;
}

export const UpcomingAppointments = ({ appointments, loading = false }: UpcomingAppointmentsProps) => {
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments
    .filter(a => a.schedule_date === today)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .slice(0, 5);

  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn hôm nay</h2>
        <Link href="/doctor/appointments" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Xem tất cả
        </Link>
      </div>
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : todayAppointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Không có lịch hẹn nào hôm nay</p>
          </div>
        ) : (
          <div className="space-y-2">
            {todayAppointments.map((appt) => (
              <AppointmentCard key={appt.id} appointment={appt} />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};