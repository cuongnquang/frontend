import { Star, CheckCircle, TrendingUp, MessageSquare } from "lucide-react";

export const ReviewStats = ({ averageRating, totalReviews }) => {
  // Safely handle undefined averageRating
  const safeAverage = averageRating || 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Average Rating */}
      <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between mb-3">
          <Star className="h-6 w-6" fill="currentColor" />
          <TrendingUp className="h-5 w-5 opacity-75" />
        </div>
        <p className="text-sm opacity-90 font-medium">Đánh giá trung bình</p>
        <p className="text-3xl font-bold mt-2">{safeAverage.toFixed(1)}</p>
        <p className="text-xs opacity-75 mt-1">trên 5.0</p>
      </div>

      {/* Total Reviews */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <MessageSquare className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-sm text-gray-700 font-medium">Tổng đánh giá</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{totalReviews}</p>
        <p className="text-xs text-gray-600 mt-1">từ bệnh nhân</p>
      </div>

      {/* Verified Reviews */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <p className="text-sm text-gray-700 font-medium">Đã xác thực</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{totalReviews}</p>
        <p className="text-xs text-gray-600 mt-1">tất cả đánh giá</p>
      </div>
    </div>
  );
};