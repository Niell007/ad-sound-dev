import { Metadata } from 'next';
import { ReviewGrid } from '@/components/reviews/ReviewGrid';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { getReviews, getAverageRating, getRatingDistribution } from '@/lib/supabase/reviews';
import { Star } from 'lucide-react';
import { Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Customer Reviews | soundmaster',
  description: 'Read what our customers have to say about our DJ services and share your own experience.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function ReviewsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-8">Customer Reviews</h1>
      <Suspense fallback={
        <Card className="w-full p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading reviews...</span>
          </div>
        </Card>
      }>
        <ReviewGrid />
      </Suspense>
    </div>
  );
} 