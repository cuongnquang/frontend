'use client';
import { useState } from "react";
import { CheckCircle, ThumbsUp, Reply } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";

export const ReviewCard = ({ review, onReply }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(review.id, replyText);
      setReplyText("");
      setShowReplyBox(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <img className="h-12 w-12 rounded-full ring-2 ring-gray-100" src={review.avatar} alt={review.patient_name} />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{review.patient_name}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-xs text-gray-500">{review.date}</p>
              {review.verified && (
                <span className="inline-flex items-center text-xs font-medium text-green-600">
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Đã xác thực
                </span>
              )}
            </div>
          </div>
        </div>
        <StarRating rating={review.rating} />
      </div>
      
      <p className="text-sm text-gray-700 leading-relaxed mb-4">{review.comment}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button className="flex items-center text-sm text-gray-600 hover:text-gray-900"><ThumbsUp className="h-4 w-4 mr-1.5" />Hữu ích ({review.helpful})</button>
        {!review.response && (
          <button onClick={() => setShowReplyBox(!showReplyBox)} className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"><Reply className="h-4 w-4 mr-1.5" />Phản hồi</button>
        )}
      </div>

      {showReplyBox && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Nhập phản hồi của bạn..." rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          <div className="flex justify-end space-x-2 mt-2">
            <button onClick={() => setShowReplyBox(false)} className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-lg">Hủy</button>
            <button onClick={handleReply} className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg">Gửi phản hồi</button>
          </div>
        </div>
      )}

      {review.response && (
        <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0"><div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center"><span className="text-white text-xs font-semibold">BS</span></div></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-1">Phản hồi từ bác sĩ</p>
              <p className="text-sm text-gray-700">{review.response.text}</p>
              <p className="text-xs text-gray-500 mt-2">{review.response.date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};