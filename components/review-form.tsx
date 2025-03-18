"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Review } from "@/lib/types/reviews";

export const reviewSchema = z.object({
  author_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  rating: z.number().min(1, { message: "Please select a rating" }).max(5),
  content: z
    .string()
    .min(10, { message: "Review must be at least 10 characters" }),
  event_type: z.string().optional(),
  event_date: z.string().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  initialData?: Review;
  onSubmit: (data: ReviewFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ReviewForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: ReviewFormProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialData || {
      author_name: "",
      rating: 0,
      content: "",
      event_type: "",
      event_date: "",
    },
  });

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (value: number) => void;
  }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-6 w-6 cursor-pointer ${
              star <= (hoverRating || value)
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => onChange(star)}
          />
        ))}
      </div>
    );
  };

  return (
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
                <StarRating value={field.value} onChange={field.onChange} />
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
                <Input
                  placeholder="Wedding, Party, Corporate Event, etc."
                  {...field}
                />
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
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : initialData ? (
              "Update Review"
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
