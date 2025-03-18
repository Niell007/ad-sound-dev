import { useCallback, useState } from "react";
import { useToast } from "./use-toast";
import type { Review } from "@/lib/types/reviews";

export function useReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/reviews");
            if (!response.ok) throw new Error("Failed to fetch reviews");
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load reviews",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    const deleteReview = useCallback(async (id: string) => {
        try {
            // Optimistically update UI
            setReviews((prev) => prev.filter((review) => review.id !== id));

            const response = await fetch(`/api/reviews/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                // Revert on failure
                fetchReviews();
                throw new Error("Failed to delete review");
            }

            toast({
                title: "Success",
                description: "Review deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete review",
                variant: "destructive",
            });
        }
    }, [toast, fetchReviews]);

    return {
        reviews,
        loading,
        fetchReviews,
        deleteReview,
    };
}
