import { CalendarPlus } from "lucide-react";

export const SchedulePageHeader = ({ onAddScheduleClick }) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Quản lý Lịch làm việc</h1>
      <p className="text-gray-600 mt-1">Thiết lập và quản lý thời gian làm việc của bạn</p>
    </div>
    <button 
      onClick={onAddScheduleClick}
      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
    >
      <CalendarPlus className="h-5 w-5 mr-2" />
      Thêm lịch mới
    </button>
  </div>
);  