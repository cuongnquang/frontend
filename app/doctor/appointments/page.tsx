'use client';
import { useState } from "react";
import { appointments as allAppointments, tabs } from "../data"; // Import data
import { AppointmentsHeader } from "@/components/doctor/appointments/AppointmentsHeader";
import { AppointmentToolbar } from "@/components/doctor/appointments/AppointmentToolbar";
import { AppointmentTabs } from "@/components/doctor/appointments/AppointmentTabs";
import { AppointmentList } from "@/components/doctor/appointments/AppointmentList";
import { AppointmentDetailModal } from "@/components/doctor/appointments/AppointmentDetailModal";

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Logic lọc được giữ ở component cha
  const filteredAppointments = allAppointments.filter(appt => {
    const matchesTab = activeTab === "all" || appt.status === activeTab;
    const matchesSearch = appt.patient.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Các hàm xử lý sự kiện
  const handleConfirm = (id: string) => {
    console.log("Confirm appointment:", id);
    // Cập nhật trạng thái...
    setSelectedAppointment(null); // Đóng modal nếu đang mở
  };

  const handleCancel = (id: string) => {
    console.log("Cancel appointment:", id);
    // Cập nhật trạng thái...
    setSelectedAppointment(null); // Đóng modal nếu đang mở
  };

  return (
    <div className="space-y-6 p-6"> {/* Thêm padding cho trang */}
      
      {/* Header */}
      <AppointmentsHeader />

      {/* Thanh công cụ Tìm kiếm & Lọc */}
      <AppointmentToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Tabs và Danh sách lịch hẹn */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <AppointmentTabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <AppointmentList 
          appointments={filteredAppointments}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          onViewDetails={setSelectedAppointment}
        />
      </div>

      {/* Modal Chi tiết */}
      {selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}