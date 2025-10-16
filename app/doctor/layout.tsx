
// app/(doctor)/layout.tsx
import Sidebar from "@/components/doctor/layout/Sidebar";
import Header from "@/components/doctor/layout/Header";
import React from "react";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar cố định */}
      <Sidebar />

      {/* Khu vực nội dung (có thể cuộn) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header cố định */}
        <Header />
        {/* Nội dung trang (có thể cuộn) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}