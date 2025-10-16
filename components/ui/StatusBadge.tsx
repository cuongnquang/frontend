import { AppointmentStatus } from "@/app/doctor/data";

interface StatusBadgeProps {
  status: string; // Nhận status là string
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    [AppointmentStatus.PENDING]: "bg-yellow-50 text-yellow-700 border-yellow-200",
    [AppointmentStatus.CONFIRMED]: "bg-blue-50 text-blue-700 border-blue-200",
    [AppointmentStatus.COMPLETED]: "bg-green-50 text-green-700 border-green-200",
    [AppointmentStatus.CANCELLED]: "bg-red-50 text-red-700 border-red-200",
    [AppointmentStatus.NO_SHOW]: "bg-gray-50 text-gray-700 border-gray-200",
  };
  
  const text = {
    [AppointmentStatus.PENDING]: "Chờ xác nhận",
    [AppointmentStatus.CONFIRMED]: "Đã xác nhận",
    [AppointmentStatus.COMPLETED]: "Đã hoàn thành",
    [AppointmentStatus.CANCELLED]: "Đã hủy",
    [AppointmentStatus.NO_SHOW]: "Vắng mặt",
  };
  
  // Mặc định là NO_SHOW nếu status không khớp
  const displayStyle = styles[status] || styles[AppointmentStatus.NO_SHOW];
  const displayText = text[status] || text[AppointmentStatus.NO_SHOW];
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${displayStyle}`}>
      {displayText}
    </span>
  );
};