import { getFeaturedReviews, getAverageRating } from '@/lib/supabase/reviews';
import { ReviewCard } from './ReviewCard';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import Link from 'next/link';

export async function FeaturedReviews() {
  // Fetch featured reviews
  const reviews = await getFeaturedReviews(3);
  
  // Get average rating
  const averageRating = await getAverageRating();
  
  // If no featured reviews, don't show the section
  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-6 w-6 ${
                    i < Math.round(averageRating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-xl font-semibold">{averageRating.toFixed(1)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} showReactions={false} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/reviews" passHref>
            <Button size="lg" variant="outline">
              View All Reviews
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
} 