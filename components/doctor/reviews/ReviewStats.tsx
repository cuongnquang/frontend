import { Star, CheckCircle, TrendingUp, MessageSquare, ThumbsUp } from "lucide-react";

export const ReviewStats = ({ averageRating, totalReviews }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg text-white">
      <div className="flex items-center justify-between mb-2"><Star className="h-8 w-8" fill="currentColor" /><TrendingUp className="h-5 w-5" /></div>
      <p className="text-sm opacity-90">Đánh giá trung bình</p>
      <p className="text-4xl font-bold mt-1">{averageRating.toFixed(1)}</p>
      <p className="text-sm opacity-75 mt-1">trên 5.0</p>
    </div>
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2"><MessageSquare className="h-8 w-8 text-green-600" /></div>
      <p className="text-sm text-gray-600">Tổng đánh giá</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{totalReviews}</p>
      <p className="text-sm text-green-600 mt-1">+12 tuần này</p>
    </div>
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2"><CheckCircle className="h-8 w-8 text-purple-600" /></div>
      <p className="text-sm text-gray-600">Đã phản hồi</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">85%</p>
      <p className="text-sm text-gray-500 mt-1">134/158 đánh giá</p>
    </div>
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2"><ThumbsUp className="h-8 w-8 text-yellow-600" /></div>
      <p className="text-sm text-gray-600">Đánh giá 5 sao</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">76%</p>
      <p className="text-sm text-gray-500 mt-1">120 đánh giá</p>
    </div>
  </div>
);