import { Clock, CalendarDays, CalendarPlus } from "lucide-react";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white shadow-sm border border-gray-200 rounded-lg ${className}`}>
    {children}
  </div>
);

export const ScheduleStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Tổng giờ tuần này</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">32h</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-lg"><Clock className="h-6 w-6 text-blue-600" /></div>
      </div>
    </Card>
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Slots đã đặt</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">18/40</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg"><CalendarDays className="h-6 w-6 text-green-600" /></div>
      </div>
    </Card>
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Slots trống</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">22</p>
        </div>
        <div className="p-3 bg-yellow-50 rounded-lg"><CalendarPlus className="h-6 w-6 text-yellow-600" /></div>
      </div>
    </Card>
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Tỷ lệ đặt chỗ</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">45%</p>
        </div>
        <div className="p-3 bg-purple-50 rounded-lg"><CalendarDays className="h-6 w-6 text-purple-600" /></div>
      </div>
    </Card>
  </div>
);