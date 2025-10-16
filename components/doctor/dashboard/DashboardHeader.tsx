import { Activity } from "lucide-react";

interface DashboardHeaderProps {
  doctorName: string;
  date: string;
}

export const DashboardHeader = ({ doctorName, date }: DashboardHeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Chào mừng trở lại, {doctorName}</h1>
      <p className="text-gray-600 mt-1">{date}</p>
    </div>
    <div className="flex items-center space-x-3">
      <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
        <Activity className="h-4 w-4 inline mr-2" />
        Xem báo cáo
      </button>
    </div>
  </div>
);