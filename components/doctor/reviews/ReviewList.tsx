import { ReviewCard } from "./ReviewCard";

export const ReviewList = ({ reviews, onReply }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900">
        Tất cả đánh giá ({reviews.length})
      </h2>
    </div>
    {reviews.length > 0 ? (
      reviews.map(review => (
        <ReviewCard key={review.id} review={review} onReply={onReply} />
      ))
    ) : (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">Không tìm thấy đánh giá nào phù hợp.</p>
      </div>
    )}
  </div>
);