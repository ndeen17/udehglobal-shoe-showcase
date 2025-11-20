import React, { useState, useEffect } from 'react';
import { ThumbsUp, User, ShieldCheck, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsAPI, Review } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import StarRating from './StarRating';
import ReviewForm from './ReviewForm';

interface ReviewsListProps {
  productId: string;
  productName: string;
}

const ReviewsList = ({ productId, productName }: ReviewsListProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating-high' | 'rating-low' | 'helpful'>('newest');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });


  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params: any = {
        sort: sortBy,
        limit: 50
      };

      if (filterRating !== 'all') {
        params.rating = parseInt(filterRating);
      }

      const response = await reviewsAPI.getProductReviews(productId, params);
      setReviews(response.reviews);
      setSummary({
        averageRating: response.summary.averageRating,
        totalReviews: response.summary.totalReviews,
        ratingDistribution: {
          1: response.summary.ratingDistribution[1] || 0,
          2: response.summary.ratingDistribution[2] || 0,
          3: response.summary.ratingDistribution[3] || 0,
          4: response.summary.ratingDistribution[4] || 0,
          5: response.summary.ratingDistribution[5] || 0
        }
      });
    } catch (error: any) {
      console.error('Fetch reviews error:', error);
      toast({
        title: 'Failed to load reviews',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's review
  const fetchUserReview = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await reviewsAPI.getUserProductReview(productId);
      setUserReview(response.review);
      setHasPurchased(response.hasPurchased);
    } catch (error: any) {
      console.error('Fetch user review error:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, filterRating]);

  useEffect(() => {
    fetchUserReview();
  }, [productId, isAuthenticated]);

  // Handle helpful vote
  const handleHelpful = async (reviewId: string) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to mark reviews as helpful',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await reviewsAPI.markReviewHelpful(reviewId);
      
      // Update the review in the list
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId
            ? {
                ...review,
                helpful: response.helpful,
                helpfulBy: response.hasMarked
                  ? [...review.helpfulBy, user?.id || '']
                  : review.helpfulBy.filter(id => id !== user?.id)
              }
            : review
        )
      );

      toast({
        title: response.hasMarked ? 'Marked as helpful' : 'Removed from helpful',
        description: response.hasMarked ? 'Thank you for your feedback' : 'Your feedback has been removed'
      });
    } catch (error: any) {
      toast({
        title: 'Failed to update helpful status',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    }
  };

  // Handle delete review
  const handleDelete = async (reviewId: string) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      
      toast({
        title: 'Review deleted',
        description: 'Your review has been deleted successfully'
      });

      // Refresh reviews
      fetchReviews();
      fetchUserReview();
    } catch (error: any) {
      toast({
        title: 'Failed to delete review',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    }
  };

  // Handle review submitted/updated
  const handleReviewSubmitted = () => {
    fetchReviews();
    fetchUserReview();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const ratingCounts = summary.ratingDistribution;
  const totalReviews = summary.totalReviews;
  const averageRating = summary.averageRating;

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


            {!isAuthenticated ? (
              <Button className="bg-black text-white hover:bg-gray-800" asChild>
                <a href="/login">SIGN IN TO REVIEW</a>
              </Button>
            ) : userReview ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">You have already reviewed this product</p>
                <ReviewForm
                  productId={productId}
                  productName={productName}
                  existingReview={userReview}
                  onReviewSubmitted={handleReviewSubmitted}
                  trigger={
                    <Button variant="outline" size="sm">
                      <Pencil className="w-4 h-4 mr-2" />
                      EDIT YOUR REVIEW
                    </Button>
                  }
                />
              </div>
            ) : (
              <div>
                {!hasPurchased && (
                  <p className="text-xs text-amber-600 mb-2">
                    Purchase this product to leave a verified review
                  </p>
                )}
                <ReviewForm
                  productId={productId}
                  productName={productName}
                  onReviewSubmitted={handleReviewSubmitted}
                  trigger={
                    <Button className="bg-black text-white hover:bg-gray-800">
                      WRITE A REVIEW
                    </Button>
                  }
                />
              </div>
            )}
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingCounts[rating as keyof typeof ratingCounts] || 0;
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
            CUSTOMER REVIEWS ({reviews.length})
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

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
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
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" />
            <p className="text-gray-600 mt-4">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 border border-gray-200">
            <p className="text-gray-600 mb-4">
              {totalReviews === 0
                ? 'No reviews yet. Be the first to review this product!'
                : 'No reviews match your current filters.'}
            </p>
            {totalReviews === 0 && !userReview && isAuthenticated && (
              <ReviewForm
                productId={productId}
                productName={productName}
                onReviewSubmitted={handleReviewSubmitted}
                trigger={
                  <Button variant="outline">WRITE FIRST REVIEW</Button>
                }
              />
            )}
          </div>
        ) : (
          reviews.map(review => {
            const isOwnReview = user?.id === review.user._id;
            const hasMarkedHelpful = review.helpfulBy.includes(user?.id || '');

            return (
              <div key={review._id} className="border border-gray-200 p-6 space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {review.user.firstName} {review.user.lastName}
                        </span>
                        {review.verifiedPurchase && (
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

                  {/* Edit/Delete for own review */}
                  {isOwnReview && (
                    <div className="flex items-center space-x-2">
                      <ReviewForm
                        productId={productId}
                        productName={productName}
                        existingReview={review}
                        onReviewSubmitted={handleReviewSubmitted}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        }
                      />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Review</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete your review? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(review._id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
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
                    onClick={() => handleHelpful(review._id)}
                    disabled={!isAuthenticated}
                    className={`flex items-center space-x-2 text-sm transition-colors ${
                      hasMarkedHelpful
                        ? 'text-blue-600 hover:text-blue-700'
                        : 'text-gray-600 hover:text-gray-800'
                    } ${!isAuthenticated ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${hasMarkedHelpful ? 'fill-current' : ''}`} />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewsList;