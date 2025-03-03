"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Define form schema with Zod
const reviewSchema = z.object({
  author_name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  rating: z.number().min(1, { message: 'Please select a rating' }).max(5),
  content: z.string().min(10, { message: 'Review must be at least 10 characters' }),
  event_type: z.string().optional(),
  event_date: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface Review {
  id: string;
  author_name: string;
  rating: number;
  content: string;
  event_type?: string;
  event_date?: string;
  status: string;
}

// Local toast implementation
const useLocalToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; title: string; description: string; variant?: 'default' | 'destructive' }>>([]);
  
  const showToast = ({ title, description, variant = 'default' }: { title: string; description: string; variant?: 'default' | 'destructive' }) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, variant };
    
    setToasts(prev => [...prev, newToast]);
    
    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };
  
  return {
    toast: showToast,
    toasts,
    dismissToast: (id: string) => setToasts(prev => prev.filter(toast => toast.id !== id))
  };
};

export default function EditReviewPage({ params }: { params: { id: string } }) {
  const { toast, toasts, dismissToast } = useLocalToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState<Review | null>(null);

  // Initialize form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author_name: '',
      rating: 0,
      content: '',
      event_type: '',
      event_date: '',
    },
  });

  // Fetch review data
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch(`/api/reviews/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch review');
        }
        
        const data = await response.json();
        setReview(data);
        
        // Set form values
        form.reset({
          author_name: data.author_name,
          rating: data.rating,
          content: data.content,
          event_type: data.event_type || '',
          event_date: data.event_date || '',
        });
      } catch (error) {
        console.error('Error fetching review:', error);
        toast({
          title: 'Error',
          description: 'Failed to load review data. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [params.id, form, toast]);

  const onSubmit = async (data: ReviewFormValues) => {
    if (!review) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/reviews/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update review');
      }

      toast({
        title: 'Review Updated',
        description: 'Your review has been updated successfully.',
      });

      // Redirect back to reviews list
      router.push('/dashboard/reviews');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Star rating component
  const StarRating = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              star <= (hoverRating || value) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if review not found or already approved
  if (!review) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Review Not Found</CardTitle>
            <CardDescription>
              The review you're trying to edit could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/reviews')}>
              Back to Reviews
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (review.status === 'approved') {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Cannot Edit Approved Review</CardTitle>
            <CardDescription>
              This review has already been approved and cannot be edited.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard/reviews')}>
              Back to Reviews
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Review</CardTitle>
          <CardDescription>
            Update your review and feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="author_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <StarRating
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="event_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Wedding, Party, Corporate Event, etc." {...field} />
                    </FormControl>
                    <FormDescription>
                      What type of event did we provide services for?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date (Optional)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your experience..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/dashboard/reviews')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Review'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Toast display */}
      <div className="fixed bottom-0 right-0 z-50 flex flex-col p-4 gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-md transform transition-all duration-300 ease-in-out ${
              toast.variant === "destructive" ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
            }`}
            onClick={() => dismissToast(toast.id)}
          >
            {toast.title && <h3 className="font-medium">{toast.title}</h3>}
            {toast.description && <p className="text-sm text-gray-500 dark:text-gray-400">{toast.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
} 