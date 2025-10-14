import { Card } from "@/components/ui/Card";
import { QuickActionButton } from "./QuickActionButton";
import { Calendar, Users, Video, MessageSquare } from "lucide-react";

export const QuickActions = () => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <QuickActionButton icon={Calendar} label="Tạo lịch hẹn" color="blue" />
      <QuickActionButton icon={Users} label="Thêm bệnh nhân" color="green" />
      <QuickActionButton icon={Video} label="Bắt đầu khám" color="purple" />
      <QuickActionButton icon={MessageSquare} label="Tin nhắn" color="yellow" />
    </div>
  </Card>
);