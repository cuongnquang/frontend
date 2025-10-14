import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  color: "blue" | "green" | "purple" | "yellow";
  onClick?: () => void;
}

export const QuickActionButton = ({ icon: Icon, label, color, onClick }: QuickActionButtonProps) => {
  const colors = {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-600",
    green: "bg-green-50 hover:bg-green-100 text-green-600",
    purple: "bg-purple-50 hover:bg-purple-100 text-purple-600",
    yellow: "bg-yellow-50 hover:bg-yellow-100 text-yellow-600",
  };
  
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center p-4 rounded-xl transition-colors ${colors[color]}`}
    >
      <Icon className="h-6 w-6 mb-2" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};