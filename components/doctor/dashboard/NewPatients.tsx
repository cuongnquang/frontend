import { Card } from "@/components/ui/Card";
import { Appointment } from "@/contexts/AppointmentContext";
import Link from "next/link";

interface NewPatientsProps {
  appointments: Appointment[];
}

export const NewPatients = ({ appointments }: NewPatientsProps) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const newPatients = appointments
    .filter(a => new Date(a.createdAt) >= thirtyDaysAgo)
    .reduce((acc, appt) => {
      const existing = acc.find(p => p.patient_id === appt.patient_id);
      if (!existing) {
        acc.push({
          patient_id: appt.patient_id,
          patient_name: appt.patient_name,
          createdAt: appt.createdAt,
          appointmentCount: 1
        });
      } else {
        existing.appointmentCount += 1;
      }
      return acc;
    }, [] as Array<{ patient_id: string; patient_name: string; createdAt: string; appointmentCount: number }>)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bệnh nhân mới (30 ngày)</h2>
          <p className="text-sm text-gray-500 mt-1">{newPatients.length} bệnh nhân mới</p>
        </div>
        <Link href="/doctor/patients" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {newPatients.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>Chưa có bệnh nhân mới</p>
          </div>
        ) : (
          newPatients.map((patient) => (
            <div key={patient.patient_id} className="p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-semibold text-sm">
                  {getInitials(patient.patient_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{patient.patient_name}</p>
                  <p className="text-xs text-gray-500">{formatDate(patient.createdAt)}</p>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-2">
                <span className="inline-block bg-gray-100 px-2 py-1 rounded">
                  {patient.appointmentCount} lịch hẹn
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};