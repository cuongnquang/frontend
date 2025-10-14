import { Calendar, MessageSquare, AlertCircle } from "lucide-react";

interface NotificationItemProps {
  type: "appointment" | "message" | "alert";
  message: string;
  time: string;
}

export const NotificationItem = ({ type, message, time }: NotificationItemProps) => {
  const icons = {
    appointment: { Icon: Calendar, color: "text-blue-500 bg-blue-50" },
    message: { Icon: MessageSquare, color: "text-green-500 bg-green-50" },
    alert: { Icon: AlertCircle, color: "text-red-500 bg-red-50" },
  };
  
  const { Icon, color } = icons[type];
  
  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">{message}</p>
        <p className="text-xs text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
};