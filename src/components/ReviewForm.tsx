import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import StarRating from './StarRating';

interface ReviewFormProps {
  productId: number;
  productName: string;
  trigger: React.ReactNode;
}

const ReviewForm = ({ productId, productName, trigger }: ReviewFormProps) => {
  const { user, isAuthenticated } = useAuth();
  const { addReview } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    title: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      alert('Please sign in to leave a review');
      return;
    }

    if (formData.rating === 0) {
      alert('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addReview({
        productId,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
        verified: true // Mock verification
      });
      
      // Reset form
      setFormData({ rating: 0, title: '', comment: '' });
      setIsOpen(false);
    } catch (error) {
      alert('Failed to submit review. Please try again.');
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
            WRITE A REVIEW
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Share your experience with {productName}
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
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.comment.length}/500 characters
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
              disabled={isSubmitting || formData.rating === 0}
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;