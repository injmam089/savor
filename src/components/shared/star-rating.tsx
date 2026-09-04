import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function StarRating({ rating, maxRating = 5, size = 'sm', showValue = false, className }: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const iconClass = cn(sizeClasses[size], 'text-yellow-500 fill-yellow-500');
  const emptyIconClass = cn(sizeClasses[size], 'text-muted-foreground/30');

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className={iconClass} />
        ))}
        {hasHalfStar && <StarHalf className={iconClass} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className={emptyIconClass} />
        ))}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
