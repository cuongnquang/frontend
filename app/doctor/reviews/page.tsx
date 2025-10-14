'use client';
import { useState } from "react";
import { reviews, averageRating, totalReviews, ratingDistribution } from "../data";
import { ReviewsPageHeader } from "@/components/doctor/reviews/ReviewsPageHeader";
import { ReviewStats } from "@/components/doctor/reviews/ReviewStats";
import { RatingDistribution } from "@/components/doctor/reviews/RatingDistribution";
import { ReviewToolbar } from "@/components/doctor/reviews/ReviewToolbar";
import { ReviewList } from "@/components/doctor/reviews/ReviewList";

export default function ReviewsPage() {
  const [filterRating, setFilterRating] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredReviews = reviews.filter(review => {
    const matchesRating = filterRating === "all" || review.rating === parseInt(filterRating);
    const matchesSearch = review.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          review.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const handleReply = (reviewId, text) => {
    console.log(`Replying to review ${reviewId} with: "${text}"`);
    // Thêm logic cập nhật trạng thái hoặc gọi API ở đây
  };

  return (
    <div className="space-y-6 p-6">
      <ReviewsPageHeader />
      
      <ReviewStats 
        averageRating={averageRating} 
        totalReviews={totalReviews} 
      />
      
      <RatingDistribution distribution={ratingDistribution} />
      
      <ReviewToolbar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterRating={filterRating}
        onFilterChange={setFilterRating}
      />
      
      <ReviewList 
        reviews={filteredReviews} 
        onReply={handleReply} 
      />
    </div>
  );
}