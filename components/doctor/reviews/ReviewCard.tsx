'use client';
import { useState } from "react";
import { CheckCircle, Reply, Star, Loader2, Trash2, Edit2, AlertCircle, MessageCircle } from "lucide-react";
import type { DoctorReview } from "@/types/types";
import { apiClient } from "@/lib/api";

interface ReviewCardProps {
  review: DoctorReview;
  isDoctor?: boolean;
  isAuthor?: boolean;
  onReply?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, review: DoctorReview) => void;
}

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

export const ReviewCard = ({ 
  review, 
  isDoctor = false, 
  isAuthor = false,
  onReply, 
  onDelete,
  onUpdate 
}: ReviewCardProps) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentReview, setCurrentReview] = useState<DoctorReview>(review);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(review.title || "");
  const [editContent, setEditContent] = useState(review.content);
  const [editRating, setEditRating] = useState(review.rating_score);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim() || isSubmitting || replyText.length > 1000) return;

    setError("");
    setIsSubmitting(true);
    try {
      const response = await apiClient(`/api/reviews/${currentReview.review_id}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({ reply: replyText.trim() }),
      });

      if (response?.status && response?.data) {
        setCurrentReview(response.data as DoctorReview);
        setReplyText("");
        setShowReplyBox(false);
        onReply?.(currentReview.review_id, replyText);
      } else {
        setError(response?.message || 'Có lỗi xảy ra khi gửi phản hồi');
      }
    } catch (error) {
      console.error('Error replying to review:', error);
      setError('Không thể gửi phản hồi. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.')) return;
    
    setError("");
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

  const handleEditStart = () => {
    setIsEditMode(true);
    setEditTitle(currentReview.title || "");
    setEditContent(currentReview.content);
    setEditRating(currentReview.rating_score);
    setError("");
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
    setError("");
  };

  const handleEditSave = async () => {
    if (editContent.length < 10 || editContent.length > 2000) {
      setError('Nội dung phải từ 10-2000 ký tự');
      return;
    }

    setError("");
    setIsSavingEdit(true);
    try {
      const response = await apiClient(`/api/reviews/${currentReview.review_id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editTitle.trim() || null,
          content: editContent.trim(),
          rating_score: editRating,
        }),
      });

      if (response?.status && response?.data) {
        const updatedReview = response.data as DoctorReview;
        setCurrentReview(updatedReview);
        setIsEditMode(false);
        onUpdate?.(currentReview.review_id, updatedReview);
      } else {
        setError(response?.message || 'Không thể cập nhật đánh giá');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      setError('Không thể cập nhật đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSavingEdit(false);
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden">
      {/* Main Content Section */}
      <div className="p-6">
        {/* Header Row - Patient Info + Rating */}
        <div className="flex items-start justify-between gap-4 mb-4">
          {/* Left: Avatar + Patient Info */}
          <div className="flex items-start gap-4 flex-1">
            {/* Avatar */}
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
              {review.Patient?.full_name?.charAt(0) || 'B'}
            </div>
            
            {/* Patient Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900">
                {review.Patient?.full_name || 'Bệnh nhân'}
              </h3>
              <p className="text-sm text-gray-600">
                {formatDate(review.created_at)}
              </p>
              {review.is_verified && (
                <span className="inline-flex items-center text-xs font-medium text-green-600 mt-2">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Đã xác thực
                </span>
              )}
            </div>
          </div>

          {/* Right: Stars Rating */}
          <div className="flex gap-0.5 flex-shrink-0">
            {renderStars(review.rating_score)}
          </div>
        </div>

        {/* Edit Mode */}
        {isEditMode ? (
          <div className="space-y-4 mt-4">
            {/* Rating Edit */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">Đánh giá</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-5 w-5 transition ${
                        star <= editRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title Edit */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Tiêu đề (tùy chọn)</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={255}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tiêu đề đánh giá"
              />
              <p className="text-xs text-gray-600 mt-1">{editTitle.length}/255</p>
            </div>

            {/* Content Edit */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Nội dung</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                maxLength={2000}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Nội dung đánh giá (10-2000 ký tự)"
              />
              <p className={`text-xs mt-1 ${
                editContent.length < 10 && editContent.length > 0 ? 'text-red-600 font-medium' : 'text-gray-600'
              }`}>
                {editContent.length < 10 && editContent.length > 0
                  ? `Tối thiểu 10 ký tự (còn ${10 - editContent.length})`
                  : `${editContent.length}/2000`}
              </p>
            </div>

            {/* Edit Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleEditCancel}
                disabled={isSavingEdit}
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleEditSave}
                disabled={isSavingEdit || editContent.length < 10}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isSavingEdit && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSavingEdit ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Title */}
            {currentReview.title && (
              <h4 className="text-base font-semibold text-gray-900 mb-2">{currentReview.title}</h4>
            )}

            {/* Content */}
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
              {currentReview.content}
            </p>

            {/* Action Buttons */}
            {isAuthor && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleEditStart}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                  title="Chỉnh sửa"
                >
                  <Edit2 className="h-4 w-4" />
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition disabled:opacity-50"
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Doctor Reply Section */}
      {currentReview.doctor_reply && (
        <div className="p-6 bg-blue-50 border-t border-blue-200">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              BS
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-blue-900">Phản hồi từ bác sĩ</span>
                {currentReview.reply_at && (
                  <span className="text-xs text-blue-700">
                    {formatDate(currentReview.reply_at)}
                  </span>
                )}
              </div>
              <p className="text-sm text-blue-900 leading-relaxed whitespace-pre-wrap break-words">
                {currentReview.doctor_reply}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reply Form */}
      {showReplyBox && !currentReview.doctor_reply && isDoctor && (
        <div className="p-6 bg-blue-50 border-t border-blue-200">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded flex gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}
          
          <textarea 
            value={replyText} 
            onChange={(e) => setReplyText(e.target.value)} 
            placeholder="Nhập phản hồi (tối đa 1000 ký tự)..." 
            rows={3} 
            maxLength={1000}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 resize-none"
            disabled={isSubmitting}
          />
          
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-gray-700 font-medium">
              {replyText.length}/1000 ký tự
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setShowReplyBox(false);
                  setReplyText("");
                  setError("");
                }} 
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded transition disabled:opacity-50 font-medium"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button 
                onClick={handleReply}
                disabled={isSubmitting || !replyText.trim()}
                className="px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer - Reply Button */}
      {!currentReview.doctor_reply && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
          {isDoctor ? (
            <button 
              onClick={() => setShowReplyBox(!showReplyBox)} 
              className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Phản hồi
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};
