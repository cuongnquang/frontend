import { Card } from "./Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "yellow" | "purple";
  trend?: "up" | "down";
}

export const StatCard = ({ title, value, change, icon: Icon, color = "blue", trend }: StatCardProps) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <span className={`ml-2 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend === 'up' ? '↑' : '↓'} {change}
              </span>
            )}
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${colors[color]}`}>
          <Icon className="h-7 w-7" />
        </div>
      </div>
    </Card>
  );
};