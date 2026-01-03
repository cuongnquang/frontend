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
  const [reviewsData, setReviewsData] = useState<Doctor[] | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });
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
          apiClient<DoctorSchedule[]>(`/api/schedules?doctor_id=${id}`),
          apiClient<Doctor[]>(`/api/doctors/${id}`)
        ]);

        // Xử lý kết quả
        console.log('📅 Schedules Response:', schedulesRes);
        if (schedulesRes.status && schedulesRes.data) {
          const schedulesList = schedulesRes.data as DoctorSchedule[];
          console.log('📅 Raw schedules from API:', JSON.stringify(schedulesList.slice(0, 2), null, 2)); // Log 2 schedules đầu tiên
          
          // Đảm bảo schedule_id tồn tại
          const transformedSchedules = schedulesList.map(s => {
            if (!s.schedule_id) {
              console.warn('⚠️ Schedule missing schedule_id:', s);
            }
            return { ...s };
          });
          console.log('✅ Schedules loaded:', transformedSchedules.length, 'items');
          setAllSchedules(transformedSchedules);
        } else {
          console.error('❌ Schedules error:', schedulesRes.message);
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
   * Chỉ hiển thị lịch khám còn trống (is_available = true)
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
      // Lọc các lịch khám cho ngày được chọn và chỉ hiển thị lịch còn trống
      const schedulesForDate = allSchedules.filter(
        s => s.schedule_date.startsWith(dateString) && s.is_available === true
      );
      setSchedulesForSelectedDate(schedulesForDate);
      setSelectedSchedule(null); // Reset lựa chọn khung giờ khi đổi ngày
    }
  }, [selectedDate, allSchedules]);
  const handleSelectSchedule = (schedule: DoctorSchedule) => {
    console.log('🕐 Selected schedule:', schedule);
    console.log('🕐 Schedule ID:', schedule.schedule_id);
    console.log('🕐 Full schedule object:', JSON.stringify(schedule, null, 2));
    setSelectedSchedule(schedule);
  };

  const handleBookingSubmit = () => {
    if (!doctor) return;
    if (selectedSchedule) {
      console.log('📝 Submitting with selectedSchedule:', selectedSchedule);
      
      // Sử dụng schedule_id, nếu không có thì dùng id
      const scheduleIdToUse = selectedSchedule.schedule_id || (selectedSchedule as any).id;
      console.log('📝 Schedule ID to use:', scheduleIdToUse);
      
      if (!scheduleIdToUse) {
        console.error('❌ No schedule ID found in object:', selectedSchedule);
        setAlert({ message: 'Lỗi: Không có ID lịch khám. Vui lòng thử lại.', type: 'error' });
        return;
      }
      
      const appointmentUrl = `/client/appointments?doctorId=${doctor.id}&scheduleId=${scheduleIdToUse}`;
      console.log('📝 Navigating to:', appointmentUrl);
      router.push(appointmentUrl);
    } else {
      setAlert({ message: 'Vui lòng chọn một khung giờ khám bệnh.', type: 'error' });
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

      {/* Alert thông báo */}
      {alert.type && (
        <Alert message={alert.message} type={alert.type} duration={4000} />
      )}

      <Footer />
    </div>
  );
}