'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { toYYYYMMDD } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import type { Doctor, DoctorSchedule, Review } from '@/types/types';

import DoctorProfileCard from '@/components/client/doctors/details/DoctorProfileCard';
import DoctorInfoTabs from '@/components/client/doctors/details/DoctorInfoTabs';
import BookingPanel from '@/components/client/doctors/details/BookingPanel';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { useDoctor } from '@/contexts/DoctorContext';
import { apiClient } from '@/lib/api';
import { reviews } from '@/app/doctor/data';

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const { selectedDoctor, fetchDoctorById, loading, error } = useDoctor();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);
  const [reviewsData, setReviewsData] = useState<Review[] | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [allSchedules, setAllSchedules] = useState<DoctorSchedule[]>([]);
  const [schedulesForSelectedDate, setSchedulesForSelectedDate] = useState<DoctorSchedule[]>([]);

  // ✅ Tối ưu: Tính toán các ngày có sẵn từ tất cả lịch khám đã tải
  const availableDates = useMemo(() => {
    const dateStrings = new Set(allSchedules.map(s => s.schedule_date.split('T')[0]));
    return Array.from(dateStrings).map(dateStr => new Date(dateStr + 'T00:00:00'));
  }, [allSchedules]);


  // ✅ OPTIMIZED: Hợp nhất các lệnh gọi API để tải dữ liệu ban đầu
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) return;
      setLocalLoading(true);
      setLocalError(null);
      // Reset trạng thái trước khi tải
      setSelectedDate(null);
      setSelectedSchedule(null);
      setSchedulesForSelectedDate([]);
      
      try {
        // Thực thi song song các lệnh gọi API
        const [_, schedulesRes, reviewsRes] = await Promise.all([
          fetchDoctorById(id),
          apiClient<DoctorSchedule[]>(`/api/schedules`),
          apiClient<Review[]>(`/api/reviews/doctor/${id}`)
        ]);

        // Xử lý kết quả
        if (schedulesRes.status && schedulesRes.data) {
          const transformedSchedules = (schedulesRes.data as DoctorSchedule[]).map(s => ({ ...s, schedule_id: s.schedule_id }));
          const filteredSchedules = transformedSchedules.filter(s => s.doctor_id === id);
          setAllSchedules(filteredSchedules);
        } else {
          setLocalError(schedulesRes.message || 'Không thể tải lịch khám.');
        }
        setReviewsData(reviewsRes.data || []);

      } catch (err) {
        console.error('❌ Error fetching initial data:', err);
        setLocalError('Không thể tải thông tin lịch khám.');
      } finally {
        setLocalLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, fetchDoctorById]);


  useEffect(() => {
    if (selectedDoctor) {
      document.title = `${selectedDoctor.full_name} — Thông tin bác sĩ`;
    }
  }, [selectedDoctor]);

  const doctor: Doctor | null = selectedDoctor as Doctor | null;

  /**
   * ✅ Tối ưu: Lọc các khung giờ từ dữ liệu đã có, không cần gọi API
   */
  const handleSelectDate = React.useCallback((date: Date) => {
    if (selectedDate?.getTime() === date.getTime()) {
      // Bỏ chọn nếu nhấn lại ngày đã chọn
      setSelectedDate(null);
      setSelectedSchedule(null);
      setSchedulesForSelectedDate([]);
    } else {
      setSelectedDate(date);
      const dateString = toYYYYMMDD(date);
      const schedulesForDate = allSchedules.filter(s => s.schedule_date.startsWith(dateString));
      setSchedulesForSelectedDate(schedulesForDate);
      setSelectedSchedule(null); // Reset lựa chọn khung giờ khi đổi ngày
    }
  }, [selectedDate, allSchedules]);
  const handleSelectSchedule = (schedule: DoctorSchedule) => {
    console.log('🕐 Selected schedule:', schedule);
    setSelectedSchedule(schedule);
  };

  const handleBookingSubmit = () => {
    if (!doctor) return;
    if (selectedSchedule) {
      router.push(`/client/appointments?doctorId=${doctor.id}&scheduleId=${selectedSchedule.schedule_id}`);
    } else {
      alert('Vui lòng chọn một khung giờ khám bệnh.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* breadcrumb + actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline"
            >Quay lại</button>
            <span className="text-gray-300">/</span>
            <span>Danh sách bác sĩ</span>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-900">{doctor?.full_name ?? '...'}</span>
          </div>

          <div className="flex items-center gap-3">
            {doctor?.User?.email && (
              <a 
                href={`mailto:${doctor.User.email}`} 
                className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
              >
                Liên hệ
              </a>
            )}

            <button 
              onClick={() => window.print()} 
              className="px-3 py-1.5 border rounded-md text-sm"
            >
              In trang
            </button>
          </div>
        </div>

        {loading || localLoading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : error || localError ? (
          <Alert message={error || localError || 'Đã có lỗi'} type="error" />
        ) : !doctor || !reviewsData ? (
          <Alert message="Không tìm thấy thông tin bác sĩ." type="warning" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <DoctorProfileCard doctor={doctor} reviews={reviews} />
              <DoctorInfoTabs doctor={doctor} reviews={reviews} />
            </div>

            <div className="lg:col-span-1">
              <BookingPanel
                availableDates={availableDates}
                schedules={schedulesForSelectedDate}
                selectedDate={selectedDate}
                selectedSchedule={selectedSchedule}
                onSelectDate={handleSelectDate}
                onSelectSchedule={handleSelectSchedule}
                onSubmit={handleBookingSubmit}
                isLoading={false}
                isLoadingDates={localLoading}
                error={schedulesForSelectedDate.length === 0 && selectedDate ? 'Không có khung giờ trống cho ngày này.' : null}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}