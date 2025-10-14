"use client";

import { DashboardHeader } from "@/components/doctor/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/doctor/dashboard/StatsGrid";
import { QuickActions } from "@/components/doctor/dashboard/QuickActions";
import { UpcomingAppointments } from "@/components/doctor/dashboard/UpcomingAppointments";
import { Notifications } from "@/components/doctor/dashboard/Notifications";
import { WeeklyPerformance } from "@/components/doctor/dashboard/WeeklyPerformance";
import { NewPatients } from "@/components/doctor/dashboard/NewPatients";

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6 p-6"> {/* Thêm padding cho trang */}
      
      <DashboardHeader 
        doctorName="BS. Nguyễn Văn A" 
        date="Hôm nay là Thứ Ba, 14 tháng 10, 2025" 
      />

      <StatsGrid />

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <UpcomingAppointments />
        <Notifications />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyPerformance />
        <NewPatients />
      </div>

    </div>
  );
}