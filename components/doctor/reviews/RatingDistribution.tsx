import { Star } from "lucide-react";

export const RatingDistribution = ({ distribution }) => (
  <div className="bg-white p-6 rounded-lg border border-gray-200">
    <h2 className="text-lg font-semibold text-gray-900 mb-4">Phân bố đánh giá</h2>
    <div className="space-y-3">
      {distribution.map(item => (
        <div key={item.stars} className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 w-20">
            <span className="text-sm font-medium text-gray-700">{item.stars}</span>
            <Star className="h-4 w-4 text-yellow-400" fill="currentColor" />
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-yellow-400 h-2.5 rounded-full transition-all" 
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm text-gray-600 w-16 text-right">{item.count} ({item.percentage}%)</span>
        </div>
      ))}
    </div>
  </div>
);