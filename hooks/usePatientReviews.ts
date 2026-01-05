import { useState, useCallback } from 'react';
import type { DoctorReview } from '@/types/types';
import { apiClient } from '@/lib/api';

interface UseReviewsOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const usePatientReviews = (options?: UseReviewsOptions) => {
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch patient's reviews
  const fetchMyReviews = useCallback(async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/reviews/patient/${patientId}`, {
        method: 'GET',
      });

      if (response?.status && Array.isArray(response.data)) {
        setReviews(response.data as DoctorReview[]);
      } else {
        const errorMsg = response?.message || 'Không thể tải đánh giá';
        setError(errorMsg);
        options?.onError?.(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Lỗi kết nối';
      setError(errorMsg);
      options?.onError?.(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Create review
  const createReview = useCallback(async (data: {
    doctor_id: string;
    patient_id: string;
    title?: string;
    content: string;
    rating_score: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      if (response?.status && response?.data) {
        setReviews(prev => [response.data as DoctorReview, ...prev]);
        options?.onSuccess?.();
        return response.data as DoctorReview;
      } else {
        const errorMsg = response?.message || 'Không thể tạo đánh giá';
        setError(errorMsg);
        options?.onError?.(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Lỗi kết nối';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Update review
  const updateReview = useCallback(async (reviewId: string, data: {
    title?: string;
    content?: string;
    rating_score?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      if (response?.status && response?.data) {
        setReviews(prev =>
          prev.map(r => r.review_id === reviewId ? response.data as DoctorReview : r)
        );
        options?.onSuccess?.();
        return response.data as DoctorReview;
      } else {
        const errorMsg = response?.message || 'Không thể cập nhật đánh giá';
        setError(errorMsg);
        options?.onError?.(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Lỗi kết nối';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Delete review
  const deleteReview = useCallback(async (reviewId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response?.status) {
        setReviews(prev => prev.filter(r => r.review_id !== reviewId));
        options?.onSuccess?.();
      } else {
        const errorMsg = response?.message || 'Không thể xóa đánh giá';
        setError(errorMsg);
        options?.onError?.(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Lỗi kết nối';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options]);

  // Vote helpful
  const voteHelpful = useCallback(async (reviewId: string, patientId: string, isHelpful: boolean) => {
    setError(null);
    try {
      const response = await apiClient('/api/review-helpful', {
        method: 'POST',
        body: JSON.stringify({
          review_id: reviewId,
          patient_id: patientId,
          is_helpful: isHelpful,
        }),
      });

      if (response?.status) {
        // Update local review with new helpful_count
        const updatedReview = response.data as DoctorReview;
        setReviews(prev =>
          prev.map(r => r.review_id === reviewId ? updatedReview : r)
        );
        return updatedReview;
      } else {
        const errorMsg = response?.message || 'Không thể bình chọn';
        setError(errorMsg);
        options?.onError?.(errorMsg);
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Lỗi kết nối';
      setError(errorMsg);
      options?.onError?.(errorMsg);
      throw error;
    }
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    reviews,
    isLoading,
    error,
    fetchMyReviews,
    createReview,
    updateReview,
    deleteReview,
    voteHelpful,
    clearError,
  };
};
