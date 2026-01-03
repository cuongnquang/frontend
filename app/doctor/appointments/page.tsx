'use client';

import { useState, useEffect } from "react";
import { useAppointment } from "@/contexts/AppointmentContext";
import { AppointmentsHeader } from "@/components/doctor/appointments/AppointmentsHeader";
import { AppointmentToolbar } from "@/components/doctor/appointments/AppointmentToolbar";
import { AppointmentTabs } from "@/components/doctor/appointments/AppointmentTabs";
import { AppointmentList } from "@/components/doctor/appointments/AppointmentList";
import { AppointmentDetailModal } from "@/components/doctor/appointments/AppointmentDetailModal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Alert from "@/components/ui/Alert";

const TABS = [
  { id: 'all', label: 'Tất cả', count: 0 },
  { id: 'pending', label: 'Chờ xác nhận', count: 0 },
  { id: 'confirmed', label: 'Đã xác nhận', count: 0 },
  { id: 'completed', label: 'Hoàn thành', count: 0 },
  { id: 'cancelled', label: 'Đã hủy', count: 0 },
];

export default function AppointmentsPage() {
  const {
    appointments,
    loading,
    error,
    fetchAppointments,
    confirmAppointment,
    cancelAppointment,
    completeAppointment,
  } = useAppointment();

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const itemsPerPage = 10;

  // Lọc lịch hẹn theo tab và search
  const filteredAppointments = appointments
    .filter(appt => {
      const matchesTab = activeTab === "all" || appt.status === activeTab;
      const patientName = appt.patient_name || "";
      const matchesSearch = patientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  // Phân trang
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  // Tính số lượng theo từng tab
  const tabs = TABS.map(tab => ({
    ...tab,
    count:
      tab.id === 'all'
        ? appointments.length
        : appointments.filter(a => a.status === tab.id).length,
  }));

  // Xử lý xác nhận
  const handleConfirm = async (id: string) => {
    setActionLoading(true);
    setActionError(null);

    const result = await confirmAppointment(id);
    if (result.success) {
      setSelectedAppointment(null);
      // Refresh danh sách
      await fetchAppointments();
      setCurrentPage(1);
    } else {
      setActionError(result.message || 'Không thể xác nhận lịch hẹn');
    }

    setActionLoading(false);
  };

  // Xử lý hủy
  const handleCancel = async (id: string) => {
    setActionLoading(true);
    setActionError(null);

    const result = await cancelAppointment(id);
    if (result.success) {
      setSelectedAppointment(null);
      // Refresh danh sách
      await fetchAppointments();
      setCurrentPage(1);
    } else {
      setActionError(result.message || 'Không thể hủy lịch hẹn');
    }

    setActionLoading(false);
  };

  // Xử lý hoàn thành
  const handleComplete = async (id: string) => {
    setActionLoading(true);
    setActionError(null);

    const result = await completeAppointment(id);
    if (result.success) {
      setSelectedAppointment(null);
      // Refresh danh sách
      await fetchAppointments();
      setCurrentPage(1);
    } else {
      setActionError(result.message || 'Không thể hoàn thành lịch hẹn');
    }

    setActionLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <AppointmentsHeader />

      {/* Error Alert */}
      {error && <Alert message={error} type="error" />}
      {actionError && <Alert message={actionError} type="error" />}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Thanh công cụ Tìm kiếm & Lọc */}
          <AppointmentToolbar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Tabs và Danh sách lịch hẹn */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <AppointmentTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
            />
            <AppointmentList
              appointments={paginatedAppointments}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onComplete={handleComplete}
              onViewDetails={setSelectedAppointment}
              isLoading={actionLoading}
            />

            {/* Phân trang */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Hiển thị {startIndex + 1} đến {Math.min(startIndex + itemsPerPage, filteredAppointments.length)} trong {filteredAppointments.length} lịch hẹn
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Modal Chi tiết */}
          {selectedAppointment && (
            <AppointmentDetailModal
              appointment={selectedAppointment}
              onClose={() => setSelectedAppointment(null)}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onComplete={handleComplete}
              isLoading={actionLoading}
            />
          )}
        </>
      )}
    </div>
  );
}