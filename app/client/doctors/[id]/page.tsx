'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { toYYYYMMDD } from '@/lib/utils';
import { useRouter, useParams } from 'next/navigation';
import type { Doctor, DoctorSchedule, Review, DoctorReview } from '@/types/types';

import DoctorProfileCard from '@/components/client/doctors/details/DoctorProfileCard';
import DoctorInfoTabs from '@/components/client/doctors/details/DoctorInfoTabs';
import BookingPanel from '@/components/client/doctors/details/BookingPanel';
import RatingDialog from '@/components/client/doctors/details/RatingDialog';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Alert from '@/components/ui/Alert';
import { useDoctor } from '@/contexts/DoctorContext';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';
import { Star } from 'lucide-react';

// Helper function to convert DoctorReview[] to Review[]
function convertDoctorReviewsToReviews(doctorReviews: DoctorReview[]): Review[] {
  return doctorReviews.map(review => ({
    id: review.review_id,
    patient_name: review.Patient?.full_name || review.title || 'Bệnh nhân',
    rating: review.rating_score,
    comment: review.content,
    date: review.created_at,
    verified: review.is_verified,
    createdAt: review.created_at,
  }));
}

export default function DoctorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { user } = useAuth();

  const { selectedDoctor, fetchDoctorById, loading, error } = useDoctor();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<DoctorSchedule | null>(null);
  const [reviewsData, setReviewsData] = useState<DoctorReview[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });
  const [allSchedules, setAllSchedules] = useState<DoctorSchedule[]>([]);
  const [schedulesForSelectedDate, setSchedulesForSelectedDate] = useState<DoctorSchedule[]>([]);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  // Convert DoctorReview[] to Review[] for components
  const reviewsForDisplay = useMemo(() => convertDoctorReviewsToReviews(reviewsData), [reviewsData]);

  // Function to refresh reviews
  const refreshReviews = async () => {
    if (!id) return;
    try {
      console.log('🔄 Refreshing reviews for doctor:', id);
      // Add timestamp to avoid cache
      const timestamp = new Date().getTime();
      const reviewsRes = await apiClient(`/api/reviews?doctor_id=${id}&action=doctor&skip=0&take=100&_t=${timestamp}`);
      console.log('📝 Reviews refresh response:', reviewsRes);
      console.log('📝 Reviews refresh response data:', reviewsRes.data);
      if (reviewsRes.status && reviewsRes.data) {
        const reviewsResult = reviewsRes.data as any;
        console.log('📝 Reviews refresh result:', reviewsResult);
        // Backend trả về { reviews: [...], total: ... }
        const reviewsList = reviewsResult.reviews || (Array.isArray(reviewsResult) ? reviewsResult : []);
        console.log('✅ Parsed reviews:', reviewsList.length, 'reviews');
        console.log('✅ Parsed reviews list:', reviewsList);
        if (Array.isArray(reviewsList)) {
          setReviewsData(reviewsList);
        } else {
          console.error('❌ Reviews list is not an array:', reviewsList);
          setReviewsData([]);
        }
      } else {
        console.error('❌ Reviews refresh error:', reviewsRes.message || reviewsRes.error);
        // Không throw error, chỉ log để không làm gián đoạn UI
        // Set empty array nếu có lỗi để tránh undefined
        setReviewsData([]);
      }
    } catch (err) {
      console.error('❌ Error refreshing reviews:', err);
      // Không throw error, chỉ log
      // Set empty array để tránh undefined
      setReviewsData([]);
    }
  };

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
          apiClient(`/api/reviews?doctor_id=${id}&action=doctor&skip=0&take=100`)
        ]);

        // Xử lý kết quả
        console.log('📅 Schedules Response:', schedulesRes);
        if (schedulesRes.status && schedulesRes.data) {
          const schedulesList = schedulesRes.data as DoctorSchedule[];
          setAllSchedules(schedulesList);
        } else {
          console.error('❌ Schedules error:', schedulesRes.message);
          setLocalError(schedulesRes.message || 'Không thể tải lịch khám.');
        }

        // Load reviews
        console.log('📝 Reviews Response:', reviewsRes);
        console.log('📝 Reviews Response data:', reviewsRes.data);
        if (reviewsRes.status && reviewsRes.data) {
          const reviewsResult = reviewsRes.data as any;
          console.log('📝 Reviews Result:', reviewsResult);
          // Backend trả về { reviews: [...], total: ... }
          const reviewsList = reviewsResult.reviews || (Array.isArray(reviewsResult) ? reviewsResult : []);
          console.log('✅ Reviews loaded:', reviewsList.length, 'reviews');
          console.log('✅ Reviews list:', reviewsList);
          setReviewsData(reviewsList);
        } else {
          // Không set error nếu chỉ là lỗi network, chỉ log để debug
          console.error('❌ Reviews error:', reviewsRes.message || reviewsRes.error);
          // Nếu không có reviews, set mảng rỗng thay vì để undefined
          setReviewsData([]);
        }

        // Check if user has rated this doctor
        if (user?.patientId && id) {
          const checkRatingRes = await apiClient(`/api/ratings?doctor_id=${id}&patient_id=${user.patientId}&action=check`);
          if (checkRatingRes.status && checkRatingRes.data) {
            setHasRated((checkRatingRes.data as any).hasRated || false);
          }
        }

      } catch (err) {
        console.error('❌ Error fetching initial data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu';
        setLocalError(errorMessage);
      } finally {
        setLocalLoading(false);
      }
    };
    
    fetchInitialData();
  }, [id, fetchDoctorById, user?.patientId]);


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
    console.log('🕐 Schedule ID:', schedule.id);
    setSelectedSchedule(schedule);
  };

  const handleBookingSubmit = () => {
    if (!doctor) return;
    if (selectedSchedule) {
      // Sử dụng id từ DoctorSchedule type
      const scheduleIdToUse = selectedSchedule.id;
      
      if (!scheduleIdToUse) {
        console.error('❌ No schedule ID found in object:', selectedSchedule);
        setAlert({ message: 'Lỗi: Không có ID lịch khám. Vui lòng thử lại.', type: 'error' });
        return;
      }
      
      const appointmentUrl = `/client/appointments?doctorId=${doctor.id}&scheduleId=${scheduleIdToUse}`;
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
        ) : !doctor ? (
          <Alert message="Không tìm thấy thông tin bác sĩ." type="warning" />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <DoctorProfileCard doctor={doctor} reviews={reviewsForDisplay} />
              <DoctorInfoTabs 
                doctor={doctor} 
                reviews={reviewsForDisplay}
                showRatingButton={!!user?.patientId}
                onRatingClick={() => setShowRatingDialog(true)}
                hasRated={hasRated}
              />
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

      {/* Rating Dialog */}
      {showRatingDialog && user?.patientId && doctor && (
        <RatingDialog
          doctorId={doctor.id}
          patientId={user.patientId}
          doctorName={doctor.full_name}
          onClose={() => setShowRatingDialog(false)}
          onSuccess={async () => {
            setHasRated(true);
            setAlert({ message: 'Đánh giá của bạn đã được gửi thành công! Đang tải lại danh sách...', type: 'success' });
            // Wait a bit for database to commit
            await new Promise(resolve => setTimeout(resolve, 500));
            // Refresh reviews after successful submission
            await refreshReviews();
            // Also refresh hasRated status
            if (id) {
              const checkRatingRes = await apiClient(`/api/ratings?doctor_id=${id}&patient_id=${user.patientId}&action=check`);
              if (checkRatingRes.status && checkRatingRes.data) {
                setHasRated((checkRatingRes.data as any).hasRated || false);
              }
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}
