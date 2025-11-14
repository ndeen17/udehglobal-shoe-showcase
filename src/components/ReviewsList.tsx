import React, { useState } from 'react';
import { ThumbsUp, User, ShieldCheck } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

interface ReviewsListProps {
  productId: number;
  productName: string;
}

const ReviewsList = ({ productId, productName }: ReviewsListProps) => {
  const { getProductReviews, getAverageRating, getRatingCounts, markReviewHelpful } = useApp();
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  
  const allReviews = getProductReviews(productId);
  const averageRating = getAverageRating(productId);
  const ratingCounts = getRatingCounts(productId);
  const totalReviews = allReviews.length;

  // Filter and sort reviews
  let filteredReviews = allReviews;
  
  if (filterRating !== 'all') {
    filteredReviews = allReviews.filter(review => review.rating === parseInt(filterRating));
  }
  
  switch (sortBy) {
    case 'oldest':
      filteredReviews = [...filteredReviews].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      break;
    case 'rating-high':
      filteredReviews = [...filteredReviews].sort((a, b) => b.rating - a.rating);
      break;
    case 'rating-low':
      filteredReviews = [...filteredReviews].sort((a, b) => a.rating - b.rating);
      break;
    case 'helpful':
      filteredReviews = [...filteredReviews].sort((a, b) => b.helpful - a.helpful);
      break;
    default: // newest
      filteredReviews = [...filteredReviews].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
              <span className="text-4xl font-bold">
                {averageRating > 0 ? averageRating.toFixed(1) : '0.0'}
              </span>
              <div>
                <StarRating rating={averageRating} size="lg" />
                <p className="text-sm text-gray-600 mt-1">
                  Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            
            <ReviewForm 
              productId={productId} 
              productName={productName}
              trigger={
                <Button className="bg-black text-white hover:bg-gray-800">
                  WRITE A REVIEW
                </Button>
              }
            />
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingCounts[rating];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{rating}</span>
                  <StarRating rating={1} maxRating={1} size="sm" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      {totalReviews > 0 && (
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h3 className="brutalist-heading text-sm tracking-wider">
            CUSTOMER REVIEWS ({filteredReviews.length})
          </h3>
          
          <div className="flex gap-4">
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="rating-high">Highest Rated</SelectItem>
                <SelectItem value="rating-low">Lowest Rated</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 border border-gray-200">
            <p className="text-gray-600 mb-4">
              {totalReviews === 0 
                ? 'No reviews yet. Be the first to review this product!' 
                : 'No reviews match your current filters.'}
            </p>
            {totalReviews === 0 && (
              <ReviewForm 
                productId={productId} 
                productName={productName}
                trigger={
                  <Button variant="outline">
                    WRITE FIRST REVIEW
                  </Button>
                }
              />
            )}
          </div>
        ) : (
          filteredReviews.map(review => (
            <div key={review.id} className="border border-gray-200 p-6 space-y-4">
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {review.userAvatar ? (
                    <img 
                      src={review.userAvatar} 
                      alt={review.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{review.userName}</span>
                      {review.verified && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <ShieldCheck className="w-3 h-3" />
                          <span className="text-xs">Verified Purchase</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <StarRating rating={review.rating} size="sm" />
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                {review.title && (
                  <h4 className="font-medium text-sm">{review.title}</h4>
                )}
                <p className="text-sm text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <button 
                  onClick={() => markReviewHelpful(review.id)}
                  className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsList;