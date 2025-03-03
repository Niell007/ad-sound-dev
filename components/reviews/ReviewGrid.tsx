"use client";

import { useState, useEffect } from 'react';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { getReviews } from "@/lib/supabase/reviews";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

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

interface ReviewGridProps {
  initialReviews?: Review[];
  showLoadMore?: boolean;
  limit?: number;
  featuredOnly?: boolean;
  className?: string;
}

export function ReviewGrid({
  initialReviews,
  showLoadMore = true,
  limit = 6,
  featuredOnly = false,
  className = '',
}: ReviewGridProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [loading, setLoading] = useState(!initialReviews);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialReviews?.length || 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialReviews) {
      fetchReviews();
    }
  }, [initialReviews, featuredOnly]);

  const fetchReviews = async (loadMore = false) => {
    const loadingState = loadMore ? setLoadingMore : setLoading;
    loadingState(true);

    try {
      const currentOffset = loadMore ? offset : 0;
      let url = `/api/reviews?status=approved&limit=${limit}&offset=${currentOffset}`;
      
      if (featuredOnly) {
        url += '&featured=true';
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      
      if (loadMore) {
        setReviews(prev => [...prev, ...data]);
        setOffset(prev => prev + data.length);
      } else {
        setReviews(data);
        setOffset(data.length);
      }
      
      // If we got fewer reviews than requested, there are no more to load
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews. Please try again later.",
        variant: "destructive",
      });
    } finally {
      loadingState(false);
    }
  };

  const handleLoadMore = () => {
    fetchReviews(true);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="w-full">
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // No reviews found
  if (reviews.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No reviews available yet. Be the first to leave a review!
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <h3 className="text-lg font-semibold">Temporarily Unavailable</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      
      {showLoadMore && hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
          >
            {loadingMore ? 'Loading...' : 'Load More Reviews'}
          </Button>
        </div>
      )}
    </div>
  );
} 