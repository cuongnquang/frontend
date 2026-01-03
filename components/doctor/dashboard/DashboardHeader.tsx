"use client";

interface DashboardHeaderProps {
  doctorName: string;
  date: string;
}

export const DashboardHeader = ({ doctorName, date }: DashboardHeaderProps) => (
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Chào mừng trở lại, {doctorName}</h1>
      <p className="text-gray-600 mt-1">{date}</p>
    </div>
  </div>
);