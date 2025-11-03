'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Doctor, DoctorSchedule, Review } from '@/types/types';

import DoctorProfileCard from '@/components/client/doctors/details/DoctorProfileCard';
import DoctorInfoTabs from '@/components/client/doctors/details/DoctorInfoTabs';
import BookingPanel from '@/components/client/doctors/details/BookingPanel';

import { mockSchedules, mockReviews } from '@/public/data';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { useDoctor } from '@/contexts/DoctorContext';
import { apiClient } from '@/lib/api';

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;

  const { selectedDoctor, fetchDoctorById, loading, error } = useDoctor();

  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);
  const [schedulesData, setSchedulesData] = useState<DoctorSchedule[] | null>(null);
  const [reviewsData, setReviewsData] = useState<Review[] | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchDoctorById(id).catch(() => { });
    }
  }, [id, fetchDoctorById]);

  // fetch schedules and reviews specifically for this doctor
  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLocalLoading(true);
    setLocalError(null);

    const fetchSchedules = apiClient<DoctorSchedule[]>(`/v1/doctors/${id}/schedules`);
    const fetchReviews = apiClient<Review[]>(`/v1/reviews/doctor/${id}`);

    Promise.all([fetchSchedules, fetchReviews])
      .then(([sRes, rRes]) => {
        if (!mounted) return;
        if (sRes.status && sRes.data) setSchedulesData(sRes.data as DoctorSchedule[]);
        if (rRes.status && rRes.data) setReviewsData(rRes.data as Review[]);
        // if endpoints return not-ok, we silently fallback to doctor's own schedules / mockReviews for now
        if (!sRes.status || !rRes.status) {
          // do nothing special, fallback will be used
        }
      })
      .catch(() => {
        if (!mounted) return;
        setLocalError('Không thể tải lịch hoặc đánh giá bác sĩ.');
      })
      .finally(() => {
        if (!mounted) return;
        setLocalLoading(false);
      });

    return () => { mounted = false; };
  }, [id]);

  // set page title when doctor loaded
  useEffect(() => {
    if (selectedDoctor) {
      document.title = `${selectedDoctor.full_name} — Thông tin bác sĩ`;
    }
  }, [selectedDoctor]);

  const doctor: Doctor | null = selectedDoctor;
  // Prefer fetched schedules/reviews, then doctor.Schedules, then mocks
  const schedules: DoctorSchedule[] =
    schedulesData && schedulesData.length > 0
      ? schedulesData
      : doctor && doctor.Schedules && doctor.Schedules.length > 0
        ? doctor.Schedules
        : mockSchedules;

  const reviews: Review[] =
    reviewsData && reviewsData.length > 0
      ? reviewsData
      : mockReviews; // replace with real reviews API if available

  const handleSelectDate = (date: string) => {
    setSelectedDateString(date);
    setSelectedSchedule(null);
  };

  const handleSelectSchedule = (schedule: DoctorSchedule) => {
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <a href={`mailto:${doctor.User.email}`} className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">Liên hệ</a>
            )}
            <button onClick={() => window.print()} className="px-3 py-1.5 border rounded-md text-sm">In trang</button>
          </div>
        </div>

        {(loading || localLoading) ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (error || localError) ? (
          <Alert message={error || localError || 'Đã có lỗi'} type="error" />
        ) : !doctor ? (
          <Alert message="Không tìm thấy thông tin bác sĩ." type="warning" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <DoctorProfileCard doctor={doctor} reviews={reviews} />
              <DoctorInfoTabs doctor={doctor} reviews={reviews} />
            </div>

            <div className="lg:col-span-1">
              <BookingPanel
                schedules={schedules}
                selectedDate={selectedDateString}
                selectedSchedule={selectedSchedule}
                onSelectDate={handleSelectDate}
                onSelectSchedule={handleSelectSchedule}
                onSubmit={handleBookingSubmit}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}