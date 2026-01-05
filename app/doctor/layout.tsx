'use client'

import Sidebar from "@/components/doctor/layout/Sidebar";
import Header from "@/components/doctor/layout/Header";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import React from "react"; 

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {  
  return (
    <AppointmentProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar cố định */}
        <Sidebar />

        {/* Khu vực nội dung (có thể cuộn) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header cố định */}
          <Header />
          {/* Nội dung trang (có thể cuộn) */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </AppointmentProvider>
  );
}