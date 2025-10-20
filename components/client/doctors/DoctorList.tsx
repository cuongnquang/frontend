import React, { useMemo, useState, useEffect } from 'react';
import { Doctor } from '@/types/types';
import DoctorCard from './DoctorCard'; // Import component con

interface DoctorListProps {
  doctors: Doctor[];
  resultsCount: number;
  onSelectDoctor: (doctorId: string) => void;
  onAppointmentDoctor: (doctorId: string) => void;
  searchQuery?: string;
  highlightId?: string | number | null;
}

export default function DoctorList({ doctors, resultsCount, onSelectDoctor, onAppointmentDoctor, highlightId }: DoctorListProps) {
  const ITEMS_PER_PAGE = 10;
  // resultsCount should reflect the provided doctors array length (filtered)
  const totalPages = Math.max(1, Math.ceil(resultsCount / ITEMS_PER_PAGE));
  const [currentPage, setCurrentPage] = useState(1);

  // Ensure current page is valid if resultsCount changes externally
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const visibleDoctors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return doctors.slice(start, start + ITEMS_PER_PAGE);
  }, [doctors, currentPage]);

  // if a highlightId is provided, ensure the page containing that doctor is active
  useEffect(() => {
    if (!highlightId) return;
    const idx = doctors.findIndex((d) => String(d.doctor_id) === String(highlightId));
    if (idx === -1) return;
    const pageFor = Math.floor(idx / ITEMS_PER_PAGE) + 1;
    if (pageFor !== currentPage) setCurrentPage(pageFor);
  }, [doctors, highlightId, currentPage]);

  const goTo = (page: number) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-gray-600">
          Tìm thấy <span className="font-semibold text-gray-900">{resultsCount}</span> bác sĩ
        </p>

        <p className="text-sm text-gray-500">
          Hiển thị {(resultsCount === 0) ? 0 : (Math.min(resultsCount, (currentPage - 1) * ITEMS_PER_PAGE + visibleDoctors.length))} kết quả — trang {currentPage}/{totalPages}
        </p>
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        {visibleDoctors.map((doctor, idx) => {
          const alt = (doctor as unknown as Record<string, unknown>)['doctorId'] as string | undefined;
          const idFromDoctor = doctor.doctor_id ?? (doctor as unknown as { id?: string }).id ?? alt ?? '';
          const doctorId = idFromDoctor ? String(idFromDoctor) : '';
          return (
            <DoctorCard
              key={doctorId || idx}
              doctor={doctor}
              onSelect={() => doctorId && onSelectDoctor(doctorId)}
              onBook={() => doctorId && onAppointmentDoctor(doctorId)}
            />
          );
        })}

        {resultsCount === 0 && (
          <div className="text-center py-10 text-gray-500 bg-white rounded-xl shadow-sm">
            Không tìm thấy bác sĩ nào phù hợp với tiêu chí tìm kiếm.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex text-black  items-center space-x-2">
          <button
            onClick={() => goTo(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md border ${currentPage === 1 ? 'text-gray-400 border-gray-200' : 'hover:bg-gray-50'}`}
          >
            Trước
          </button>

          {/* Simple page buttons: show a window around current page */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => {
                // show first, last, and window of +-2 around current
                return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2;
              })
              .map((p, i, arr) => {
                // insert ellipsis where gaps exist
                const prev = i > 0 ? arr[i - 1] : null;
                const showEllipsis = prev !== null && p - prev! > 1;
                return (
                  <React.Fragment key={p}>
                    {showEllipsis && <span className="px-2">…</span>}
                    <button
                      onClick={() => goTo(p)}
                      className={`px-3 py-1 rounded-md border ${p === currentPage ? 'bg-indigo-600 text-white border-indigo-600' : 'hover:bg-gray-50'}`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            onClick={() => goTo(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md border ${currentPage === totalPages ? 'text-black border-gray-200' : 'hover:bg-gray-50'}`}
          >
            Sau
          </button>
        </div>

        <div className="text-sm text-black text-gray-500">
          Hiển thị {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, resultsCount)} - {Math.min(currentPage * ITEMS_PER_PAGE, resultsCount)} trên {resultsCount}
        </div>
      </div>
    </div>
  );
}