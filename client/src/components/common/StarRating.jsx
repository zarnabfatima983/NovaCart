import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../utils/helpers';

const StarRating = ({ rating = 0, max = 5, size = 16, showNumber = false, count = null, className = '' }) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }, (_, i) => {
          const filled = i + 1 <= rating;
          const half = !filled && i + 0.5 <= rating;
          return (
            <span key={i} className="relative inline-flex">
              <Star size={size} className="text-dark-200 dark:text-dark-600" fill="currentColor" />
              {(filled || half) && (
                <span
                  className="absolute inset-0 overflow-hidden text-amber-400"
                  style={{ width: half ? '50%' : '100%' }}
                >
                  <Star size={size} fill="currentColor" />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-medium text-dark-600 dark:text-dark-400 ml-1">
          {Number(rating).toFixed(1)}
          {count !== null && (
            <span className="text-dark-400 dark:text-dark-500 font-normal">
              {' '}({Number(count).toLocaleString()})
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export const InteractiveStarRating = ({ value = 0, onChange, size = 24 }) => {
  const [hovered, setHovered] = useState(null);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="focus:outline-none transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={star <= (hovered ?? value) ? 'text-amber-400' : 'text-dark-200 dark:text-dark-600'}
            fill="currentColor"
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
