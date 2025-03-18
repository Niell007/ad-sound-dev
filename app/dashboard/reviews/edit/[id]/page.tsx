"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingPage } from "@/components/ui/loading";
import { useToast } from "@/hooks/use-toast";
import type { Review } from "@/lib/types/reviews";
import { ReviewForm, type ReviewFormValues } from "@/components/review-form";

const reviewSchema = z.object({
  author_name: z.string().min(2),
  rating: z.number().min(1).max(5),
  content: z.string().min(10),
  event_type: z.string().optional(),
  event_date: z.string().optional(),
});

export default function EditReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [review, setReview] = useState<Review | null>(null);

  const form = useForm({
    resolver: zodResolver(reviewSchema),
  });

  useEffect(() => {
    fetchReview();
  }, [params.id]);

  const fetchReview = async () => {
    try {
      const response = await fetch(`/api/reviews/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch review");
      const data = await response.json();
      setReview(data);
      form.reset(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load review",
        variant: "destructive",
      });
      router.push("/dashboard/reviews");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      const response = await fetch(`/api/reviews/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to update review");

      toast({
        title: "Success",
        description: "Review updated successfully",
      });

      router.push("/dashboard/reviews");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Review</CardTitle>
        </CardHeader>
        <CardContent>
          <ReviewForm
            initialData={review || undefined}
            onSubmit={onSubmit}
            onCancel={() => router.push("/dashboard/reviews")}
            isSubmitting={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
}
