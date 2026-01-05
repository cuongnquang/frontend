'use client';
import { useState } from 'react';
import { Star, MessageCircle, Trash2, Edit2, AlertCircle } from 'lucide-react';
import type { DoctorReview } from '@/types/types';
import { apiClient } from '@/lib/api';

interface PatientReviewCardProps {
  review: DoctorReview;
  isAuthor?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
}

export const PatientReviewCard = ({
  review,
  isAuthor = false,
  onDelete,
  onUpdate
}: PatientReviewCardProps) => {
  const [currentReview, setCurrentReview] = useState<DoctorReview>(review);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.')) return;

    setError('');
    setIsDeleting(true);
    try {
      const response = await apiClient(`/api/reviews/${currentReview.review_id}`, {
        method: 'DELETE',
      });

      if (response?.status) {
        onDelete?.(currentReview.review_id);
      } else {
        setError(response?.message || 'Không thể xóa đánh giá');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      setError('Không thể xóa đánh giá. Vui lòng thử lại.');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex gap-0.5">
                {renderStars(currentReview.rating_score)}
              </div>
              <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {currentReview.rating_score}/5 sao
              </span>
            </div>

            {currentReview.title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {currentReview.title}
              </h3>
            )}

            <p className="text-sm text-gray-500">
              Đánh giá vào {formatDate(currentReview.created_at)}
            </p>
          </div>

          {isAuthor && (
            <div className="flex gap-1 pl-4 border-l border-gray-200">
              <button
                onClick={() => onUpdate?.(currentReview.review_id)}
                className="p-2 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-700 transition"
                title="Chỉnh sửa đánh giá"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 hover:bg-red-50 rounded text-red-600 hover:text-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xóa đánh giá"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 border-b border-gray-100">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
          {currentReview.content}
        </p>
      </div>

      {/* Doctor Reply */}
      {currentReview.doctor_reply && (
        <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-50/50">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-blue-900 mb-1">
                Phản hồi từ bác sĩ
              </h4>
              {currentReview.reply_at && (
                <p className="text-xs text-blue-600 mb-3">
                  Trả lời vào {formatDate(currentReview.reply_at)}
                </p>
              )}
              <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap break-words">
                {currentReview.doctor_reply}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {currentReview.helpful_count > 0 
            ? `${currentReview.helpful_count} người thấy hữu ích`
            : 'Chưa có ai thấy hữu ích'}
        </span>
        {currentReview.is_verified && (
          <span className="inline-flex items-center text-xs font-medium text-green-600">
            ✓ Đã xác thực
          </span>
        )}
      </div>
    </div>
  );
};
