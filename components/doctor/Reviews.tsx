import React, { useState } from 'react'
import { Review } from '@/types'
import { Star, Verified, ChevronDown, ChevronUp, User } from 'lucide-react'

interface TabContentReviewsProps {
    doctorRating: number;
    totalReviews: number;
    reviews: Review[];
}

// Sub-component: ReviewCard
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">{review.patient.full_name}</h4>
                    <p className="text-sm text-gray-500">{review.date}</p>
                </div>
                {review.verified && (
                    <Verified className="w-4 h-4 text-blue-500 ml-2" />
                )}
            </div>
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
            </div>
        </div>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
    </div>
)

// Sub-component: ReviewForm
const ReviewForm: React.FC = () => {
    const [selectedRating, setSelectedRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)

    return (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Viết đánh giá của bạn</h4>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá tổng thể</label>
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                className={`transition-colors ${rating <= (hoverRating || selectedRating)
                                    ? 'text-yellow-400'
                                    : 'text-gray-300 hover:text-yellow-200'
                                    }`}
                                onClick={() => setSelectedRating(rating)}
                                onMouseEnter={() => setHoverRating(rating)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                <Star className="w-8 h-8 fill-current" />
                            </button>
                        ))}
                        {selectedRating > 0 && (
                            <span className="ml-2 text-sm text-gray-600">
                                ({selectedRating} sao)
                            </span>
                        )}
                    </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Input Họ tên/Email... */}
                    <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Nhập họ tên của bạn" />
                    <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="email@example.com" />
                </div>
                <div>
                    <textarea className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Hãy chia sẻ về trải nghiệm khám bệnh..."></textarea>
                </div>
                <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
                    Gửi đánh giá
                </button>
            </form>
        </div>
    )
}


export const TabContentReviews: React.FC<TabContentReviewsProps> = ({ doctorRating, totalReviews, reviews }) => {
    const [showAllReviews, setShowAllReviews] = useState(false)

    return (
        <div className="space-y-8">
            {/* Header và Thống kê */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Đánh giá từ bệnh nhân</h3>
                    <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                        <span className="font-semibold text-lg">{doctorRating}</span>
                        <span className="text-gray-500 ml-1">({totalReviews} đánh giá)</span>
                    </div>
                </div>

                {/* Phân bố đánh giá (Hardcoded theo code gốc) */}
                <div className="mt-4 md:mt-0">
                    <div className="space-y-2 text-sm">
                        {[5, 4, 3, 2, 1].map((star) => (
                            <div key={star} className="flex items-center">
                                <span className="w-3 text-gray-600">{star}</span>
                                <Star className="w-3 h-3 text-yellow-400 fill-current mx-1" />
                                <div className="w-20 h-2 bg-gray-200 rounded-full mx-2">
                                    <div
                                        className="h-2 bg-yellow-400 rounded-full"
                                        style={{ width: `${star === 5 ? 85 : star === 4 ? 10 : star === 3 ? 3 : star === 2 ? 1 : 1}%` }}
                                    ></div>
                                </div>
                                <span className="text-gray-500 text-xs w-8">{star === 5 ? '85%' : star === 4 ? '10%' : '3%'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form viết đánh giá */}
            <ReviewForm />

            {/* Danh sách đánh giá hiện có */}
            <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Các đánh giá gần đây</h4>
                <div className="space-y-4">
                    {reviews.slice(0, showAllReviews ? reviews.length : 3).map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
                {reviews.length > 3 && (
                    <button
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="flex items-center mx-auto mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        {showAllReviews ? (
                            <>Ẩn bớt <ChevronUp className="w-4 h-4 ml-1" /></>
                        ) : (
                            <>Xem thêm đánh giá <ChevronDown className="w-4 h-4 ml-1" /></>
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}