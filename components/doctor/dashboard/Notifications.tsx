import { Card } from "@/components/ui/Card";
import { NotificationItem } from "./NotificationItem";
import { notificationsData } from "@/app/doctor/data";

export const Notifications = () => (
  <Card>
    <div className="px-6 py-4 border-b border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
    </div>
    <div className="p-4 h-80 space-y-2">
      {notificationsData.map((notif, idx) => (
        <NotificationItem key={idx} {...notif} />
      ))}
    </div>
    <div className="px-6 py-3 border-t border-gray-200">
      <button className="text-sm font-medium text-blue-600 hover:text-blue-700 w-full text-center">
        Xem tất cả thông báo
      </button>
    </div>
  </Card>
);