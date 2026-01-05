import { useState, useCallback } from 'react';
import type { DoctorReview } from '@/types/types';
import { apiClient } from '@/lib/api';

interface UseDoctorReviewsOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface PaginatedResponse {
  data: DoctorReview[];
  total: number;
  skip: number;
  take: number;
}

export const useDoctorReviews = (options?: UseDoctorReviewsOptions) => {
  const [reviews, setReviews] = useState<DoctorReview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState({ skip: 0, take: 10 });

  // Fetch doctor's reviews with pagination
  const fetchDoctorReviews = useCallback(async (
    doctorId: string,
    options?: { skip?: number; take?: number; sortBy?: 'newest' | 'oldest' | 'helpful' }
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = options?.skip ?? pagination.skip;
      const take = options?.take ?? pagination.take;

      const response = await apiClient(
        `/api/reviews/doctor/${doctorId}?skip=${skip}&take=${take}`,
        { method: 'GET' }
      );

      if (response?.status) {
        const data = response.data as PaginatedResponse;
        setReviews(data.data || []);
        setTotal(data.total || 0);
        setPagination({ skip, take });
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
  }, [pagination.skip, pagination.take, options]);

  // Fetch most helpful reviews
  const fetchMostHelpful = useCallback(async (
    doctorId: string,
    limit: number = 5
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(
        `/api/reviews/doctor/${doctorId}/helpful?limit=${limit}`,
        { method: 'GET' }
      );

      if (response?.status && Array.isArray(response.data)) {
        return response.data as DoctorReview[];
      } else {
        const errorMsg = response?.message || 'Không thể tải đánh giá';
        setError(errorMsg);
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

  // Reply to review
  const replyToReview = useCallback(async (
    reviewId: string,
    doctorReply: string
  ) => {
    setError(null);
    try {
      const response = await apiClient(`/api/reviews/${reviewId}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({ doctor_reply: doctorReply }),
      });

      if (response?.status && response?.data) {
        const updatedReview = response.data as DoctorReview;
        setReviews(prev =>
          prev.map(r => r.review_id === reviewId ? updatedReview : r)
        );
        options?.onSuccess?.();
        return updatedReview;
      } else {
        const errorMsg = response?.message || 'Không thể gửi phản hồi';
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

  // Search reviews
  const searchReviews = useCallback(async (
    doctorId: string,
    keyword: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient(
        `/api/reviews/search/${doctorId}?keyword=${encodeURIComponent(keyword)}`,
        { method: 'GET' }
      );

      if (response?.status && Array.isArray(response.data)) {
        return response.data as DoctorReview[];
      } else {
        const errorMsg = response?.message || 'Không thể tìm kiếm';
        setError(errorMsg);
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

  // Get helpful stats
  const getHelpfulStats = useCallback(async (reviewId: string) => {
    try {
      const response = await apiClient(
        `/api/review-helpful/stats/${reviewId}`,
        { method: 'GET' }
      );

      if (response?.status) {
        return response.data as { helpful: number; notHelpful: number; total: number };
      } else {
        throw new Error(response?.message || 'Không thể tải thống kê');
      }
    } catch (error) {
      console.error('Error fetching helpful stats:', error);
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      skip: prev.skip + prev.take
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      skip: Math.max(0, prev.skip - prev.take)
    }));
  }, []);

  return {
    reviews,
    isLoading,
    error,
    total,
    pagination,
    fetchDoctorReviews,
    fetchMostHelpful,
    replyToReview,
    searchReviews,
    getHelpfulStats,
    clearError,
    nextPage,
    prevPage,
  };
};
