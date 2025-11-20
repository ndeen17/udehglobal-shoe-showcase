import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { reviewsAPI, Review } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StarRating from './StarRating';

interface ReviewFormProps {
  productId: string;
  productName: string;
  trigger: React.ReactNode;
  existingReview?: Review | null;
  onReviewSubmitted?: () => void;
}

const ReviewForm = ({ productId, productName, trigger, existingReview, onReviewSubmitted }: ReviewFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!existingReview;

  // Initialize form with existing review data
  useEffect(() => {
    if (existingReview) {
      setFormData({
        rating: existingReview.rating,
        title: existingReview.title || '',
        comment: existingReview.comment
      });
    }
  }, [existingReview]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to leave a review',
        variant: 'destructive'
      });
      return;
    }

    if (formData.rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a rating',
        variant: 'destructive'
      });
      return;
    }

    if (formData.comment.trim().length < 10) {
      toast({
        title: 'Comment too short',
        description: 'Please write at least 10 characters',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (isEditing && existingReview) {
        // Update existing review
        await reviewsAPI.updateReview(existingReview._id, {
          rating: formData.rating,
          title: formData.title.trim() || undefined,
          comment: formData.comment.trim()
        });
        
        toast({
          title: 'Review updated',
          description: 'Your review has been updated successfully'
        });
      } else {
        // Create new review
        await reviewsAPI.createReview(productId, {
          rating: formData.rating,
          title: formData.title.trim() || undefined,
          comment: formData.comment.trim()
        });
        
        toast({
          title: 'Review submitted',
          description: 'Thank you for your review!'
        });
      }
      
      // Reset form if creating new
      if (!isEditing) {
        setFormData({ rating: 0, title: '', comment: '' });
      }
      
      setIsOpen(false);
      
      // Notify parent to refresh reviews
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error: any) {
      console.error('Submit review error:', error);
      toast({
        title: 'Failed to submit review',
        description: error.message || 'Please try again later',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (!isAuthenticated) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Sign In Required</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <p className="text-gray-600 mb-4">Please sign in to leave a review for this product.</p>
            <Button asChild>
              <a href="/login">Sign In</a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="brutalist-heading text-sm tracking-wider">
            {isEditing ? 'EDIT YOUR REVIEW' : 'WRITE A REVIEW'}
          </DialogTitle>
          <p className="text-sm text-gray-600">
            {isEditing ? 'Update your review for' : 'Share your experience with'} {productName}
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <Label className="text-sm tracking-wide text-gray-600 mb-3 block">
              Overall Rating *
            </Label>
            <div className="flex items-center space-x-2">
              <StarRating
                rating={formData.rating}
                size="lg"
                interactive
                onRatingChange={handleRatingChange}
              />
              <span className="text-sm text-gray-500">
                {formData.rating > 0 ? `${formData.rating} star${formData.rating !== 1 ? 's' : ''}` : 'Select rating'}
              </span>
            </div>
          </div>

          {/* Review Title */}
          <div>
            <Label htmlFor="title" className="text-sm tracking-wide text-gray-600">
              Review Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Summarize your experience"
              className="mt-2"
              maxLength={100}
            />
          </div>

          {/* Review Comment */}
          <div>
            <Label htmlFor="comment" className="text-sm tracking-wide text-gray-600">
              Your Review *
            </Label>
            <Textarea
              id="comment"
              value={formData.comment}
              onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              placeholder="Tell others about your experience with this product..."
              className="mt-2 min-h-[100px]"
              required
              minLength={10}
              maxLength={1000}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.comment.length}/1000 characters (minimum 10)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              CANCEL
            </Button>
            <Button 
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={isSubmitting || formData.rating === 0 || formData.comment.trim().length < 10}
            >
              {isSubmitting ? (isEditing ? 'UPDATING...' : 'SUBMITTING...') : (isEditing ? 'UPDATE REVIEW' : 'SUBMIT REVIEW')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;