import { Users, TrendingUp, CheckCircle } from "lucide-react";

interface PatientStatsCardsProps {
  totalPatients: number;
  newPatients: number;
  completedAppointments: number;
}

export const PatientStatsCards = ({ 
  totalPatients, 
  newPatients, 
  completedAppointments 
}: PatientStatsCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Tổng bệnh nhân đã khám</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalPatients}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Bệnh nhân mới (30 ngày)</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{newPatients}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <TrendingUp className="h-8 w-8 text-green-600" />
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Lịch khám hoàn thành</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{completedAppointments}</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <CheckCircle className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  </div>
);