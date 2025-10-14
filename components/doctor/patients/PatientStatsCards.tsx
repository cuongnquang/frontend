import { Users, Activity, Calendar } from "lucide-react";

export const PatientStatsCards = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Tổng bệnh nhân</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">156</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Bệnh nhân mới tháng này</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <Activity className="h-8 w-8 text-green-600" />
        </div>
      </div>
    </div>
    
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Tái khám trong tuần</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg">
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  </div>
);