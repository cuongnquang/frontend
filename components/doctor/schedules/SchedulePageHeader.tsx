import { Plus, Calendar, CalendarDays } from "lucide-react";

interface SchedulePageHeaderProps {
  onAddScheduleClick: () => void;
  onTemplateClick: () => void;
}

export const SchedulePageHeader = ({ onAddScheduleClick, onTemplateClick }: SchedulePageHeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch làm việc</h1>
      <p className="text-gray-600 mt-1">Tạo và quản lý lịch khám cho bệnh nhân</p>
    </div>
    <div className="flex items-center space-x-3">
      <button
        onClick={onTemplateClick}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <CalendarDays className="h-4 w-4 mr-2" />
        Mẫu tuần
      </button>
      <button
        onClick={onAddScheduleClick}
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Thêm lịch
      </button>
    </div>
  </div>
);