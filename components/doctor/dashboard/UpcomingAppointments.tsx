import { Card } from "@/components/ui/Card";
import { AppointmentCard } from "./AppointmentCard";
import { appointmentsData } from "@/app/doctor/data";

export const UpcomingAppointments = () => (
  <Card className="lg:col-span-2">
    <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">Lịch hẹn sắp tới</h2>
      <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
        Xem tất cả
      </button>
    </div>
    <div className="p-4 space-y-2">
      {appointmentsData.map((appt, idx) => (
        <AppointmentCard key={idx} {...appt} />
      ))}
    </div>
  </Card>
);