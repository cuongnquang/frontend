import { Card } from "@/components/ui/Card";
import { TrendingUp } from "lucide-react";

export const WeeklyPerformance = () => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900">Hiệu suất tuần này</h2>
      <TrendingUp className="h-5 w-5 text-green-500" />
    </div>
    <div className="space-y-4">
      {/* Progress Bar 1 */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Lịch hẹn hoàn thành</span>
          <span className="font-semibold text-gray-900">45/50</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full" style={{width: '90%'}}></div>
        </div>
      </div>
      {/* Progress Bar 2 */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Đánh giá trung bình</span>
          <span className="font-semibold text-gray-900">4.8/5.0</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '96%'}}></div>
        </div>
      </div>
      {/* Progress Bar 3 */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Thời gian phản hồi</span>
          <span className="font-semibold text-gray-900">Xuất sắc</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{width: '85%'}}></div>
        </div>
      </div>
    </div>
  </Card>
);