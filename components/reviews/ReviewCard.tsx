"use client";

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface Review {
  id: string;
  author_name: string;
  content: string;
  rating: number;
  created_at: string;
  updated_at?: string | null;
  is_featured?: boolean;
  response?: string | null;
  response_date?: string | null;
}

interface ReviewCardProps {
  review: Review;
  showReactions?: boolean;
  className?: string;
}

export function ReviewCard({ review, showReactions = true, className = '' }: ReviewCardProps) {
  const { toast } = useToast();
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [notHelpfulCount, setNotHelpfulCount] = useState(0);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch reactions when component mounts
  useEffect(() => {
    if (showReactions) {
      fetchReactions();
    }
  }, [review.id, showReactions]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/reviews/reactions?reviewId=${review.id}`);
      if (!response.ok) throw new Error('Failed to fetch reactions');
      
      const data = await response.json();
      setHelpfulCount(data.counts.helpful);
      setNotHelpfulCount(data.counts.not_helpful);
      
      // Check if user has already reacted
      // This is a simplified approach - in a real app, you'd store the reaction ID
      // and check against the user's session or IP
      const userReactionCookie = localStorage.getItem(`review-reaction-${review.id}`);
      if (userReactionCookie) {
        setUserReaction(userReactionCookie);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    }
  };

  const handleReaction = async (reactionType: 'helpful' | 'not_helpful') => {
    if (isLoading || userReaction) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/reviews/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review_id: review.id,
          reaction_type: reactionType,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add reaction');
      }
      
      // Update local state
      if (reactionType === 'helpful') {
        setHelpfulCount(prev => prev + 1);
      } else {
        setNotHelpfulCount(prev => prev + 1);
      }
      
      setUserReaction(reactionType);
      localStorage.setItem(`review-reaction-${review.id}`, reactionType);
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your reaction has been recorded.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render stars based on rating
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
      />
    ));
  };

  // Format date
  const formattedDate = review.created_at 
    ? formatDistanceToNow(new Date(review.created_at), { addSuffix: true })
    : '';

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{review.author_name}</h3>
            <div className="flex items-center space-x-1 mt-1">
              {renderStars()}
              <span className="ml-2 text-sm text-gray-500">{formattedDate}</span>
            </div>
          </div>
          {review.is_featured && (
            <Badge variant="secondary" className="ml-2">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{review.content}</p>
        
        {review.response && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-semibold">Response:</p>
            <p className="text-sm text-gray-600 mt-1">{review.response}</p>
          </div>
        )}
      </CardContent>
      
      {showReactions && (
        <CardFooter className="pt-0 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Was this review helpful?
          </div>
          <div className="flex space-x-2">
            <Button
              variant={userReaction === 'helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('helpful')}
              disabled={isLoading || !!userReaction}
              className="flex items-center space-x-1"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{helpfulCount}</span>
            </Button>
            <Button
              variant={userReaction === 'not_helpful' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleReaction('not_helpful')}
              disabled={isLoading || !!userReaction}
              className="flex items-center space-x-1"
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              <span>{notHelpfulCount}</span>
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 