import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 5, size = 'sm', reviewsCount = null }) => {
  const iconSize = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 text-gold">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= fullStars
                ? 'fill-gold text-gold'
                : star === fullStars + 1 && hasHalfStar
                ? 'fill-gold/60 text-gold'
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-luxury-text ml-0.5">
        {rating?.toFixed(1) || '5.0'}
      </span>
      {reviewsCount !== null && (
        <span className="text-xs text-luxury-muted">
          ({reviewsCount})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
