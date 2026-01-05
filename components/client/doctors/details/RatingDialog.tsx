'use client'

import React, { useState } from 'react';
import { Star, X, Loader2, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { 
  validateReviewForm, 
  sanitizeReviewInput, 
  sanitizeTitle,
  getUserFriendlyErrorMessage 
} from '@/utils/rating-validation';

interface RatingDialogProps {
  doctorId: string;
  patientId: string;
  doctorName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RatingDialog({
  doctorId,
  patientId,
  doctorName,
  onClose,
  onSuccess,
}: RatingDialogProps) {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form validation
  const validation = validateReviewForm(rating, title, content);
  const isFormValid = validation.isValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      // Validate form
      if (!isFormValid) {
        setError(validation.errors[0] || 'Vui lòng kiểm tra lại nội dung đánh giá');
        setIsLoading(false);
        return;
      }

      // Sanitize inputs
      const sanitizedTitle = sanitizeTitle(title);
      const sanitizedContent = sanitizeReviewInput(content);

      // Create review 
      const reviewResponse = await apiClient('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({
          doctor_id: doctorId,
          patient_id: patientId,
          title: sanitizedTitle || `Đánh giá ${rating} sao`,
          content: sanitizedContent,
          rating_score: rating,
          is_verified: true,
        }),
      });

      if (!reviewResponse?.status) {
        const rawErrorMessage = reviewResponse?.message || 'Không thể tạo đánh giá. Vui lòng thử lại.';
        const errorMessage = getUserFriendlyErrorMessage(rawErrorMessage);
        setError(errorMessage);
        return;
      }

      // Create rating separately to update doctor's stats
      try {
        await apiClient('/api/ratings', {
          method: 'POST',
          body: JSON.stringify({
            doctor_id: doctorId,
            patient_id: patientId,
            rating_score: rating,
          }),
        });
      } catch (ratingError) {
        // Log warning but continue since review was created successfully
        console.warn('Warning: Could not create rating separately:', ratingError);
      }

      setSuccess('Đánh giá của bạn đã được gửi thành công!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error submitting rating:', err);
      const errorMsg = err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.';
      setError(getUserFriendlyErrorMessage(errorMsg));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            Đánh giá cho {doctorName}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5">✓</div>
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          {/* Rating Stars */}
          <div className="space-y-3">
            <label className="block text-lg font-semibold text-gray-900">
              Đánh giá của bạn <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                  disabled={isLoading}
                >
                  <Star
                    className={`w-12 h-12 transition ${
                      star <= (hoveredRating || rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {rating === 1 && '⭐ Rất không hài lòng'}
              {rating === 2 && '⭐⭐ Không hài lòng'}
              {rating === 3 && '⭐⭐⭐ Bình thường'}
              {rating === 4 && '⭐⭐⭐⭐ Hài lòng'}
              {rating === 5 && '⭐⭐⭐⭐⭐ Rất hài lòng'}
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-900">
              Tiêu đề (tùy chọn)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Bác sĩ rất chuyên nghiệp và lắng nghe tôi"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={255}
              disabled={isLoading}
            />
            <p className={`text-xs ${title.length > 250 ? 'text-orange-600' : 'text-gray-500'}`}>
              {title.length}/255
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-lg font-semibold text-gray-900">
              Nội dung đánh giá <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn với bác sĩ này. Điều gì làm bạn hài lòng hay không hài lòng? (Tối thiểu 10 ký tự)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900"
              rows={5}
              maxLength={2000}
              disabled={isLoading}
              required
            />
            <div className="flex justify-between items-center">
              <p className={`text-xs ${
                content.length < 10 && content.length > 0 ? 'text-red-600 font-medium' : 
                content.length > 1800 ? 'text-orange-600' : 
                'text-gray-500'
              }`}>
                {content.length < 10 && content.length > 0
                  ? `Tối thiểu 10 ký tự (còn ${10 - content.length})`
                  : `${content.length}/2000`}
              </p>
              {content.length > 0 && content.length < 10 && (
                <span className="text-xs text-red-600">Nội dung quá ngắn</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">💡 Lưu ý:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Bạn cần hoàn thành cuộc hẹn khám bệnh để có thể đánh giá</li>
              <li>Đánh giá của bạn sẽ được hiển thị công khai trên hồ sơ bác sĩ</li>
              <li>Vui lòng đánh giá một cách công bằng và xây dựng</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
}
