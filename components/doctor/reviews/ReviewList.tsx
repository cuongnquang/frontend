'use client';
import { useState, useCallback } from 'react';
import { ReviewCard } from './ReviewCard';
import type { DoctorReview } from '@/types/types';
import { Star, Search, Filter } from 'lucide-react';

interface ReviewListProps {
  reviews: DoctorReview[];
  isLoading?: boolean;
  isDoctor?: boolean;
  currentUserId?: string;
  onReply?: (id: string, text: string) => void;
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
  onRefresh?: () => void;
}

export const ReviewList = ({ 
  reviews, 
  isLoading = false,
  isDoctor = false,
  currentUserId,
  onReply, 
  onDelete,
  onUpdate,
  onRefresh
}: ReviewListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'helpful'>('newest');
  const [filteredReviews, setFilteredReviews] = useState(reviews);

  // Filter and sort reviews
  const getFilteredReviews = useCallback(() => {
    let result = [...reviews];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.content.toLowerCase().includes(term) ||
        r.title?.toLowerCase().includes(term) ||
        r.Patient?.full_name?.toLowerCase().includes(term)
      );
    }

    // Filter by rating
    if (selectedRating !== 'all') {
      result = result.filter(r => r.rating_score === selectedRating);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'helpful':
          return b.helpful_count - a.helpful_count;
        default:
          return 0;
      }
    });

    return result;
  }, [reviews, searchTerm, selectedRating, sortBy]);

  // Update filtered reviews when dependencies change
  const filtered = getFilteredReviews();

  const handleDelete = (reviewId: string) => {
    onDelete?.(reviewId);
  };

  const ratingLabels: Record<number, string> = {
    5: 'Rất hài lòng',
    4: 'Hài lòng',
    3: 'Bình thường',
    2: 'Không hài lòng',
    1: 'Rất không hài lòng'
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-40 mb-4" />
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-5/6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600 font-medium mb-1">Chưa có đánh giá nào</p>
        <p className="text-gray-500 text-sm">
          {isDoctor 
            ? 'Bệnh nhân sẽ bắt đầu đánh giá khi hoàn thành cuộc hẹn'
            : 'Hãy hoàn thành cuộc hẹn khám bệnh để có thể đánh giá'}
        </p>
      </div>
    );
  }

  // No results after filtering
  if (filtered.length === 0) {
    return (
      <div className="space-y-4">
        <ReviewFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedRating={selectedRating}
          onRatingChange={setSelectedRating}
          sortBy={sortBy}
          onSortChange={setSortBy}
          reviewCount={reviews.length}
        />
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">Không tìm thấy đánh giá</p>
          <p className="text-gray-500 text-sm">Hãy thử thay đổi bộ lọc tìm kiếm</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ReviewFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRating={selectedRating}
        onRatingChange={setSelectedRating}
        sortBy={sortBy}
        onSortChange={setSortBy}
        reviewCount={reviews.length}
        filteredCount={filtered.length}
      />

      <div className="space-y-4">
        {filtered.map(review => (
          <ReviewCard
            key={review.review_id}
            review={review}
            isDoctor={isDoctor}
            isAuthor={!isDoctor && currentUserId === review.patient_id}
            onReply={onReply}
            onDelete={handleDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

interface ReviewFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedRating: number | 'all';
  onRatingChange: (rating: number | 'all') => void;
  sortBy: 'newest' | 'oldest' | 'helpful';
  onSortChange: (sort: 'newest' | 'oldest' | 'helpful') => void;
  reviewCount: number;
  filteredCount?: number;
}

const ReviewFilters = ({
  searchTerm,
  onSearchChange,
  selectedRating,
  onRatingChange,
  sortBy,
  onSortChange,
  reviewCount,
  filteredCount
}: ReviewFiltersProps) => {
  const ratingLabels: Record<number, string> = {
    5: 'Rất hài lòng (5⭐)',
    4: 'Hài lòng (4⭐)',
    3: 'Bình thường (3⭐)',
    2: 'Không hài lòng (2⭐)',
    1: 'Rất không hài lòng (1⭐)'
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900">
          Tất cả đánh giá {filteredCount ? `(${filteredCount}/${reviewCount})` : `(${reviewCount})`}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Rating Filter */}
        <select
          value={selectedRating}
          onChange={(e) => onRatingChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as number)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tất cả đánh giá</option>
          {[5, 4, 3, 2, 1].map(rating => (
            <option key={rating} value={rating}>
              {ratingLabels[rating]}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'newest' | 'oldest' | 'helpful')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="helpful">Hữu ích nhất</option>
        </select>
      </div>
    </div>
  );
};
