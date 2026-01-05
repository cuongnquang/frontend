'use client';
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAlert } from "@/components/ui/AlertContainer";
import { apiClient } from "@/lib/api";
import type { DoctorReview, RatingStats } from "@/types/types";
import { ReviewsPageHeader } from "@/components/doctor/reviews/ReviewsPageHeader";
import { ReviewStats } from "@/components/doctor/reviews/ReviewStats";
import { RatingDistribution } from "@/components/doctor/reviews/RatingDistribution";
import { ReviewList } from "@/components/doctor/reviews/ReviewList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ReviewsPage() {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviewData = async () => {
      // Check both Doctor.id and doctorId formats
      const doctorId = (user as any)?.Doctor?.id || user?.doctorId;
      
      if (!doctorId) {
        console.warn('⚠️ No doctor ID found. User:', user);
        setLoading(false);
        showAlert("Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản bác sĩ.", "error");
        return;
      }

      setLoading(true);

      try {
        // Fetch reviews and stats in parallel
        const [reviewsRes, statsRes] = await Promise.all([
          apiClient(`/api/reviews/doctor/${doctorId}?skip=0&take=100`),
          apiClient(`/api/ratings/doctor/${doctorId}/stats`),
        ]);

        // Handle reviews response
        if (reviewsRes?.status && reviewsRes?.data) {
          // Backend returns { reviews: [...], total: ... } or just reviews array
          const reviewsData = (reviewsRes.data as any)?.reviews || 
                            (Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
          console.log('📝 Doctor reviews loaded:', reviewsData.length, 'reviews');
          setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        } else {
          console.error('❌ Reviews error:', reviewsRes?.message || 'Unknown error');
          showAlert(reviewsRes?.message || "Không thể tải đánh giá", "error");
        }

        // Handle stats response
        if (statsRes?.status && statsRes?.data) {
          setStats(statsRes.data);
        } else {
          console.warn('⚠️ Stats not loaded:', statsRes?.message);
        }
      } catch (err) {
        console.error("Error fetching review data:", err);
        showAlert("Không thể tải dữ liệu đánh giá. Vui lòng thử lại sau.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [user, showAlert]);

  const ratingDistribution = stats?.ratingBreakdown
    ? [
        {
          stars: 5,
          count: stats.ratingBreakdown.fiveStar,
          percentage: stats.totalRatings > 0 
            ? Math.round((stats.ratingBreakdown.fiveStar / stats.totalRatings) * 100)
            : 0,
        },
        {
          stars: 4,
          count: stats.ratingBreakdown.fourStar,
          percentage: stats.totalRatings > 0
            ? Math.round((stats.ratingBreakdown.fourStar / stats.totalRatings) * 100)
            : 0,
        },
        {
          stars: 3,
          count: stats.ratingBreakdown.threeStar,
          percentage: stats.totalRatings > 0
            ? Math.round((stats.ratingBreakdown.threeStar / stats.totalRatings) * 100)
            : 0,
        },
        {
          stars: 2,
          count: stats.ratingBreakdown.twoStar,
          percentage: stats.totalRatings > 0
            ? Math.round((stats.ratingBreakdown.twoStar / stats.totalRatings) * 100)
            : 0,
        },
        {
          stars: 1,
          count: stats.ratingBreakdown.oneStar,
          percentage: stats.totalRatings > 0
            ? Math.round((stats.ratingBreakdown.oneStar / stats.totalRatings) * 100)
            : 0,
        },
      ]
    : [
        { stars: 5, count: 0, percentage: 0 },
        { stars: 4, count: 0, percentage: 0 },
        { stars: 3, count: 0, percentage: 0 },
        { stars: 2, count: 0, percentage: 0 },
        { stars: 1, count: 0, percentage: 0 },
      ];

  const handleReply = async (reviewId: string, text: string) => {
    // ReviewCard now handles the API call, this is just for callback if needed
    // Refresh reviews after reply
    const doctorId = (user as any)?.Doctor?.id || user?.doctorId;
    if (doctorId) {
      const reviewsRes = await apiClient(`/api/reviews/doctor/${doctorId}?skip=0&take=100`);
      if (reviewsRes.status && reviewsRes.data) {
        const reviewsData = (reviewsRes.data as any).reviews || reviewsRes.data;
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <ReviewsPageHeader />

      {stats && (
        <>
          <ReviewStats
            averageRating={stats.averageRating}
            totalReviews={stats.totalRatings}
          />

          <RatingDistribution distribution={ratingDistribution} />
        </>
      )}

      {reviews.length > 0 ? (
        <ReviewList reviews={reviews} onReply={handleReply} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            Chưa có đánh giá nào.
          </p>
        </div>
      )}
    </div>
  );
}