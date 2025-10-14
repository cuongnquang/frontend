import { Star } from "lucide-react";

export const StarRating = ({ rating, size = "h-5 w-5", showNumber = false }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`${size} ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
        fill={i < Math.floor(rating) ? 'currentColor' : 'none'}
      />
    ))}
    {showNumber && <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>}
  </div>
);