"use client";

import { useAppointment } from "@/hooks/useAppointment";
import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/doctor/dashboard/DashboardHeader";
import { StatsGrid } from "@/components/doctor/dashboard/StatsGrid";
import { QuickActions } from "@/components/doctor/dashboard/QuickActions";
import { UpcomingAppointments } from "@/components/doctor/dashboard/UpcomingAppointments";
import { WeeklyPerformance } from "@/components/doctor/dashboard/WeeklyPerformance";
import { NewPatients } from "@/components/doctor/dashboard/NewPatients";

export default function DoctorDashboardPage() {
  const { appointments, loading } = useAppointment();
  const [doctorName, setDoctorName] = useState("Bác sĩ");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const authData = localStorage.getItem('user');
    if (authData) {
      try {
        const user = JSON.parse(authData);
        setDoctorName(user.full_name || "Bác sĩ");
      } catch (e) {
        // Fallback
      }
    }

    const today = new Date();
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
    const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    setCurrentDate(`Hôm nay là ${dayName}, ${today.getDate()} ${monthName}, ${today.getFullYear()}`);
  }, []);

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader 
        doctorName={doctorName}
        date={currentDate}
      />

      <StatsGrid appointments={appointments} />

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UpcomingAppointments appointments={appointments} loading={loading} />
        </div>
        <div>
          <WeeklyPerformance appointments={appointments} />
        </div>
      </div>

      <NewPatients appointments={appointments} />
    </div>
  );
}